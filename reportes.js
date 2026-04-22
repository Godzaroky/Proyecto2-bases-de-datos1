// src/routes/reportes.js — Consultas avanzadas para la UI
const express = require('express');
const router  = express.Router();
const pool    = require('../db');
const { requireAuth } = require('../middleware/auth');

// GET /api/reportes/stock-categoria — usa la VIEW v_stock_por_categoria
router.get('/stock-categoria', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM v_stock_por_categoria ORDER BY valor_inventario DESC`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener reporte de stock.' });
  }
});

// GET /api/reportes/ventas-empleado — usa la VIEW v_ventas_por_empleado
router.get('/ventas-empleado', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM v_ventas_por_empleado ORDER BY monto_total DESC`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener reporte por empleado.' });
  }
});

// GET /api/reportes/productos-sin-venta — subquery con NOT IN
router.get('/productos-sin-venta', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT p.id_producto, p.nombre, p.stock, p.precio_unitario, c.nombre AS categoria
       FROM producto p
       JOIN categoria c ON c.id_categoria = p.id_categoria
       WHERE p.id_producto NOT IN (SELECT DISTINCT id_producto FROM detalle_venta)
       ORDER BY p.nombre`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos sin ventas.' });
  }
});

module.exports = router;
