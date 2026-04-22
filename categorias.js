// src/routes/categorias.js
const express = require('express');
const router  = express.Router();
const pool    = require('../db');
const { requireAuth } = require('../middleware/auth');

router.get('/', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM categoria ORDER BY nombre`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener categorías.' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  const { nombre, descripcion } = req.body;
  if (!nombre) return res.status(400).json({ error: 'El nombre es requerido.' });
  try {
    const { rows } = await pool.query(
      `INSERT INTO categoria (nombre, descripcion) VALUES ($1,$2) RETURNING *`,
      [nombre, descripcion || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear categoría.' });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  const { nombre, descripcion } = req.body;
  if (!nombre) return res.status(400).json({ error: 'El nombre es requerido.' });
  try {
    const { rows } = await pool.query(
      `UPDATE categoria SET nombre=$1, descripcion=$2 WHERE id_categoria=$3 RETURNING *`,
      [nombre, descripcion || null, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Categoría no encontrada.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar categoría.' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `DELETE FROM categoria WHERE id_categoria=$1 RETURNING *`, [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Categoría no encontrada.' });
    res.json({ mensaje: 'Categoría eliminada.' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar categoría.' });
  }
});

module.exports = router;
