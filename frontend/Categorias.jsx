// src/pages/Categorias.jsx
import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';

const empty = { nombre: '', descripcion: '' };

export default function Categorias() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [form,    setForm]    = useState(empty);
  const [editId,  setEditId]  = useState(null);
  const [saving,  setSaving]  = useState(false);

  const fetch_ = () => api.get('/categorias').then(r => { setItems(r.data); setLoading(false); });
  useEffect(() => { fetch_(); }, []);

  const openCreate = () => { setForm(empty); setEditId(null); setModal(true); };
  const openEdit   = c  => { setForm(c); setEditId(c.id_categoria); setModal(true); };
  const close      = () => { setModal(false); setForm(empty); setEditId(null); };

  const submit = async e => {
    e.preventDefault(); setSaving(true);
    try {
      editId ? await api.put(`/categorias/${editId}`, form) : await api.post('/categorias', form);
      toast.success(editId ? 'Categoría actualizada.' : 'Categoría creada.');
      close(); fetch_();
    } catch (err) { toast.error(err.response?.data?.error || 'Error.'); }
    finally { setSaving(false); }
  };

  const del = async id => {
    if (!confirm('¿Eliminar esta categoría?')) return;
    try { await api.delete(`/categorias/${id}`); toast.success('Eliminada.'); fetch_(); }
    catch (err) { toast.error(err.response?.data?.error || 'No se pudo eliminar.'); }
  };

  if (loading) return <div className="loading"><div className="spinner" />Cargando...</div>;

  return (
    <>
      <div className="page-header">
        <div><div className="page-title">Categorías</div><div className="page-sub">{items.length} registradas</div></div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> Nueva</button>
      </div>
      <div className="card">
        <table>
          <thead><tr><th>#</th><th>Nombre</th><th>Descripción</th><th>Acciones</th></tr></thead>
          <tbody>
            {items.map(c => (
              <tr key={c.id_categoria}>
                <td><span className="chip">{c.id_categoria}</span></td>
                <td style={{ fontWeight: 500 }}>{c.nombre}</td>
                <td style={{ color: 'var(--text-3)', fontSize: '0.85rem' }}>{c.descripcion}</td>
                <td><div style={{ display:'flex', gap:6 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => openEdit(c)}><Pencil size={13}/></button>
                  <button className="btn btn-danger btn-sm" onClick={() => del(c.id_categoria)}><Trash2 size={13}/></button>
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
              <span className="modal-title">{editId ? 'Editar Categoría' : 'Nueva Categoría'}</span>
              <button className="btn btn-ghost btn-sm" onClick={close}><X size={16}/></button>
            </div>
            <form onSubmit={submit}>
              <div className="modal-body" style={{ display:'flex', flexDirection:'column', gap:16 }}>
                <div className="form-group"><label>Nombre</label><input required value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} /></div>
                <div className="form-group"><label>Descripción</label><textarea value={form.descripcion||''} onChange={e => setForm({...form, descripcion: e.target.value})} /></div>
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
