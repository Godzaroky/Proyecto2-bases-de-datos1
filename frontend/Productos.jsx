// src/pages/Productos.jsx — CRUD completo de productos
import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';

const empty = { nombre: '', descripcion: '', precio_unitario: '', stock: '', id_categoria: '', id_proveedor: '' };

export default function Productos() {
  const [productos,   setProductos]   = useState([]);
  const [categorias,  setCategorias]  = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [modal,       setModal]       = useState(false);
  const [form,        setForm]        = useState(empty);
  const [editId,      setEditId]      = useState(null);
  const [saving,      setSaving]      = useState(false);
  const [search,      setSearch]      = useState('');

  const fetchAll = async () => {
    const [p, c, pr] = await Promise.all([
      api.get('/productos'), api.get('/categorias'), api.get('/proveedores')
    ]);
    setProductos(p.data); setCategorias(c.data); setProveedores(pr.data);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => { setForm(empty); setEditId(null); setModal(true); };
  const openEdit   = p  => { setForm({ ...p, id_categoria: p.id_categoria, id_proveedor: p.id_proveedor }); setEditId(p.id_producto); setModal(true); };
  const closeModal = () => { setModal(false); setForm(empty); setEditId(null); };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await api.put(`/productos/${editId}`, form);
        toast.success('Producto actualizado.');
      } else {
        await api.post('/productos', form);
        toast.success('Producto creado.');
      }
      closeModal(); fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al guardar.');
    } finally { setSaving(false); }
  };

  const handleDelete = async id => {
    if (!confirm('¿Eliminar este producto?')) return;
    try {
      await api.delete(`/productos/${id}`);
      toast.success('Producto eliminado.');
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.error || 'No se pudo eliminar.');
    }
  };

  const filtered = productos.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    p.categoria.toLowerCase().includes(search.toLowerCase())
  );

  const fmt = n => `Q${parseFloat(n).toFixed(2)}`;

  if (loading) return <div className="loading"><div className="spinner" />Cargando productos...</div>;

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Productos</div>
          <div className="page-sub">{productos.length} productos registrados</div>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> Nuevo Producto
        </button>
      </div>

      <div className="card">
        <div className="search-bar">
          <input
            className="search-input"
            placeholder="Buscar por nombre o categoría..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nombre</th><th>Categoría</th><th>Proveedor</th>
                <th>Precio</th><th>Stock</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6}><div className="empty">No hay productos.</div></td></tr>
              )}
              {filtered.map(p => (
                <tr key={p.id_producto}>
                  <td style={{ fontWeight: 500 }}>{p.nombre}</td>
                  <td><span className="badge badge-amber">{p.categoria}</span></td>
                  <td style={{ color: 'var(--text-2)' }}>{p.proveedor}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>{fmt(p.precio_unitario)}</td>
                  <td>
                    <span className={`badge ${p.stock === 0 ? 'badge-red' : p.stock < 20 ? 'badge-amber' : 'badge-green'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}><Pencil size={13} /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id_producto)}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">{editId ? 'Editar Producto' : 'Nuevo Producto'}</span>
              <button className="btn btn-ghost btn-sm" onClick={closeModal}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group full">
                    <label>Nombre</label>
                    <input required value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} placeholder="Nombre del producto" />
                  </div>
                  <div className="form-group">
                    <label>Precio Unitario (Q)</label>
                    <input required type="number" step="0.01" min="0" value={form.precio_unitario} onChange={e => setForm({ ...form, precio_unitario: e.target.value })} placeholder="0.00" />
                  </div>
                  <div className="form-group">
                    <label>Stock</label>
                    <input required type="number" min="0" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} placeholder="0" />
                  </div>
                  <div className="form-group">
                    <label>Categoría</label>
                    <select required value={form.id_categoria} onChange={e => setForm({ ...form, id_categoria: e.target.value })}>
                      <option value="">Seleccionar...</option>
                      {categorias.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Proveedor</label>
                    <select required value={form.id_proveedor} onChange={e => setForm({ ...form, id_proveedor: e.target.value })}>
                      <option value="">Seleccionar...</option>
                      {proveedores.map(p => <option key={p.id_proveedor} value={p.id_proveedor}>{p.nombre}</option>)}
                    </select>
                  </div>
                  <div className="form-group full">
                    <label>Descripción</label>
                    <textarea value={form.descripcion || ''} onChange={e => setForm({ ...form, descripcion: e.target.value })} placeholder="Descripción opcional" />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
