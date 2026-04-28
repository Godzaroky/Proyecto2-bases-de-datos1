// src/routes/proveedores.js
const express = require('express');
const router  = express.Router();
const pool    = require('../db');
const { requireAuth } = require('../middleware/auth');

router.get('/', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM proveedor ORDER BY nombre`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener proveedores.' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  const { nombre, telefono, email, direccion } = req.body;
  if (!nombre) return res.status(400).json({ error: 'El nombre es requerido.' });
  try {
    const { rows } = await pool.query(
      `INSERT INTO proveedor (nombre, telefono, email, direccion) VALUES ($1,$2,$3,$4) RETURNING *`,
      [nombre, telefono || null, email || null, direccion || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear proveedor.' });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  const { nombre, telefono, email, direccion } = req.body;
  if (!nombre) return res.status(400).json({ error: 'El nombre es requerido.' });
  try {
    const { rows } = await pool.query(
      `UPDATE proveedor SET nombre=$1, telefono=$2, email=$3, direccion=$4
       WHERE id_proveedor=$5 RETURNING *`,
      [nombre, telefono || null, email || null, direccion || null, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Proveedor no encontrado.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar proveedor.' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `DELETE FROM proveedor WHERE id_proveedor=$1 RETURNING *`, [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Proveedor no encontrado.' });
    res.json({ mensaje: 'Proveedor eliminado.' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar proveedor.' });
  }
});

module.exports = router;
