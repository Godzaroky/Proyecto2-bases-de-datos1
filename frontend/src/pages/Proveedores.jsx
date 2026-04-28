// src/pages/Proveedores.jsx
import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';

const empty = { nombre: '', telefono: '', email: '', direccion: '' };

export default function Proveedores() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [form,    setForm]    = useState(empty);
  const [editId,  setEditId]  = useState(null);
  const [saving,  setSaving]  = useState(false);

  const fetch_ = () => api.get('/proveedores').then(r => { setItems(r.data); setLoading(false); });
  useEffect(() => { fetch_(); }, []);

  const openCreate = () => { setForm(empty); setEditId(null); setModal(true); };
  const openEdit   = p  => { setForm(p); setEditId(p.id_proveedor); setModal(true); };
  const close      = () => { setModal(false); setForm(empty); setEditId(null); };

  const submit = async e => {
    e.preventDefault(); setSaving(true);
    try {
      editId ? await api.put(`/proveedores/${editId}`, form) : await api.post('/proveedores', form);
      toast.success(editId ? 'Proveedor actualizado.' : 'Proveedor creado.');
      close(); fetch_();
    } catch (err) { toast.error(err.response?.data?.error || 'Error.'); }
    finally { setSaving(false); }
  };

  const del = async id => {
    if (!confirm('¿Eliminar este proveedor?')) return;
    try { await api.delete(`/proveedores/${id}`); toast.success('Eliminado.'); fetch_(); }
    catch (err) { toast.error(err.response?.data?.error || 'No se pudo eliminar.'); }
  };

  if (loading) return <div className="loading"><div className="spinner" />Cargando...</div>;

  return (
    <>
      <div className="page-header">
        <div><div className="page-title">Proveedores</div><div className="page-sub">{items.length} registrados</div></div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> Nuevo</button>
      </div>
      <div className="card">
        <table>
          <thead><tr><th>Nombre</th><th>Teléfono</th><th>Email</th><th>Dirección</th><th>Acciones</th></tr></thead>
          <tbody>
            {items.map(p => (
              <tr key={p.id_proveedor}>
                <td style={{ fontWeight: 500 }}>{p.nombre}</td>
                <td style={{ color: 'var(--text-2)' }}>{p.telefono}</td>
                <td style={{ color: 'var(--text-2)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>{p.email}</td>
                <td style={{ color: 'var(--text-3)', fontSize: '0.85rem' }}>{p.direccion}</td>
                <td><div style={{ display:'flex', gap:6 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}><Pencil size={13}/></button>
                  <button className="btn btn-danger btn-sm" onClick={() => del(p.id_proveedor)}><Trash2 size={13}/></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && close()}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">{editId ? 'Editar Proveedor' : 'Nuevo Proveedor'}</span>
              <button className="btn btn-ghost btn-sm" onClick={close}><X size={16}/></button>
            </div>
            <form onSubmit={submit}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group full"><label>Nombre</label><input required value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} /></div>
                  <div className="form-group"><label>Teléfono</label><input value={form.telefono||''} onChange={e => setForm({...form, telefono: e.target.value})} /></div>
                  <div className="form-group"><label>Email</label><input type="email" value={form.email||''} onChange={e => setForm({...form, email: e.target.value})} /></div>
                  <div className="form-group full"><label>Dirección</label><input value={form.direccion||''} onChange={e => setForm({...form, direccion: e.target.value})} /></div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={close}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
