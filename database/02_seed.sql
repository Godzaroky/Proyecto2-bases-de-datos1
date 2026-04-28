-- ============================================================
--  Proyecto 2 - Bases de Datos 1, UVG 2026
--  seed.sql — Datos de prueba realistas (25+ registros por tabla)
-- ============================================================


-- ============================================================
--  CATEGORÍAS  (10 registros)
-- ============================================================
INSERT INTO categoria (nombre, descripcion) VALUES
('Electrónica',        'Dispositivos electrónicos y accesorios tecnológicos'),
('Ropa y Calzado',     'Prendas de vestir y zapatos para todas las edades'),
('Alimentos',          'Productos comestibles y bebidas no perecederas'),
('Hogar y Cocina',     'Utensilios, muebles y accesorios para el hogar'),
('Deportes',           'Equipos y ropa para actividades deportivas'),
('Juguetes',           'Juguetes y juegos para niños de todas las edades'),
('Belleza y Cuidado',  'Productos de higiene personal y cosméticos'),
('Librería',           'Libros, cuadernos, papelería y útiles escolares'),
('Herramientas',       'Herramientas manuales y eléctricas para construcción'),
('Mascotas',           'Alimentos y accesorios para mascotas');


-- ============================================================
--  PROVEEDORES  (10 registros)
-- ============================================================
INSERT INTO proveedor (nombre, telefono, email, direccion) VALUES
('Tecnoimport S.A.',        '2345-6789', 'ventas@tecnoimport.gt',    'Zona 9, Ciudad de Guatemala'),
('Textiles del Sur Ltda.',  '7890-1234', 'pedidos@textilsur.com',    'Escuintla, Guatemala'),
('Distribuidora La Cosecha','5678-2345', 'info@lacosecha.gt',        'Mixco, Guatemala'),
('Hogar Total S.A.',        '3456-7890', 'ventas@hogartotal.com',    'Zona 12, Ciudad de Guatemala'),
('SportMax Guatemala',      '4567-8901', 'orders@sportmax.gt',       'Zona 4, Ciudad de Guatemala'),
('JuguetesRex S.A.',        '6789-0123', 'info@juguetesrex.gt',      'Villa Nueva, Guatemala'),
('BeautyPro Distribuciones','8901-2345', 'ventas@beautypro.gt',      'Zona 10, Ciudad de Guatemala'),
('Editorial Centroamérica', '9012-3456', 'libros@editcam.gt',        'Zona 1, Ciudad de Guatemala'),
('Ferretería Nacional S.A.','1234-5678', 'pedidos@ferretnac.gt',     'Zona 6, Ciudad de Guatemala'),
('PetShop Distribuidora',   '2345-6780', 'stock@petshop.gt',         'San Miguel Petapa, Guatemala');


-- ============================================================
--  PRODUCTOS  (30 registros)
-- ============================================================
INSERT INTO producto (nombre, descripcion, precio_unitario, stock, id_categoria, id_proveedor) VALUES
-- Electrónica
('Audífonos Bluetooth XB500',  'Audífonos inalámbricos con cancelación de ruido', 349.99,  40, 1, 1),
('Cable USB-C 2m',             'Cable de carga rápida trenzado',                   45.00,  120, 1, 1),
('Teclado Mecánico RGB',       'Teclado gaming con switches azules',              599.00,   25, 1, 1),
('Mouse Inalámbrico M200',     'Mouse ergonómico 2.4GHz 1600 DPI',               189.00,   60, 1, 1),
('Cargador Multipuerto 65W',   'Cargador GaN con 4 puertos USB',                 249.00,   35, 1, 1),
-- Ropa y Calzado
('Camiseta Polo Slim Fit',     'Polo de algodón pima, tallas S-XL',               89.00,  200, 2, 2),
('Jeans Clásico Hombre',       'Pantalón de mezclilla azul oscuro',              199.00,   90, 2, 2),
('Vestido Casual Flores',      'Vestido de verano talla única',                  159.00,   75, 2, 2),
('Tenis Running ProStep',      'Tenis deportivos ligeros talla 36-44',           349.00,   50, 2, 2),
('Sandalias Playa Unisex',     'Sandalias anatómicas resistentes al agua',        79.00,  130, 2, 2),
-- Alimentos
('Arroz Blanco 5lb',           'Arroz de grano largo extra',                      32.00,  300, 3, 3),
('Aceite Vegetal 1L',          'Aceite 100% vegetal sin colesterol',              28.50,  250, 3, 3),
('Pasta Espagueti 500g',       'Pasta de trigo semola',                           18.00,  400, 3, 3),
('Café Molido Premium 250g',   'Café guatemalteco de altura',                     65.00,  180, 3, 3),
('Frijoles Negros 1lb',        'Frijoles negros secos de calidad',                15.00,  350, 3, 3),
-- Hogar y Cocina
('Sartén Antiadherente 28cm',  'Sartén de aluminio con recubrimiento cerámico',  199.00,   45, 4, 4),
('Juego Cubiertos 24 piezas',  'Cubiertos de acero inoxidable',                  149.00,   30, 4, 4),
('Licuadora 600W',             'Licuadora de 3 velocidades con vaso de vidrio',  349.00,   20, 4, 4),
('Toallas de Baño x2',         'Set de 2 toallas de algodón 500g/m²',            129.00,   80, 4, 4),
('Almohada Memory Foam',       'Almohada ergonómica viscoelástica',              189.00,   40, 4, 4),
-- Deportes
('Balón de Fútbol N°5',        'Balón oficial laminado',                         149.00,   55, 5, 5),
('Guantes de Portero Pro',     'Guantes con palma de látex',                     229.00,   20, 5, 5),
('Colchoneta Yoga 6mm',        'Colchoneta antideslizante con correa',            99.00,   40, 5, 5),
('Mancuernas 5kg par',         'Par de mancuernas de hierro fundido',            179.00,   30, 5, 5),
('Botella Térmica 750ml',      'Botella deportiva acero inox 24h fría',           89.00,   90, 5, 5),
-- Juguetes
('Lego Ciudad 250 piezas',     'Set de construcción para niños +6 años',         299.00,   25, 6, 6),
('Muñeca Articulada 30cm',     'Muñeca con accesorios incluidos',                 99.00,   60, 6, 6),
-- Belleza
('Shampoo Keratina 400ml',     'Shampoo reparador con proteínas de keratina',     65.00,  100, 7, 7),
-- Librería
('Cuaderno Universitario 100h','Cuaderno rayado pasta dura',                      22.00,  200, 8, 8),
-- Mascotas
('Alimento Perro Adulto 2kg',  'Croquetas balanceadas para perro adulto',        149.00,   70, 10, 10);


-- ============================================================
--  CLIENTES  (25 registros)
-- ============================================================
INSERT INTO cliente (nombre, apellido, email, telefono, direccion) VALUES
('Carlos',    'Pérez González',    'carlos.perez@gmail.com',      '5501-1234', 'Zona 5, Ciudad de Guatemala'),
('María',     'López Fuentes',     'maria.lopez@hotmail.com',     '5502-2345', 'Zona 11, Ciudad de Guatemala'),
('José',      'Martínez Cruz',     'jose.martinez@gmail.com',     '5503-3456', 'Mixco, Guatemala'),
('Ana',       'García Morales',    'ana.garcia@yahoo.com',        '5504-4567', 'Villa Nueva, Guatemala'),
('Luis',      'Hernández Díaz',    'luis.hernandez@gmail.com',    '5505-5678', 'Zona 7, Ciudad de Guatemala'),
('Sofía',     'Ramírez Torres',    'sofia.ramirez@gmail.com',     '5506-6789', 'San Miguel Petapa'),
('Diego',     'Sánchez Vega',      'diego.sanchez@hotmail.com',   '5507-7890', 'Zona 13, Ciudad de Guatemala'),
('Valeria',   'Torres Mendoza',    'valeria.torres@gmail.com',    '5508-8901', 'Zona 10, Ciudad de Guatemala'),
('Roberto',   'Flores Castillo',   'roberto.flores@gmail.com',    '5509-9012', 'Antigua Guatemala'),
('Patricia',  'Morales Lima',      'patricia.morales@gmail.com',  '5510-0123', 'Escuintla'),
('Fernando',  'Jiménez Ruiz',      'fernando.jimenez@gmail.com',  '5511-1235', 'Zona 6, Ciudad de Guatemala'),
('Claudia',   'Vásquez Ochoa',     'claudia.vasquez@yahoo.com',   '5512-2346', 'Zona 1, Ciudad de Guatemala'),
('Andrés',    'Rojas Estrada',     'andres.rojas@gmail.com',      '5513-3457', 'Chimaltenango'),
('Mónica',    'Castillo Ramos',    'monica.castillo@gmail.com',   '5514-4568', 'Zona 15, Ciudad de Guatemala'),
('Héctor',    'Mendoza Aguilar',   'hector.mendoza@hotmail.com',  '5515-5679', 'Zona 18, Ciudad de Guatemala'),
('Laura',     'Aguilar Pineda',    'laura.aguilar@gmail.com',     '5516-6780', 'Quetzaltenango'),
('Miguel',    'Pineda Solís',      'miguel.pineda@gmail.com',     '5517-7891', 'Zona 4, Ciudad de Guatemala'),
('Carmen',    'Solís Barrios',     'carmen.solis@yahoo.com',      '5518-8902', 'Zona 3, Ciudad de Guatemala'),
('Pablo',     'Barrios Lemus',     'pablo.barrios@gmail.com',     '5519-9013', 'San Lucas Sacatepéquez'),
('Daniela',   'Lemus Chávez',      'daniela.lemus@gmail.com',     '5520-0124', 'Zona 9, Ciudad de Guatemala'),
('Alejandro', 'Chávez Godínez',    'alejandro.chavez@gmail.com',  '5521-1236', 'Zona 12, Ciudad de Guatemala'),
('Isabel',    'Godínez López',     'isabel.godinez@hotmail.com',  '5522-2347', 'Amatitlán'),
('Ricardo',   'Luna Cifuentes',    'ricardo.luna@gmail.com',      '5523-3458', 'Zona 2, Ciudad de Guatemala'),
('Gabriela',  'Cifuentes Paz',     'gabriela.cifuentes@gmail.com','5524-4569', 'Zona 16, Ciudad de Guatemala'),
('Sebastián', 'Paz Monterroso',    'sebastian.paz@gmail.com',     '5525-5670', 'Villa Canales');


-- ============================================================
--  EMPLEADOS  (10 registros)
-- ============================================================
INSERT INTO empleado (nombre, apellido, email, puesto, fecha_contratacion) VALUES
('Jorge',    'Alvarado Méndez',  'jorge.alvarado@tienda.gt',   'Gerente',          '2020-01-15'),
('Sandra',   'Bautista Ríos',    'sandra.bautista@tienda.gt',  'Cajera',           '2021-03-10'),
('Mario',    'Cifuentes Ramos',  'mario.cifuentes@tienda.gt',  'Cajero',           '2021-06-22'),
('Elena',    'Domínguez Paz',    'elena.dominguez@tienda.gt',  'Vendedora',        '2022-01-05'),
('Oscar',    'Estrada Leiva',    'oscar.estrada@tienda.gt',    'Vendedor',         '2022-04-18'),
('Rosa',     'Fuentes Cabrera',  'rosa.fuentes@tienda.gt',     'Encargada Bodega', '2020-07-30'),
('Kevin',    'Girón Tojín',      'kevin.giron@tienda.gt',      'Auxiliar Bodega',  '2023-02-14'),
('Wendy',    'Herrera Solano',   'wendy.herrera@tienda.gt',    'Cajera',           '2023-05-08'),
('Bryan',    'Ibáñez Morán',     'bryan.ibanez@tienda.gt',     'Vendedor',         '2023-09-01'),
('Luisa',    'Juárez Xitumul',   'luisa.juarez@tienda.gt',     'Supervisora',      '2021-11-20');


-- ============================================================
--  USUARIOS  (autenticación — contraseñas hasheadas con pgcrypto)
-- ============================================================
INSERT INTO usuario (username, password_hash, rol, id_empleado) VALUES
('admin',         crypt('admin123',   gen_salt('bf')), 'admin',      1),
('sandra.b',      crypt('cajero123',  gen_salt('bf')), 'cajero',     2),
('mario.c',       crypt('cajero123',  gen_salt('bf')), 'cajero',     3),
('elena.d',       crypt('cajero123',  gen_salt('bf')), 'cajero',     4),
('oscar.e',       crypt('cajero123',  gen_salt('bf')), 'cajero',     5),
('rosa.f',        crypt('super123',   gen_salt('bf')), 'supervisor', 6),
('kevin.g',       crypt('cajero123',  gen_salt('bf')), 'cajero',     7),
('wendy.h',       crypt('cajero123',  gen_salt('bf')), 'cajero',     8),
('bryan.i',       crypt('cajero123',  gen_salt('bf')), 'cajero',     9),
('luisa.j',       crypt('super123',   gen_salt('bf')), 'supervisor', 10);


-- ============================================================
--  VENTAS  (30 registros)
-- ============================================================
INSERT INTO venta (fecha, total, id_cliente, id_empleado) VALUES
('2026-01-05 09:15:00',  438.99,  1,  2),
('2026-01-07 10:30:00',  267.00,  2,  3),
('2026-01-10 11:45:00',  398.00,  3,  2),
('2026-01-12 14:00:00',  189.00,  4,  4),
('2026-01-15 15:20:00',  565.00,  5,  3),
('2026-01-18 09:00:00',   96.50,  6,  8),
('2026-01-20 10:10:00',  698.00,  7,  2),
('2026-01-22 12:30:00',  179.00,  8,  4),
('2026-01-25 16:00:00',  428.00,  9,  3),
('2026-01-28 11:00:00',  258.00, 10,  8),
('2026-02-02 09:30:00',  788.00,  1,  2),
('2026-02-05 10:00:00',  349.00,  2,  3),
('2026-02-07 14:15:00',  508.00,  3,  4),
('2026-02-10 15:30:00',  238.00,  4,  2),
('2026-02-12 09:45:00',  629.00,  5,  8),
('2026-02-15 11:20:00',  189.00, 11,  3),
('2026-02-18 13:00:00',  478.50, 12,  2),
('2026-02-20 10:30:00',  367.00, 13,  4),
('2026-02-22 16:45:00',  259.00, 14,  3),
('2026-02-25 09:15:00',  448.00, 15,  8),
('2026-03-01 10:00:00',  699.00, 16,  2),
('2026-03-05 11:30:00',  288.00, 17,  3),
('2026-03-08 14:00:00',  519.00, 18,  4),
('2026-03-10 15:15:00',  178.00, 19,  2),
('2026-03-12 09:30:00',  398.50, 20,  8),
('2026-03-15 10:45:00',  569.00, 21,  3),
('2026-03-18 12:00:00',  239.00, 22,  2),
('2026-03-20 13:30:00',  429.00, 23,  4),
('2026-03-22 16:00:00',  358.00, 24,  3),
('2026-03-25 09:00:00',  488.00, 25,  8);


-- ============================================================
--  DETALLE DE VENTAS  (30+ registros)
-- ============================================================
INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario) VALUES
-- Venta 1
(1,  1, 1, 349.99),   -- Audífonos Bluetooth
(1,  2, 2,  45.00),   -- Cable USB-C x2
-- Venta 2
(2,  6, 2,  89.00),   -- Camiseta Polo x2
(2,  7, 1, 199.00),   -- Jeans
-- Venta 3
(3,  9, 1, 349.00),   -- Tenis Running
(3, 10, 1,  79.00),   -- Sandalias Playa
-- Venta 4
(4,  4, 1, 189.00),   -- Mouse Inalámbrico
-- Venta 5
(5,  3, 1, 599.00),   -- Teclado Mecánico
-- Venta 6
(6, 11, 2,  32.00),   -- Arroz x2
(6, 13, 2,  18.00),   -- Pasta x2
-- Venta 7
(7,  3, 1, 599.00),   -- Teclado
(7,  4, 1, 189.00),   -- Mouse
-- Venta 8
(8, 24, 1, 179.00),   -- Mancuernas
-- Venta 9
(9,  1, 1, 349.99),   -- Audífonos
(9,  5, 1, 249.00),   -- Cargador Multipuerto
-- Venta 10
(10, 16, 1, 199.00),  -- Sartén
(10, 17, 1, 149.00),  -- Cubiertos
-- Venta 11
(11,  1, 1, 349.99),  -- Audífonos
(11,  3, 1, 599.00),  -- Teclado
-- Venta 12
(12,  9, 1, 349.00),  -- Tenis
-- Venta 13
(13, 18, 1, 349.00),  -- Licuadora
(13, 20, 1, 189.00),  -- Almohada
-- Venta 14
(14,  6, 2,  89.00),  -- Camisetas x2
(14, 10, 1,  79.00),  -- Sandalias
-- Venta 15
(15,  3, 1, 599.00),  -- Teclado
(15,  4, 1, 189.00),  -- Mouse
-- Venta 16
(16,  4, 1, 189.00),  -- Mouse
-- Venta 17
(17,  1, 1, 349.99),  -- Audífonos
(17,  2, 3,  45.00),  -- Cables x3
-- Venta 18
(18,  8, 1, 159.00),  -- Vestido
(18,  7, 1, 199.00),  -- Jeans
-- Venta 19
(19, 14, 2,  65.00),  -- Café x2
(19, 11, 2,  32.00),  -- Arroz x2
-- Venta 20
(20, 21, 1, 149.00),  -- Balón fútbol
(20, 23, 1,  99.00),  -- Colchoneta yoga
(20, 25, 2,  89.00),  -- Botella x2
-- Venta 21
(21, 18, 2, 349.00),  -- Licuadoras x2
-- Venta 22
(22, 26, 1, 299.00),  -- Lego
-- Venta 23
(23,  6, 3,  89.00),  -- Camisetas x3
(23,  9, 1, 349.00),  -- Tenis
-- Venta 24
(24, 11, 3,  32.00),  -- Arroz x3
(24, 12, 2,  28.50),  -- Aceite x2
-- Venta 25
(25, 21, 1, 149.00),  -- Balón
(25, 22, 1, 229.00),  -- Guantes portero
-- Venta 26
(26,  3, 1, 599.00),  -- Teclado
-- Venta 27
(27, 19, 1, 129.00),  -- Toallas
(27, 20, 1, 189.00),  -- Almohada
-- Venta 28
(28,  1, 1, 349.99),  -- Audífonos
(28,  5, 1, 249.00),  -- Cargador
-- Venta 29
(29, 28, 2,  65.00),  -- Shampoo x2
(29, 27, 1,  99.00),  -- Muñeca
-- Venta 30
(30, 30, 2, 149.00),  -- Alimento perro x2
(30, 29, 2,  22.00);  -- Cuadernos x2
