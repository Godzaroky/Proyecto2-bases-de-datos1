// src/routes/clientes.js — CRUD completo de clientes
const express = require('express');
const router  = express.Router();
const pool    = require('../db');
const { requireAuth } = require('../middleware/auth');

// GET /api/clientes
router.get('/', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM cliente ORDER BY apellido, nombre`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener clientes.' });
  }
});

// GET /api/clientes/top — clientes con más compras (GROUP BY + HAVING)
router.get('/reportes/top', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT c.id_cliente,
              c.nombre || ' ' || c.apellido AS cliente,
              c.email,
              COUNT(v.id_venta)          AS total_compras,
              SUM(v.total)               AS monto_total,
              AVG(v.total)               AS ticket_promedio
       FROM cliente c
       JOIN venta v ON v.id_cliente = c.id_cliente
       GROUP BY c.id_cliente, c.nombre, c.apellido, c.email
       HAVING COUNT(v.id_venta) >= 1
       ORDER BY monto_total DESC
       LIMIT 10`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener top clientes.' });
  }
});

// GET /api/clientes/:id
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM cliente WHERE id_cliente=$1`, [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Cliente no encontrado.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener cliente.' });
  }
});

// POST /api/clientes
router.post('/', requireAuth, async (req, res) => {
  const { nombre, apellido, email, telefono, direccion } = req.body;
  if (!nombre || !apellido)
    return res.status(400).json({ error: 'Nombre y apellido son requeridos.' });
  try {
    const { rows } = await pool.query(
      `INSERT INTO cliente (nombre, apellido, email, telefono, direccion)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [nombre, apellido, email || null, telefono || null, direccion || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ error: 'El email ya está registrado.' });
    res.status(500).json({ error: 'Error al crear cliente.' });
  }
});

// PUT /api/clientes/:id
router.put('/:id', requireAuth, async (req, res) => {
  const { nombre, apellido, email, telefono, direccion } = req.body;
  if (!nombre || !apellido)
    return res.status(400).json({ error: 'Nombre y apellido son requeridos.' });
  try {
    const { rows } = await pool.query(
      `UPDATE cliente SET nombre=$1, apellido=$2, email=$3, telefono=$4, direccion=$5
       WHERE id_cliente=$6 RETURNING *`,
      [nombre, apellido, email || null, telefono || null, direccion || null, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Cliente no encontrado.' });
    res.json(rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ error: 'El email ya está registrado.' });
    res.status(500).json({ error: 'Error al actualizar cliente.' });
  }
});

// DELETE /api/clientes/:id
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `DELETE FROM cliente WHERE id_cliente=$1 RETURNING *`, [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Cliente no encontrado.' });
    res.json({ mensaje: 'Cliente eliminado correctamente.' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar cliente.' });
  }
});

module.exports = router;
