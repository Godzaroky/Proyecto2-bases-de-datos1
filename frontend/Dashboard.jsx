// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { Package, Users, ShoppingCart, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import api from '../api';

export default function Dashboard() {
  const [stats,   setStats]   = useState(null);
  const [recientes, setRecientes] = useState([]);
  const [stockBajo, setStockBajo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/reportes/ventas-mensuales'),
      api.get('/ventas'),
      api.get('/reportes/stock-bajo'),
      api.get('/clientes'),
      api.get('/productos'),
    ]).then(([mensual, ventas, stock, clientes, productos]) => {
      const totalVentas   = ventas.data.length;
      const totalClientes = clientes.data.length;
      const totalProductos = productos.data.length;
      const ingresosMes   = mensual.data.at(-1)?.ingresos || 0;
      setStats({ totalVentas, totalClientes, totalProductos, ingresosMes });
      setRecientes(ventas.data.slice(0, 5));
      setStockBajo(stock.data.slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading"><div className="spinner" />Cargando dashboard...</div>;

  const fmt = n => `Q${parseFloat(n).toLocaleString('es-GT', { minimumFractionDigits: 2 })}`;

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">Resumen general del sistema</div>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Total Ventas</div>
          <div className="stat-value">{stats.totalVentas}</div>
          <ShoppingCart size={28} className="stat-icon" />
        </div>
        <div className="stat-card">
          <div className="stat-label">Ingresos último mes</div>
          <div className="stat-value" style={{ fontSize: '1.4rem' }}>{fmt(stats.ingresosMes)}</div>
          <DollarSign size={28} className="stat-icon" />
        </div>
        <div className="stat-card">
          <div className="stat-label">Clientes</div>
          <div className="stat-value">{stats.totalClientes}</div>
          <Users size={28} className="stat-icon" />
        </div>
        <div className="stat-card">
          <div className="stat-label">Productos</div>
          <div className="stat-value">{stats.totalProductos}</div>
          <Package size={28} className="stat-icon" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Ventas recientes */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <TrendingUp size={16} color="var(--accent)" />
            <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700 }}>Ventas Recientes</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th><th>Cliente</th><th>Total</th><th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {recientes.map(v => (
                  <tr key={v.id_venta}>
                    <td><span className="chip">{v.id_venta}</span></td>
                    <td>{v.cliente}</td>
                    <td style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>{fmt(v.total)}</td>
                    <td style={{ color: 'var(--text-3)', fontSize: '0.8rem' }}>
                      {new Date(v.fecha).toLocaleDateString('es-GT')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock bajo */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <AlertTriangle size={16} color="var(--danger)" />
            <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700 }}>Stock Bajo</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Producto</th><th>Stock</th><th>Categoría</th></tr>
              </thead>
              <tbody>
                {stockBajo.map(p => (
                  <tr key={p.id_producto}>
                    <td>{p.nombre}</td>
                    <td>
                      <span className={`badge ${p.stock <= 10 ? 'badge-red' : 'badge-amber'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-3)', fontSize: '0.82rem' }}>{p.categoria}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
