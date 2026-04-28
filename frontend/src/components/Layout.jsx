// src/components/Layout.jsx
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Package, Users, ShoppingCart,
  BarChart2, Tag, Truck, LogOut
} from 'lucide-react';

const navItems = [
  { section: 'General' },
  { to: '/',           icon: LayoutDashboard, label: 'Dashboard' },
  { section: 'Gestión' },
  { to: '/productos',  icon: Package,         label: 'Productos' },
  { to: '/clientes',   icon: Users,           label: 'Clientes' },
  { to: '/ventas',     icon: ShoppingCart,    label: 'Ventas' },
  { to: '/categorias', icon: Tag,             label: 'Categorías' },
  { to: '/proveedores',icon: Truck,           label: 'Proveedores' },
  { section: 'Análisis' },
  { to: '/reportes',   icon: BarChart2,       label: 'Reportes' },
];

export default function Layout() {
  const { usuario, logout } = useAuth();
  const navigate            = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = usuario?.nombre_completo
    ?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1>TiendaDB</h1>
          <span>Inventario & Ventas</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item, i) =>
            item.section ? (
              <div key={i} className="nav-section">{item.section}</div>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              >
                <item.icon size={16} />
                {item.label}
              </NavLink>
            )
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-chip">
            <div className="user-avatar">{initials}</div>
            <div className="user-info">
              <div className="user-name">{usuario?.nombre_completo}</div>
              <div className="user-role">{usuario?.rol}</div>
            </div>
            <button className="btn-logout" onClick={handleLogout} title="Cerrar sesión">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
