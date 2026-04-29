-- ============================================================
--  Proyecto 2 - Bases de Datos 1, UVG 2026
--  schema.sql — DDL completo para PostgreSQL
--  Usuario: proy2 | Contraseña: secret
-- ============================================================

-- ============================================================
--  EXTENSIONES
-- ============================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;  -- para hash de contraseñas


-- ============================================================
--  TABLAS
-- ============================================================

-- 1. Categoría
CREATE TABLE categoria (
    id_categoria  SERIAL        PRIMARY KEY,
    nombre        VARCHAR(100)  NOT NULL,
    descripcion   TEXT
);

-- 2. Proveedor
CREATE TABLE proveedor (
    id_proveedor  SERIAL        PRIMARY KEY,
    nombre        VARCHAR(150)  NOT NULL,
    telefono      VARCHAR(20),
    email         VARCHAR(150),
    direccion     TEXT
);

-- 3. Producto
CREATE TABLE producto (
    id_producto    SERIAL          PRIMARY KEY,
    nombre         VARCHAR(150)    NOT NULL,
    descripcion    TEXT,
    precio_unitario NUMERIC(10,2)  NOT NULL CHECK (precio_unitario >= 0),
    stock           INT            NOT NULL DEFAULT 0 CHECK (stock >= 0),
    id_categoria    INT            NOT NULL REFERENCES categoria(id_categoria),
    id_proveedor    INT            NOT NULL REFERENCES proveedor(id_proveedor)
);

-- 4. Cliente
CREATE TABLE cliente (
    id_cliente  SERIAL        PRIMARY KEY,
    nombre      VARCHAR(100)  NOT NULL,
    apellido    VARCHAR(100)  NOT NULL,
    email       VARCHAR(150)  UNIQUE,
    telefono    VARCHAR(20),
    direccion   TEXT
);

-- 5. Empleado
CREATE TABLE empleado (
    id_empleado        SERIAL       PRIMARY KEY,
    nombre             VARCHAR(100) NOT NULL,
    apellido           VARCHAR(100) NOT NULL,
    email              VARCHAR(150) UNIQUE,
    puesto             VARCHAR(100) NOT NULL,
    fecha_contratacion DATE         NOT NULL DEFAULT CURRENT_DATE
);

-- 6. Venta
CREATE TABLE venta (
    id_venta    SERIAL          PRIMARY KEY,
    fecha       TIMESTAMP       NOT NULL DEFAULT NOW(),
    total       NUMERIC(12,2)   NOT NULL CHECK (total >= 0),
    id_cliente  INT             NOT NULL REFERENCES cliente(id_cliente),
    id_empleado INT             NOT NULL REFERENCES empleado(id_empleado)
);

-- 7. Detalle de venta  (tabla intermedia Venta <-> Producto)
CREATE TABLE detalle_venta (
    id_detalle      SERIAL         PRIMARY KEY,
    id_venta        INT            NOT NULL REFERENCES venta(id_venta) ON DELETE CASCADE,
    id_producto     INT            NOT NULL REFERENCES producto(id_producto),
    cantidad        INT            NOT NULL CHECK (cantidad > 0),
    precio_unitario NUMERIC(10,2)  NOT NULL CHECK (precio_unitario >= 0)
    -- precio_unitario guarda el precio AL MOMENTO de la venta (historial)
);

-- 8. Usuario  (autenticación — sección IV avanzado)
CREATE TABLE usuario (
    id_usuario    SERIAL       PRIMARY KEY,
    username      VARCHAR(80)  NOT NULL UNIQUE,
    password_hash TEXT         NOT NULL,
    rol           VARCHAR(20)  NOT NULL DEFAULT 'cajero'
                               CHECK (rol IN ('admin', 'cajero', 'supervisor')),
    id_empleado   INT          NOT NULL UNIQUE REFERENCES empleado(id_empleado)
);


-- ============================================================
--  ÍNDICES
-- ============================================================

-- Búsquedas frecuentes de productos por categoría
CREATE INDEX idx_producto_categoria
    ON producto(id_categoria);

-- Búsquedas frecuentes de productos por proveedor
CREATE INDEX idx_producto_proveedor
    ON producto(id_proveedor);

-- Filtros y reportes de ventas por fecha
CREATE INDEX idx_venta_fecha
    ON venta(fecha);

-- Búsquedas de ventas por cliente
CREATE INDEX idx_venta_cliente
    ON venta(id_cliente);

-- Búsquedas de detalle por venta (muy usada en JOINs)
CREATE INDEX idx_detalle_venta
    ON detalle_venta(id_venta);


-- ============================================================
--  VISTAS  (usadas por el backend para alimentar la UI)
-- ============================================================

-- Vista 1: Detalle completo de ventas con nombres legibles
CREATE VIEW v_ventas_detalle AS
SELECT
    v.id_venta,
    v.fecha,
    v.total                                  AS total_venta,
    c.nombre    || ' ' || c.apellido         AS cliente,
    e.nombre    || ' ' || e.apellido         AS empleado,
    p.nombre                                 AS producto,
    dv.cantidad,
    dv.precio_unitario,
    (dv.cantidad * dv.precio_unitario)       AS subtotal
FROM venta v
JOIN cliente        c  ON c.id_cliente  = v.id_cliente
JOIN empleado       e  ON e.id_empleado = v.id_empleado
JOIN detalle_venta  dv ON dv.id_venta   = v.id_venta
JOIN producto       p  ON p.id_producto = dv.id_producto;


-- Vista 2: Stock actual por categoría (reporte de inventario)
CREATE VIEW v_stock_por_categoria AS
SELECT
    cat.nombre                      AS categoria,
    COUNT(p.id_producto)            AS total_productos,
    SUM(p.stock)                    AS unidades_en_stock,
    SUM(p.stock * p.precio_unitario) AS valor_inventario
FROM categoria cat
LEFT JOIN producto p ON p.id_categoria = cat.id_categoria
GROUP BY cat.id_categoria, cat.nombre;


-- Vista 3: Resumen de ventas por empleado
CREATE VIEW v_ventas_por_empleado AS
SELECT
    e.id_empleado,
    e.nombre || ' ' || e.apellido   AS empleado,
    e.puesto,
    COUNT(v.id_venta)               AS total_ventas,
    COALESCE(SUM(v.total), 0)       AS monto_total
FROM empleado e
LEFT JOIN venta v ON v.id_empleado = e.id_empleado
GROUP BY e.id_empleado, e.nombre, e.apellido, e.puesto;