// src/pages/Clientes.jsx — CRUD completo de clientes
import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';

const empty = { nombre: '', apellido: '', email: '', telefono: '', direccion: '' };

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(false);
  const [form,     setForm]     = useState(empty);
  const [editId,   setEditId]   = useState(null);
  const [saving,   setSaving]   = useState(false);
  const [search,   setSearch]   = useState('');

  const fetchAll = () => api.get('/clientes').then(r => { setClientes(r.data); setLoading(false); });
  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => { setForm(empty); setEditId(null); setModal(true); };
  const openEdit   = c  => { setForm(c); setEditId(c.id_cliente); setModal(true); };
  const closeModal = () => { setModal(false); setForm(empty); setEditId(null); };

  const handleSubmit = async e => {
    e.preventDefault(); setSaving(true);
    try {
      editId ? await api.put(`/clientes/${editId}`, form) : await api.post('/clientes', form);
      toast.success(editId ? 'Cliente actualizado.' : 'Cliente creado.');
      closeModal(); fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al guardar.');
    } finally { setSaving(false); }
  };

  const handleDelete = async id => {
    if (!confirm('¿Eliminar este cliente?')) return;
    try {
      await api.delete(`/clientes/${id}`);
      toast.success('Cliente eliminado.'); fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.error || 'No se pudo eliminar.');
    }
  };

  const filtered = clientes.filter(c =>
    `${c.nombre} ${c.apellido} ${c.email}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading"><div className="spinner" />Cargando clientes...</div>;

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Clientes</div>
          <div className="page-sub">{clientes.length} clientes registrados</div>
        </div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> Nuevo Cliente</button>
      </div>

      <div className="card">
        <div className="search-bar">
          <input className="search-input" placeholder="Buscar cliente..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Nombre</th><th>Email</th><th>Teléfono</th><th>Dirección</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan={5}><div className="empty">No hay clientes.</div></td></tr>}
              {filtered.map(c => (
                <tr key={c.id_cliente}>
                  <td style={{ fontWeight: 500 }}>{c.nombre} {c.apellido}</td>
                  <td style={{ color: 'var(--text-2)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>{c.email}</td>
                  <td style={{ color: 'var(--text-2)' }}>{c.telefono}</td>
                  <td style={{ color: 'var(--text-3)', fontSize: '0.82rem' }}>{c.direccion}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(c)}><Pencil size={13} /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id_cliente)}><Trash2 size={13} /></button>
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
              <span className="modal-title">{editId ? 'Editar Cliente' : 'Nuevo Cliente'}</span>
              <button className="btn btn-ghost btn-sm" onClick={closeModal}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Nombre</label>
                    <input required value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Apellido</label>
                    <input required value={form.apellido} onChange={e => setForm({ ...form, apellido: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Teléfono</label>
                    <input value={form.telefono || ''} onChange={e => setForm({ ...form, telefono: e.target.value })} />
                  </div>
                  <div className="form-group full">
                    <label>Dirección</label>
                    <input value={form.direccion || ''} onChange={e => setForm({ ...form, direccion: e.target.value })} />
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
