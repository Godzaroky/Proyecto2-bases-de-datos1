// src/routes/auth.js — Login y logout
const express = require('express');
const router  = express.Router();
const pool    = require('../db');
const bcrypt  = require('bcryptjs');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Usuario y contraseña son requeridos.' });

  try {
    const { rows } = await pool.query(
      `SELECT u.id_usuario, u.username, u.password_hash, u.rol,
              e.nombre || ' ' || e.apellido AS nombre_completo
       FROM usuario u
       JOIN empleado e ON e.id_empleado = u.id_empleado
       WHERE u.username = $1`,
      [username]
    );
    if (rows.length === 0)
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });

    const usuario = rows[0];
    const valido  = await bcrypt.compare(password, usuario.password_hash);
    if (!valido)
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });

    req.session.usuario = {
      id:              usuario.id_usuario,
      username:        usuario.username,
      rol:             usuario.rol,
      nombre_completo: usuario.nombre_completo,
    };
    res.json({ mensaje: 'Inicio de sesión exitoso.', usuario: req.session.usuario });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: 'Error al cerrar sesión.' });
    res.clearCookie('connect.sid');
    res.json({ mensaje: 'Sesión cerrada correctamente.' });
  });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  if (!req.session.usuario)
    return res.status(401).json({ autenticado: false });
  res.json({ autenticado: true, usuario: req.session.usuario });
});

module.exports = router;