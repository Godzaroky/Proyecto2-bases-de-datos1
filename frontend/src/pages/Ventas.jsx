// src/pages/Ventas.jsx — Listado de ventas + nueva venta con transacción
import { useEffect, useState } from 'react';
import { Plus, X, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Ventas() {
  const { usuario }             = useAuth();
  const [ventas,     setVentas]     = useState([]);
  const [clientes,   setClientes]   = useState([]);
  const [empleados,  setEmpleados]  = useState([]);
  const [productos,  setProductos]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [modal,      setModal]      = useState(false);
  const [detalle,    setDetalle]    = useState(null);  // modal detalle
  const [saving,     setSaving]     = useState(false);

  // Form nueva venta
  const [idCliente,  setIdCliente]  = useState('');
  const [idEmpleado, setIdEmpleado] = useState('');
  const [items,      setItems]      = useState([{ id_producto: '', cantidad: 1 }]);

  const fetchVentas = () => api.get('/ventas').then(r => { setVentas(r.data); setLoading(false); });

  useEffect(() => {
    Promise.all([
      api.get('/ventas'), api.get('/clientes'),
      api.get('/productos'),
    ]).then(([v, c, p]) => {
      setVentas(v.data); setClientes(c.data); setProductos(p.data);
      setLoading(false);
    });
    // Empleados via hack: reutilizamos reporte
    api.get('/reportes/empleados').then(r => setEmpleados(r.data));
  }, []);

  const openModal = () => { setIdCliente(''); setIdEmpleado(''); setItems([{ id_producto: '', cantidad: 1 }]); setModal(true); };
  const closeModal = () => setModal(false);

  const addItem    = () => setItems([...items, { id_producto: '', cantidad: 1 }]);
  const removeItem = i  => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i, key, val) => setItems(items.map((it, idx) => idx === i ? { ...it, [key]: val } : it));

  const calcTotal = () => items.reduce((sum, it) => {
    const p = productos.find(p => p.id_producto === parseInt(it.id_producto));
    return sum + (p ? p.precio_unitario * it.cantidad : 0);
  }, 0);

  const handleSubmit = async e => {
    e.preventDefault();
    if (items.some(it => !it.id_producto || it.cantidad < 1)) {
      return toast.error('Completa todos los productos.');
    }
    setSaving(true);
    try {
      await api.post('/ventas', {
        id_cliente:  parseInt(idCliente),
        id_empleado: parseInt(idEmpleado),
        detalle: items.map(it => ({ id_producto: parseInt(it.id_producto), cantidad: parseInt(it.cantidad) })),
      });
      toast.success('Venta registrada correctamente.');
      closeModal(); fetchVentas();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al registrar venta.');
    } finally { setSaving(false); }
  };

  const verDetalle = async id => {
    const res = await api.get(`/ventas/${id}`);
    setDetalle(res.data);
  };

  const fmt = n => `Q${parseFloat(n).toFixed(2)}`;

  if (loading) return <div className="loading"><div className="spinner" />Cargando ventas...</div>;

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Ventas</div>
          <div className="page-sub">{ventas.length} ventas registradas</div>
        </div>
        <button className="btn btn-primary" onClick={openModal}><Plus size={16} /> Nueva Venta</button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>#</th><th>Fecha</th><th>Cliente</th><th>Empleado</th><th>Total</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {ventas.length === 0 && <tr><td colSpan={6}><div className="empty">No hay ventas.</div></td></tr>}
              {ventas.map(v => (
                <tr key={v.id_venta}>
                  <td><span className="chip">{v.id_venta}</span></td>
                  <td style={{ color: 'var(--text-2)', fontSize: '0.85rem' }}>{new Date(v.fecha).toLocaleString('es-GT')}</td>
                  <td style={{ fontWeight: 500 }}>{v.cliente}</td>
                  <td style={{ color: 'var(--text-2)' }}>{v.empleado}</td>
                  <td style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{fmt(v.total)}</td>
                  <td>
                    <button className="btn btn-ghost btn-sm" onClick={() => verDetalle(v.id_venta)}><Eye size={13} /> Ver</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal nueva venta */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal" style={{ maxWidth: 620 }}>
            <div className="modal-header">
              <span className="modal-title">Nueva Venta</span>
              <button className="btn btn-ghost btn-sm" onClick={closeModal}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid" style={{ marginBottom: 20 }}>
                  <div className="form-group">
                    <label>Cliente</label>
                    <select required value={idCliente} onChange={e => setIdCliente(e.target.value)}>
                      <option value="">Seleccionar...</option>
                      {clientes.map(c => <option key={c.id_cliente} value={c.id_cliente}>{c.nombre} {c.apellido}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Empleado</label>
                    <select required value={idEmpleado} onChange={e => setIdEmpleado(e.target.value)}>
                      <option value="">Seleccionar...</option>
                      {empleados.map(e => <option key={e.id_empleado} value={e.id_empleado}>{e.empleado}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <label style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Productos</label>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={addItem}><Plus size={13} /> Agregar</button>
                </div>

                {items.map((it, i) => {
                  const prod = productos.find(p => p.id_producto === parseInt(it.id_producto));
                  return (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 90px 32px', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                      <select required value={it.id_producto} onChange={e => updateItem(i, 'id_producto', e.target.value)}>
                        <option value="">Seleccionar producto...</option>
                        {productos.map(p => <option key={p.id_producto} value={p.id_producto}>{p.nombre} (stock: {p.stock})</option>)}
                      </select>
                      <input type="number" min="1" max={prod?.stock || 999} value={it.cantidad} onChange={e => updateItem(i, 'cantidad', e.target.value)} />
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--accent)', textAlign: 'right', paddingRight: 4 }}>
                        {prod ? `Q${(prod.precio_unitario * it.cantidad).toFixed(2)}` : '—'}
                      </div>
                      {items.length > 1 && (
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => removeItem(i)} style={{ padding: '5px' }}><Trash2 size={13} /></button>
                      )}
                    </div>
                  );
                })}

                <div style={{ textAlign: 'right', marginTop: 16, fontFamily: 'var(--font-head)', fontSize: '1.1rem', fontWeight: 700 }}>
                  Total: <span style={{ color: 'var(--accent)' }}>Q{calcTotal().toFixed(2)}</span>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Procesando...' : 'Registrar Venta'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal detalle venta */}
      {detalle && (
        <div className="modal-overlay" onClick={() => setDetalle(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Venta #{detalle.id_venta}</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setDetalle(null)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20, fontSize: '0.85rem' }}>
                <div><span style={{ color: 'var(--text-3)' }}>Cliente: </span>{detalle.cliente}</div>
                <div><span style={{ color: 'var(--text-3)' }}>Empleado: </span>{detalle.empleado}</div>
                <div><span style={{ color: 'var(--text-3)' }}>Fecha: </span>{new Date(detalle.fecha).toLocaleString('es-GT')}</div>
                <div><span style={{ color: 'var(--text-3)' }}>Total: </span><strong style={{ color: 'var(--accent)' }}>{fmt(detalle.total)}</strong></div>
              </div>
              <table>
                <thead><tr><th>Producto</th><th>Categoría</th><th>Cant.</th><th>Precio</th><th>Subtotal</th></tr></thead>
                <tbody>
                  {detalle.detalle.map((d, i) => (
                    <tr key={i}>
                      <td>{d.producto}</td>
                      <td><span className="badge badge-amber">{d.categoria}</span></td>
                      <td>{d.cantidad}</td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{fmt(d.precio_unitario)}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>{fmt(d.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
