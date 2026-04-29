const express = require('express');
const router  = express.Router();
const pool    = require('../db');
const { requireAuth } = require('../middleware/auth');

router.get('/ventas-por-cliente', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.id_cliente,
              c.nombre || ' ' || c.apellido AS cliente,
              COUNT(v.id_venta)             AS total_ventas,
              SUM(v.total)                  AS monto_total,
              AVG(v.total)                  AS ticket_promedio
       FROM cliente c
       JOIN venta v ON v.id_cliente = c.id_cliente
       GROUP BY c.id_cliente, c.nombre, c.apellido, c.email
       HAVING COUNT(v.id_venta) >= 1
       ORDER BY monto_total DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error en reporte.' });
  }
});

router.get('/productos-mas-vendidos', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.nombre AS producto, cat.nombre AS categoria,
              SUM(dv.cantidad) AS unidades_vendidas,
              SUM(dv.cantidad * dv.precio_unitario) AS ingresos_total,
              p.stock AS stock_actual
       FROM detalle_venta dv
       JOIN producto p   ON p.id_producto   = dv.id_producto
       JOIN categoria cat ON cat.id_categoria = p.id_categoria
       JOIN venta v       ON v.id_venta      = dv.id_venta
       GROUP BY p.id_producto, p.nombre, cat.nombre, p.stock
       ORDER BY unidades_vendidas DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error en reporte.' });
  }
});

router.get('/ventas-mensuales', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `WITH ventas_por_mes AS (
         SELECT DATE_TRUNC('month', fecha) AS mes,
                COUNT(id_venta)            AS total_ventas,
                SUM(total)                 AS ingresos,
                AVG(total)                 AS ticket_promedio
         FROM venta
         GROUP BY DATE_TRUNC('month', fecha)
       )
       SELECT TO_CHAR(mes, 'Month YYYY') AS mes,
              total_ventas, ingresos,
              ROUND(ticket_promedio::numeric, 2) AS ticket_promedio,
              SUM(ingresos) OVER (ORDER BY mes) AS ingresos_acumulados
       FROM ventas_por_mes
       ORDER BY mes`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error en reporte.' });
  }
});

router.get('/stock-bajo', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.id_producto, p.nombre, p.stock, p.precio_unitario,
              cat.nombre AS categoria, pr.nombre AS proveedor
       FROM producto p
       JOIN categoria cat ON cat.id_categoria = p.id_categoria
       JOIN proveedor  pr ON pr.id_proveedor  = p.id_proveedor
       WHERE p.id_producto IN (
         SELECT id_producto FROM producto
         WHERE stock < (SELECT AVG(stock) FROM producto)
       )
       ORDER BY p.stock ASC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error en reporte.' });
  }
});

router.get('/clientes-sin-compras', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.id_cliente, c.nombre || ' ' || c.apellido AS cliente,
              c.email, c.telefono
       FROM cliente c
       WHERE NOT EXISTS (
         SELECT 1 FROM venta v WHERE v.id_cliente = c.id_cliente
       )
       ORDER BY c.apellido`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error en reporte.' });
  }
});

router.get('/stock-por-categoria', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM v_stock_por_categoria ORDER BY valor_inventario DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error en reporte.' });
  }
});

router.get('/empleados', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM v_ventas_por_empleado ORDER BY monto_total DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error en reporte.' });
  }
});

router.get('/productos-mas-vendidos/csv', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.nombre AS producto, cat.nombre AS categoria,
              SUM(dv.cantidad) AS unidades_vendidas,
              SUM(dv.cantidad * dv.precio_unitario) AS ingresos_total,
              p.stock AS stock_actual
       FROM detalle_venta dv
       JOIN producto p    ON p.id_producto   = dv.id_producto
       JOIN categoria cat ON cat.id_categoria = p.id_categoria
       GROUP BY p.nombre, cat.nombre, p.stock
       ORDER BY unidades_vendidas DESC`
    );
    const { Parser } = require('json2csv');
    const parser = new Parser({ fields: ['producto','categoria','unidades_vendidas','ingresos_total','stock_actual'] });
    const csv = parser.parse(result.rows);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="productos.csv"');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: 'Error al exportar CSV.' });
  }
});

router.get('/ventas-mensuales/csv', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `WITH ventas_por_mes AS (
         SELECT DATE_TRUNC('month', fecha) AS mes,
                COUNT(id_venta) AS total_ventas, SUM(total) AS ingresos
         FROM venta GROUP BY DATE_TRUNC('month', fecha)
       )
       SELECT TO_CHAR(mes, 'Month YYYY') AS mes, total_ventas, ingresos
       FROM ventas_por_mes ORDER BY mes`
    );
    const { Parser } = require('json2csv');
    const parser = new Parser({ fields: ['mes','total_ventas','ingresos'] });
    const csv = parser.parse(result.rows);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="ventas_mensuales.csv"');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: 'Error al exportar CSV.' });
  }
});

module.exports = router;