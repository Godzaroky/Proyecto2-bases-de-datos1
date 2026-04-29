// src/App.jsx — Router principal
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import Layout      from './components/Layout';
import Login       from './pages/Login';
import Dashboard   from './pages/Dashboard';
import Productos   from './pages/Productos';
import Clientes    from './pages/Clientes';
import Ventas      from './pages/Ventas';
import Categorias  from './pages/Categorias';
import Proveedores from './pages/Proveedores';
import Reportes    from './pages/Reportes';

// Ruta protegida — redirige al login si no hay sesión
function PrivateRoute({ children }) {
  const { usuario, loading } = useAuth();
  if (loading) return <div className="loading"><div className="spinner" />Verificando sesión...</div>;
  return usuario ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index          element={<Dashboard />} />
        <Route path="productos"   element={<Productos />} />
        <Route path="clientes"    element={<Clientes />} />
        <Route path="ventas"      element={<Ventas />} />
        <Route path="categorias"  element={<Categorias />} />
        <Route path="proveedores" element={<Proveedores />} />
        <Route path="reportes"    element={<Reportes />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--bg-2)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
            },
            success: { iconTheme: { primary: 'var(--success)', secondary: 'var(--bg)' } },
            error:   { iconTheme: { primary: 'var(--danger)',  secondary: 'var(--bg)' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
