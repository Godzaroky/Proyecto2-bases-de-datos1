// src/pages/Reportes.jsx — Todos los reportes avanzados con export CSV
import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import api from '../api';

const TABS = [
  { id: 'ventas-cliente',    label: 'Ventas por Cliente' },
  { id: 'productos-vendidos',label: 'Productos Más Vendidos' },
  { id: 'ventas-mensuales',  label: 'Ventas Mensuales' },
  { id: 'stock-bajo',        label: 'Stock Bajo' },
  { id: 'clientes-inactivos',label: 'Clientes Sin Compras' },
  { id: 'stock-categoria',   label: 'Stock por Categoría' },
  { id: 'empleados',         label: 'Desempeño Empleados' },
];

export default function Reportes() {
  const [tab,     setTab]     = useState('ventas-cliente');
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(false);

  const endpoints = {
    'ventas-cliente':     '/reportes/ventas-por-cliente',
    'productos-vendidos': '/reportes/productos-mas-vendidos',
    'ventas-mensuales':   '/reportes/ventas-mensuales',
    'stock-bajo':         '/reportes/stock-bajo',
    'clientes-inactivos': '/reportes/clientes-sin-compras',
    'stock-categoria':    '/reportes/stock-por-categoria',
    'empleados':          '/reportes/empleados',
  };

  useEffect(() => {
    setLoading(true); setData([]);
    api.get(endpoints[tab]).then(r => setData(r.data)).finally(() => setLoading(false));
  }, [tab]);

  const downloadCSV = async () => {
    const csvEndpoints = {
      'productos-vendidos': '/reportes/productos-mas-vendidos/csv',
      'ventas-mensuales':   '/reportes/ventas-mensuales/csv',
    };
    const url = csvEndpoints[tab];
    if (!url) return;
    const res  = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}${url}`, { credentials: 'include' });
    const blob = await res.blob();
    const a    = document.createElement('a');
    a.href     = URL.createObjectURL(blob);
    a.download = `${tab}.csv`;
    a.click();
  };

  const hasCsv = ['productos-vendidos', 'ventas-mensuales'].includes(tab);
  const fmt    = n => `Q${parseFloat(n).toLocaleString('es-GT', { minimumFractionDigits: 2 })}`;

  const renderTable = () => {
    if (loading) return <div className="loading"><div className="spinner" />Cargando reporte...</div>;
    if (data.length === 0) return <div className="empty">Sin datos disponibles.</div>;

    const columns = Object.keys(data[0]);
    return (
      <div className="table-wrap">
        <table>
          <thead>
            <tr>{columns.map(c => <th key={c}>{c.replace(/_/g, ' ')}</th>)}</tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {columns.map(c => {
                  const val = row[c];
                  const isNum = !isNaN(val) && val !== '' && val !== null && typeof val !== 'boolean';
                  const isMoney = ['monto_total','ingresos','ingresos_total','ticket_promedio','ingresos_acumulados','valor_inventario'].includes(c);
                  return (
                    <td key={c} style={isMoney ? { fontFamily: 'var(--font-mono)', color: 'var(--accent)' } : {}}>
                      {isMoney ? fmt(val) : val ?? '—'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const descriptions = {
    'ventas-cliente':     'GROUP BY + HAVING — Clientes con su total de ventas y ticket promedio.',
    'productos-vendidos': 'JOIN múltiple (4 tablas) — Ranking de productos por unidades vendidas.',
    'ventas-mensuales':   'CTE (WITH) — Ventas agrupadas por mes con ingresos acumulados.',
    'stock-bajo':         'Subquery con IN — Productos cuyo stock está bajo el promedio general.',
    'clientes-inactivos': 'Subquery NOT EXISTS correlacionado — Clientes que nunca han comprado.',
    'stock-categoria':    'VIEW v_stock_por_categoria — Inventario valorizado por categoría.',
    'empleados':          'VIEW v_ventas_por_empleado — Ventas totales y monto por empleado.',
  };

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Reportes</div>
          <div className="page-sub">Consultas SQL avanzadas visibles en la UI</div>
        </div>
        {hasCsv && (
          <button className="btn btn-ghost" onClick={downloadCSV}>
            <Download size={15} /> Exportar CSV
          </button>
        )}
      </div>

      <div className="tabs">
        {TABS.map(t => (
          <button key={t.id} className={`tab${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 16 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-3)', background: 'var(--bg-3)', padding: '4px 10px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          SQL — {descriptions[tab]}
        </span>
      </div>

      <div className="card">
        {renderTable()}
      </div>
    </>
  );
}
