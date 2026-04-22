// src/routes/ventas.js — Ventas con TRANSACCIÓN EXPLÍCITA
const express = require('express');
const router  = express.Router();
const pool    = require('../db');
const { requireAuth } = require('../middleware/auth');
const { Parser } = require('json2csv');

// GET /api/ventas — JOIN entre venta, cliente, empleado (cubre JOIN)
router.get('/', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT v.id_venta, v.fecha, v.total,
              c.nombre || ' ' || c.apellido AS cliente,
              e.nombre || ' ' || e.apellido AS empleado
       FROM venta v
       JOIN cliente  c ON c.id_cliente  = v.id_cliente
       JOIN empleado e ON e.id_empleado = v.id_empleado
       ORDER BY v.fecha DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener ventas.' });
  }
});

// GET /api/ventas/:id — detalle completo de una venta (usa la VIEW)
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM v_ventas_detalle WHERE id_venta=$1`, [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Venta no encontrada.' });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener detalle de venta.' });
  }
});

// GET /api/ventas/reportes/por-mes — GROUP BY + funciones de agregación
router.get('/reportes/por-mes', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT TO_CHAR(fecha, 'YYYY-MM') AS mes,
              COUNT(*)                  AS total_ventas,
              SUM(total)                AS ingresos,
              AVG(total)                AS ticket_promedio,
              MAX(total)                AS venta_maxima,
              MIN(total)                AS venta_minima
       FROM venta
       GROUP BY TO_CHAR(fecha, 'YYYY-MM')
       HAVING COUNT(*) > 0
       ORDER BY mes DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener reporte por mes.' });
  }
});

// GET /api/ventas/reportes/productos-mas-vendidos — CTE (WITH)
router.get('/reportes/productos-mas-vendidos', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `WITH ventas_por_producto AS (
         SELECT dv.id_producto,
                SUM(dv.cantidad)                   AS unidades_vendidas,
                SUM(dv.cantidad * dv.precio_unitario) AS ingreso_total
         FROM detalle_venta dv
         GROUP BY dv.id_producto
       )
       SELECT p.nombre        AS producto,
              c.nombre        AS categoria,
              vp.unidades_vendidas,
              vp.ingreso_total
       FROM ventas_por_producto vp
       JOIN producto  p ON p.id_producto  = vp.id_producto
       JOIN categoria c ON c.id_categoria = p.id_categoria
       ORDER BY vp.unidades_vendidas DESC
       LIMIT 10`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos más vendidos.' });
  }
});

// GET /api/ventas/reportes/clientes-sin-compra — subquery con NOT EXISTS
router.get('/reportes/clientes-sin-compra', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT c.id_cliente, c.nombre || ' ' || c.apellido AS cliente, c.email
       FROM cliente c
       WHERE NOT EXISTS (
         SELECT 1 FROM venta v WHERE v.id_cliente = c.id_cliente
       )
       ORDER BY c.apellido`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener clientes sin compra.' });
  }
});

// GET /api/ventas/reportes/exportar-csv — exportar reporte a CSV
router.get('/reportes/exportar-csv', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT v.id_venta, TO_CHAR(v.fecha,'DD/MM/YYYY HH24:MI') AS fecha,
              c.nombre || ' ' || c.apellido AS cliente,
              e.nombre || ' ' || e.apellido AS empleado,
              v.total
       FROM venta v
       JOIN cliente  c ON c.id_cliente  = v.id_cliente
       JOIN empleado e ON e.id_empleado = v.id_empleado
       ORDER BY v.fecha DESC`
    );
    const parser = new Parser({
      fields: ['id_venta','fecha','cliente','empleado','total']
    });
    const csv = parser.parse(rows);
    res.header('Content-Type', 'text/csv');
    res.attachment('reporte_ventas.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: 'Error al exportar CSV.' });
  }
});

// POST /api/ventas — TRANSACCIÓN EXPLÍCITA con ROLLBACK
router.post('/', requireAuth, async (req, res) => {
  const { id_cliente, id_empleado, detalle } = req.body;

  if (!id_cliente || !id_empleado || !detalle || detalle.length === 0)
    return res.status(400).json({ error: 'Cliente, empleado y al menos 1 producto son requeridos.' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Calcular total y verificar stock de cada producto
    let total = 0;
    for (const item of detalle) {
      if (!item.id_producto || !item.cantidad || item.cantidad <= 0)
        throw new Error('Cada item debe tener id_producto y cantidad válida.');

      const { rows } = await client.query(
        `SELECT nombre, stock, precio_unitario FROM producto WHERE id_producto=$1 FOR UPDATE`,
        [item.id_producto]
      );
      if (rows.length === 0) throw new Error(`Producto ID ${item.id_producto} no encontrado.`);

      const producto = rows[0];
      if (producto.stock < item.cantidad)
        throw new Error(`Stock insuficiente para "${producto.nombre}". Disponible: ${producto.stock}.`);

      item.precio_unitario = producto.precio_unitario;
      total += item.cantidad * producto.precio_unitario;
    }

    // 2. Insertar la venta
    const { rows: ventaRows } = await client.query(
      `INSERT INTO venta (fecha, total, id_cliente, id_empleado)
       VALUES (NOW(), $1, $2, $3) RETURNING id_venta`,
      [total, id_cliente, id_empleado]
    );
    const id_venta = ventaRows[0].id_venta;

    // 3. Insertar detalle y descontar stock
    for (const item of detalle) {
      await client.query(
        `INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario)
         VALUES ($1, $2, $3, $4)`,
        [id_venta, item.id_producto, item.cantidad, item.precio_unitario]
      );
      await client.query(
        `UPDATE producto SET stock = stock - $1 WHERE id_producto = $2`,
        [item.cantidad, item.id_producto]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ mensaje: 'Venta registrada correctamente.', id_venta, total });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('ROLLBACK ejecutado:', err.message);
    res.status(400).json({ error: err.message });
  } finally {
    client.release();
  }
});

module.exports = router;
