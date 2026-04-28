// src/index.js — Entrada principal del servidor
require('dotenv').config();
const express        = require('express');
const cors           = require('cors');
const session        = require('express-session');

const authRoutes       = require('./routes/auth');
const productosRoutes  = require('./routes/productos');
const clientesRoutes   = require('./routes/clientes');
const ventasRoutes     = require('./routes/ventas');
const categoriasRoutes = require('./routes/categorias');
const proveedoresRoutes= require('./routes/proveedores');
const reportesRoutes   = require('./routes/reportes');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares globales ──────────────────────────────────────
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(session({
  secret:            process.env.SESSION_SECRET || 'proyecto2_secret_key',
  resave:            false,
  saveUninitialized: false,
  cookie: {
    secure:   false,   // true en producción con HTTPS
    httpOnly: true,
    maxAge:   1000 * 60 * 60 * 8,  // 8 horas
  },
}));

// ── Rutas ─────────────────────────────────────────────────────
app.use('/api/auth',        authRoutes);
app.use('/api/productos',   productosRoutes);
app.use('/api/clientes',    clientesRoutes);
app.use('/api/ventas',      ventasRoutes);
app.use('/api/categorias',  categoriasRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/reportes',    reportesRoutes);

// ── Health check ──────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// ── Manejo de rutas no encontradas ────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada.' });
});

// ── Manejo global de errores ──────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
