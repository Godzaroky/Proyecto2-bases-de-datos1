// src/routes/productos.js — CRUD completo de productos
const express = require('express');
const router  = express.Router();
const pool    = require('../db');
const { requireAuth } = require('../middleware/auth');

// GET /api/productos — JOIN con categoria y proveedor (cubre requisito JOIN)
router.get('/', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT p.id_producto, p.nombre, p.descripcion,
              p.precio_unitario, p.stock,
              c.nombre AS categoria,
              pr.nombre AS proveedor,
              p.id_categoria, p.id_proveedor
       FROM producto p
       JOIN categoria c  ON c.id_categoria = p.id_categoria
       JOIN proveedor pr ON pr.id_proveedor = p.id_proveedor
       ORDER BY p.nombre`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener productos.' });
  }
});

// GET /api/productos/stock-bajo — subquery: productos con stock menor al promedio (cubre subquery)
router.get('/reportes/stock-bajo', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT p.id_producto, p.nombre, p.stock, p.precio_unitario,
              c.nombre AS categoria
       FROM producto p
       JOIN categoria c ON c.id_categoria = p.id_categoria
       WHERE p.stock < (SELECT AVG(stock) FROM producto)
       ORDER BY p.stock ASC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos con stock bajo.' });
  }
});

// GET /api/productos/:id
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT p.*, c.nombre AS categoria, pr.nombre AS proveedor
       FROM producto p
       JOIN categoria c  ON c.id_categoria = p.id_categoria
       JOIN proveedor pr ON pr.id_proveedor = p.id_proveedor
       WHERE p.id_producto = $1`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Producto no encontrado.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener producto.' });
  }
});

// POST /api/productos
router.post('/', requireAuth, async (req, res) => {
  const { nombre, descripcion, precio_unitario, stock, id_categoria, id_proveedor } = req.body;
  if (!nombre || !precio_unitario || !id_categoria || !id_proveedor)
    return res.status(400).json({ error: 'Nombre, precio, categoría y proveedor son requeridos.' });
  try {
    const { rows } = await pool.query(
      `INSERT INTO producto (nombre, descripcion, precio_unitario, stock, id_categoria, id_proveedor)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [nombre, descripcion || null, precio_unitario, stock || 0, id_categoria, id_proveedor]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear producto.' });
  }
});

// PUT /api/productos/:id
router.put('/:id', requireAuth, async (req, res) => {
  const { nombre, descripcion, precio_unitario, stock, id_categoria, id_proveedor } = req.body;
  if (!nombre || !precio_unitario || !id_categoria || !id_proveedor)
    return res.status(400).json({ error: 'Nombre, precio, categoría y proveedor son requeridos.' });
  try {
    const { rows } = await pool.query(
      `UPDATE producto
       SET nombre=$1, descripcion=$2, precio_unitario=$3, stock=$4,
           id_categoria=$5, id_proveedor=$6
       WHERE id_producto=$7 RETURNING *`,
      [nombre, descripcion || null, precio_unitario, stock, id_categoria, id_proveedor, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Producto no encontrado.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar producto.' });
  }
});

// DELETE /api/productos/:id
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `DELETE FROM producto WHERE id_producto=$1 RETURNING *`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Producto no encontrado.' });
    res.json({ mensaje: 'Producto eliminado correctamente.' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar producto.' });
  }
});

module.exports = router;
