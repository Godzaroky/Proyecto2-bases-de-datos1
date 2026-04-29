# TiendaDB — Proyecto 2

**cc3088 - Bases de Datos 1 | Universidad del Valle de Guatemala | Ciclo 1, 2026**

Aplicación web para gestionar el inventario y las ventas de una tienda. Incluye frontend en React, backend en Node.js/Express y base de datos PostgreSQL, todo orquestado con Docker.

---

## Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | React + Vite + React Router |
| Backend | Node.js + Express |
| Base de datos | PostgreSQL 16 |
| Contenedores | Docker + Docker Compose |
| Autenticación | express-session + bcrypt |

---

## Requisitos previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y corriendo
- Git

---

## Levantar el proyecto

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd proyecto2
```

### 2. Crear el archivo `.env`

```bash
cp .env.example .env
```

El `.env` ya viene listo con las credenciales de calificación:

```env
DB_USER=proy2
DB_PASSWORD=secret
DB_NAME=tienda_db
SESSION_SECRET=clave_super_secreta_proyecto2_uvg
```

> ⚠️ No cambiar `DB_USER` ni `DB_PASSWORD` — son requeridas para calificación.

### 3. Levantar con Docker

```bash
docker compose up --build
```

Esperar a que aparezca en la consola:

```
backend-1   | ✅ Conectado a PostgreSQL
backend-1   | 🚀 Backend corriendo en http://localhost:3000
```

### 4. Abrir la aplicación

| Servicio | URL |
|---|---|
| Aplicación web | http://localhost |
| API backend | http://localhost:3000/api/health |

---

## Credenciales de acceso

| Usuario | Contraseña | Rol |
|---|---|---|
| `admin` | `admin123` | Admin |
| `sandra.b` | `cajero123` | Cajero |
| `luisa.j` | `super123` | Supervisor |

---

## Estructura del proyecto

```
proyecto2/
├── docker-compose.yml          # Orquestación de servicios
├── .env                        # Variables de entorno (no subir a git)
├── .env.example                # Plantilla de variables
├── database/
│   ├── 01_schema.sql           # DDL: tablas, índices, vistas
│   └── 02_seed.sql             # Datos de prueba (25+ registros por tabla)
├── backend/
│   ├── Dockerfile
│   └── src/
│       ├── index.js            # Punto de entrada Express
│       ├── db.js               # Pool de conexiones PostgreSQL
│       ├── middleware/
│       │   └── auth.js         # Middleware de autenticación
│       └── routes/
│           ├── auth.js         # Login / Logout
│           ├── productos.js    # CRUD productos
│           ├── clientes.js     # CRUD clientes
│           ├── ventas.js       # Ventas con transacción explícita
│           ├── categorias.js   # CRUD categorías
│           ├── proveedores.js  # CRUD proveedores
│           └── reportes.js     # Consultas avanzadas + export CSV
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    └── src/
        ├── App.jsx             # Router principal
        ├── api.js              # Cliente axios
        ├── context/
        │   └── AuthContext.jsx # Manejo de sesión global
        ├── components/
        │   └── Layout.jsx      # Sidebar + navegación
        └── pages/
            ├── Login.jsx
            ├── Dashboard.jsx
            ├── Productos.jsx
            ├── Clientes.jsx
            ├── Ventas.jsx
            ├── Categorias.jsx
            ├── Proveedores.jsx
            └── Reportes.jsx
```

---

## Funcionalidades

### CRUD completo
- **Productos** — crear, listar, editar, eliminar con búsqueda por nombre/categoría
- **Clientes** — crear, listar, editar, eliminar
- **Categorías** — crear, listar, editar, eliminar
- **Proveedores** — crear, listar, editar, eliminar

### Ventas
- Registrar una venta con múltiples productos
- Descuento automático de stock con **transacción explícita** (BEGIN / COMMIT / ROLLBACK)
- ROLLBACK automático si hay stock insuficiente
- Ver detalle de cada venta

### Reportes (SQL avanzado visible en la UI)
| Reporte | Técnica SQL |
|---|---|
| Ventas por cliente | `GROUP BY` + `HAVING` + funciones de agregación |
| Productos más vendidos | `JOIN` entre 4 tablas |
| Ventas mensuales | CTE con `WITH` |
| Stock bajo | Subquery con `IN` |
| Clientes sin compras | Subquery correlacionado con `NOT EXISTS` |
| Stock por categoría | `VIEW v_stock_por_categoria` |
| Desempeño empleados | `VIEW v_ventas_por_empleado` |

### Exportar CSV
Desde la página de Reportes, los reportes **Productos más vendidos** y **Ventas mensuales** se pueden exportar a CSV con un clic.

### Autenticación
- Login / logout con sesión persistente
- Rutas protegidas — redirige al login si no hay sesión activa

---

## API endpoints principales

```
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

GET    /api/productos
POST   /api/productos
PUT    /api/productos/:id
DELETE /api/productos/:id

GET    /api/clientes
POST   /api/clientes
PUT    /api/clientes/:id
DELETE /api/clientes/:id

GET    /api/ventas
GET    /api/ventas/:id
POST   /api/ventas              ← transacción explícita

GET    /api/reportes/ventas-por-cliente
GET    /api/reportes/productos-mas-vendidos
GET    /api/reportes/ventas-mensuales
GET    /api/reportes/stock-bajo
GET    /api/reportes/clientes-sin-compras
GET    /api/reportes/stock-por-categoria
GET    /api/reportes/empleados
GET    /api/reportes/productos-mas-vendidos/csv
GET    /api/reportes/ventas-mensuales/csv
```

---

## Reiniciar la base de datos

Si necesitas resetear los datos de cero:

```bash
docker compose down -v
docker compose up --build
```

El flag `-v` elimina el volumen de PostgreSQL, forzando que los scripts de inicialización corran de nuevo.

---

## Desarrollo local (sin Docker)

**Backend:**
```bash
cd backend
npm install
# Crear backend/.env con las variables de conexión apuntando a localhost
node src/index.js
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# Abrir http://localhost:5173
```

> El frontend en modo dev hace proxy automático de `/api` hacia `http://localhost:3000` via la configuración de Vite.
