CREATE TABLE IF NOT EXISTS clientes_proveedores (
  id_clipro INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  dni_cuit TEXT,
  telefono TEXT,
  email TEXT,
  localidad TEXT,
  tipo TEXT,
  estado TEXT DEFAULT 'E'
);

INSERT INTO clientes_proveedores (id_clipro, nombre, dni_cuit, telefono, email, localidad, tipo, estado) VALUES
	(1, 'Juan Carlos Bianchi', '30456789', '3401-455123', 'jcbianchi@gmail.com', 'Totoras', 'C', 'E'),
	(2, 'María Eugenia Ferreyra', '28901234', '3464-412567', 'me.ferreyra@hotmail.com', 'Casilda', 'C', 'E'),
	(3, 'Distribuidora San Martín S.A.', '30-71234567-9', '341-4556789', 'ventas@dsanmartin.com.ar', 'Rosario', 'P', 'E'),
	(4, 'Agropecuaria Los Aromos', '30-70345678-1', '3471-423456', 'contacto@losaromos.com.ar', 'Cañada de Gómez', 'P', 'E'),
	(5, 'Roberto Daniel Ponce', '25678901', '3401-467890', 'rdponce@gmail.com', 'Totoras', 'C', 'E'),
	(6, 'Cereales del Sur S.R.L.', '30-69876543-2', '3464-434567', 'admin@cerealesdelsur.com.ar', 'Casilda', 'P', 'E'),
	(7, 'Silvia Beatriz Coronel', '27345678', '3465-445678', 'sbcoronel@gmail.com', 'San Genaro', 'C', 'E'),
	(8, 'Transportes Rivadavia', '30-68123456-4', '341-4667890', 'logistica@trivadavia.com.ar', 'Rosario', 'P', 'E'),
	(9, 'Marcelo Fabián Gómez', '24123456', '3401-478901', 'mfgomez@gmail.com', 'Totoras', 'C', 'N'),
	(10, 'Insumos Agrícolas Funes', '30-67234567-8', '341-4778901', 'ventas@insumosfunes.com.ar', 'Funes', 'P', 'E'),
	(11, 'Norma Alicia Ibarra', '26789012', '3402-489012', 'naibarra@gmail.com', 'Luis Palacios', 'C', 'E'),
	(12, 'Molinos San Jorge S.A.', '30-66345678-5', '341-4889012', 'contacto@molinossanjorge.com.ar', 'Rosario', 'P', 'E'),
	(13, 'Pablo Ezequiel Suárez', '31890123', '3401-490123', 'pesuarez@gmail.com', 'Totoras', 'C', 'E'),
	(14, 'Ferretería Central', '30-65456789-6', '3401-501234', 'ferreteriacentral@hotmail.com', 'Totoras', 'P', 'N'),
	(15, 'Claudia Fernanda Ortiz', '29234567', '3464-512345', 'cfortiz@gmail.com', 'Casilda', 'C', 'E'),
	(16, 'Metalúrgica Rojas Hnos', '30-64567890-7', '341-4923456', 'ventas@metalurgicarojas.com.ar', 'Rosario', 'P', 'E'),
	(17, 'Gustavo Adrián Peralta', '23678901', '3465-534567', 'gaperalta@gmail.com', 'San Genaro', 'C', 'E'),
	(18, 'Combustibles del Litoral', '30-63678901-9', '341-4945678', 'admin@combustibleslitoral.com.ar', 'Rosario', 'P', 'E'),
	(19, 'Laura Vanina Acosta', '32345678', '3401-556789', 'lvacosta@gmail.com', 'Totoras', 'C', 'N'),
	(20, 'Repuestos Agro Sur', '30-62789012-3', '3471-567890', 'contacto@repuestosagrosur.com.ar', 'Cañada de Gómez', 'P', 'E'),
	(21, 'Diego Sebastián Molina', '27890123', '3402-578901', 'dsmolina@gmail.com', 'Salto Grande', 'C', 'E'),
	(22, 'Corralón Totoras', '30-61890123-4', '3401-589012', 'info@corralontotoras.com.ar', 'Totoras', 'P', 'N'),
	(23, 'Andrea Paola Vega', '28456789', '3464-590123', 'apvega@gmail.com', 'Casilda', 'C', 'E'),
	(24, 'Semillas del Norte S.A.', '30-60901234-5', '341-4601234', 'ventas@semillasdelnorte.com.ar', 'Rosario', 'P', 'E'),
	(25, 'Hernán Javier Domínguez', '25012345', '3401-612345', 'hjdominguez@gmail.com', 'Totoras', 'C', 'E'),
	(26, 'Distribuidora Rafaela', '30-59012345-6', '3492-623456', 'ventas@distrafaela.com.ar', 'Rafaela', 'P', 'E'),
	(27, 'Mónica Beatriz Ríos', '26123456', '3401-634567', 'mbrios@gmail.com', 'Totoras', 'C', 'N'),
	(28, 'Aceros del Centro', '30-58123456-7', '341-4645678', 'contacto@acerosdelcentro.com.ar', 'Rosario', 'P', 'E'),
	(29, 'Fernando Gabriel Luna', '24890123', '3465-656789', 'fgluna@gmail.com', 'San Genaro', 'C', 'E'),
	(30, 'Agroquímicos Casilda', '30-57234567-8', '3464-667890', 'ventas@agroquimicoscasilda.com.ar', 'Casilda', 'P', 'E');

-- Volcando estructura para tabla cuentas
CREATE TABLE IF NOT EXISTS cuentas (
  id_cuenta INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL
);

INSERT INTO cuentas (id_cuenta, nombre) VALUES
	(1, 'Caja Casa Central'),
	(2, 'Caja Totoras'),
	(3, 'Caja San Genaro'),
	(4, 'Caja Luis Palacios'),
	(5, 'Caja Salto Grande'),
	(6, 'Cuenta Corriente Banco Nación'),
	(7, 'Cuenta Corriente Banco Provincia'),
	(8, 'Caja de Ahorro Banco Galicia'),
	(9, 'Cuenta Corriente Banco Macro'),
	(10, 'Caja Lucio V. Lopez');

-- Volcando estructura para tabla bancos
CREATE TABLE IF NOT EXISTS bancos (
  id_banco INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL
);

INSERT INTO bancos (id_banco, nombre) VALUES
	(1, 'Banco de la Nación Argentina'),
	(2, 'Banco Provincia de Santa Fe'),
	(3, 'Banco Galicia'),
	(4, 'Banco Macro'),
	(5, 'Banco Santander'),
	(6, 'Banco BBVA'),
	(7, 'Banco Credicoop'),
	(8, 'Banco Industrial'),
	(9, 'Banco HSBC'),
	(10, 'Banco Patagonia');

-- Volcando estructura para tabla sucursales
CREATE TABLE IF NOT EXISTS sucursales (
  id_sucursal INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL
);

INSERT INTO sucursales (id_sucursal, nombre) VALUES
	(1, 'Casa Central'),
	(2, 'Luis Palacios'),
	(3, 'Totoras'),
	(4, 'San Genaro'),
	(5, 'Salto Grande'),
	(9, 'Lucio V. Lopez');

-- Volcando estructura para tabla usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
  user TEXT UNIQUE,
  pass TEXT,
  dni INTEGER,
  nombre TEXT,
  email TEXT,
  telefono TEXT,
  rango TEXT,
  id_sucursal INTEGER,
  photo TEXT,
  estado TEXT DEFAULT 'E',
  FOREIGN KEY (id_sucursal) REFERENCES sucursales (id_sucursal)
);

INSERT INTO usuarios (id_usuario, user, pass, dni, nombre, email, telefono, rango, id_sucursal, photo, estado) VALUES

    (1, 'axel_rullo', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 46996007, 'Axel Rullo', 'axelrullo17@gmail.com', '3417236528', 'Admin', 2, '/Profiles/axel.jpg', 'E'),

    (2, 'mario_saluzzo', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 23425252, 'Mario Saluzzo', 'mario@mail.com', '3415789473', 'Admin', 3, NULL, 'E'),

    (3, 'matias_rivadeneira', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 54839604, 'Matías Rivadeneira', 'matias@gmail.com', '38259374823', 'Miembro', 5, NULL, 'E'),

    (4, 'facundo_sangiacomo', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 45123891, 'Facundo Sangiacomo', 'facundo@gmail.com', '3415123456', 'Miembro', 4, NULL, 'E'),

    (5, 'lucas_albarracin', '$argon2id$v=19$m=20000,t=2,p=1$V7UBBmVUGb/n37EOLDxSTg$NXQNgsSTbMxr1hajs66GKr8fJhlr3VhNNYyFdKI2Hgk', 46234782, 'Lucas Albarracin', 'lucas@gmail.com', '348295824', 'Miembro', 3, '/Profiles/Loli.jpg', 'E'),

    (6, 'juan_bernal', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 47345673, 'Juan Cruz Bernal', 'juan@gmail.com', '3417345678', 'Miembro', 3, '/Profiles/Screenshot_20260813-185751-206.png', 'E'),

    (7, 'martin_menna', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 48456764, 'Martín Menna Castells', 'martin@gmail.com', '3418456789', 'Miembro', 3, NULL, 'E'),

    (8, 'fran_pilot', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 49567855, 'Francisco Pilot', 'fran@gmail.com', '3419567890', 'Miembro', 3, NULL, 'E'),

    (9, 'bruno_duarte', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 50678946, 'Bruno Duarte', 'bruno@gmail.com', '3421678901', 'Miembro', 4, NULL, 'N'),

    (10, 'lean_mignacco', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 51789037, 'Leandro Mignacco', 'lean@gmail.com', '3422789012', 'Miembro', 3, NULL, 'N');


-- Volcando estructura para tabla conceptos
CREATE TABLE IF NOT EXISTS conceptos (
  id_concepto INTEGER PRIMARY KEY AUTOINCREMENT,
  cod_concepto TEXT NOT NULL,
  concepto TEXT NOT NULL,
  clasificacion INTEGER
);

INSERT INTO conceptos (id_concepto, cod_concepto, concepto, clasificacion) VALUES
(1, '1.1', 'Cobranzas', 1),
(2, '1.2', 'Pagos a Proveedores', 1),
(3, '1.3', 'Sueldos y Cargas Sociales', 1),
(4, '1.4', 'Gastos Generales', 1),
(5, '2.1', 'Préstamos Recibidos', 2),
(6, '2.2', 'Pago de Préstamos', 2),
(7, '3.1', 'Venta de Bienes de Uso', 3),
(8, '3.2', 'Compra de Bienes de Uso', 3);

CREATE TABLE IF NOT EXISTS cheques (
  id_cheque INTEGER PRIMARY KEY AUTOINCREMENT,
  clase TEXT NOT NULL,              -- 'Propio' | 'Tercero'
  clasificacion TEXT NOT NULL,      -- 'Emitido' | 'A Cobrar'
  numero TEXT NOT NULL,
  importe DECIMAL(15,2) NOT NULL,
  tipo TEXT NOT NULL,               -- 'Comun' | 'Diferido'
  fecha_entrega DATE,
  fecha_cobro DATE,
  fecha_destino DATE,
  estado TEXT,
  observacion TEXT,
  uso TEXT,                         -- 'Deposito' | 'Endoso', solo aplica a terceros
  id_titular INTEGER,               -- alta: emisor (terceros) o destino (propios)
  id_titular_destino INTEGER,       -- imputación: a quién se endosa/deposita (terceros)
  id_cuenta_banco INTEGER,          -- alta propios: cuenta bancaria propia
  id_banco INTEGER,                 -- alta terceros: banco ajeno
  id_concepto_entrada INTEGER,      -- alta terceros: Cuenta Entrada
  id_concepto_salida INTEGER,       -- alta propios: Cuenta Salida
  id_cuenta_entrada INTEGER,        -- imputación (real)
  id_cuenta_salida INTEGER,         -- imputación (real)
  id_usuario INTEGER,               -- usuario que carga el cheque
  FOREIGN KEY (id_titular) REFERENCES clientes_proveedores (id_clipro),
  FOREIGN KEY (id_titular_destino) REFERENCES clientes_proveedores (id_clipro),
  FOREIGN KEY (id_cuenta_banco) REFERENCES cuentas (id_cuenta),
  FOREIGN KEY (id_banco) REFERENCES bancos (id_banco),
  FOREIGN KEY (id_concepto_entrada) REFERENCES conceptos (id_concepto),
  FOREIGN KEY (id_concepto_salida) REFERENCES conceptos (id_concepto),
  FOREIGN KEY (id_cuenta_entrada) REFERENCES cuentas (id_cuenta),
  FOREIGN KEY (id_cuenta_salida) REFERENCES cuentas (id_cuenta),
  FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario)
);

INSERT INTO cheques (clase, clasificacion, numero, importe, tipo, fecha_entrega, fecha_cobro, fecha_destino, estado, observacion, uso, id_titular, id_titular_destino, id_cuenta_banco, id_banco, id_concepto_entrada, id_concepto_salida, id_cuenta_entrada, id_cuenta_salida, id_usuario) VALUES
('P', 'E', 'CH-P-0025', 78000.00, 'C', '2026-07-10', '2026-08-10', NULL, 'P', 'Pago vencido, sin gestión', NULL, 14, NULL, 5, NULL, NULL, 4, NULL, NULL, 8),
('P', 'E', 'CH-P-0026', 210000.00, 'D', '2026-07-20', '2026-08-11', NULL, 'P', 'Pago próximo a vencer', NULL, 16, NULL, 7, NULL, NULL, 6, NULL, NULL, 9),
('P', 'E', 'CH-P-0027', 67000.00, 'C', '2026-07-25', '2026-08-13', NULL, 'P', 'Pago por vencer', NULL, 24, NULL, 1, NULL, NULL, 2, NULL, NULL, 3),
('P', 'E', 'CH-P-0028', 185000.00, 'D', '2026-07-28', '2026-08-15', NULL, 'P', 'Pago por vencer en breve', NULL, 26, NULL, 2, NULL, NULL, 4, NULL, NULL, 4),
('P', 'E', 'CH-P-0029', 42000.00, 'C', '2026-09-05', '2026-09-21', NULL, 'P', 'Pago pendiente', NULL, 28, NULL, 8, NULL, NULL, 2, NULL, NULL, 5),
('P', 'E', 'CH-P-0030', 260000.00, 'D', '2026-09-08', '2026-09-29', NULL, 'P', 'Pago pendiente', NULL, 1, NULL, 9, NULL, NULL, 6, NULL, NULL, 6),
('P', 'E', 'CH-P-0031', 99000.00, 'C', '2026-09-10', '2026-10-06', NULL, 'P', 'Pago pendiente', NULL, 5, NULL, 3, NULL, NULL, 3, NULL, NULL, 7),
('P', 'E', 'CH-P-0032', 130000.00, 'D', '2026-09-12', '2026-10-13', NULL, 'P', 'Pago pendiente, vencimiento en octubre', NULL, 9, NULL, 6, NULL, NULL, 2, NULL, NULL, 8),
('P', 'E', 'CH-P-0033', 88000.00, 'C', '2026-09-15', '2026-10-21', NULL, 'P', 'Pago pendiente', NULL, 11, NULL, 10, NULL, NULL, 8, NULL, NULL, 9),
('P', 'E', 'CH-P-0034', 176000.00, 'D', '2026-09-18', '2026-11-02', NULL, 'P', 'Pago diferido a mediano plazo', NULL, 13, NULL, 5, NULL, NULL, 4, NULL, NULL, 10),
('P', 'E', 'CH-P-0035', 54000.00, 'C', '2026-09-20', '2026-11-09', NULL, 'P', 'Pago pendiente', NULL, 15, NULL, 7, NULL, NULL, 2, NULL, NULL, 1);

INSERT INTO cheques (clase, clasificacion, numero, importe, tipo, fecha_entrega, fecha_cobro, fecha_destino, estado, observacion, uso, id_titular, id_titular_destino, id_cuenta_banco, id_banco, id_concepto_entrada, id_concepto_salida, id_cuenta_entrada, id_cuenta_salida, id_usuario) VALUES
('T', 'A', 'CH-T-0025', 71000.00, 'C', '2026-07-10', '2026-08-10', NULL, 'P', 'Cobro vencido, sin gestión', NULL, 15, NULL, NULL, 8, 5, NULL, NULL, NULL, 8),
('T', 'A', 'CH-T-0026', 208000.00, 'D', '2026-07-20', '2026-08-11', NULL, 'P', 'Cobro próximo a vencer', NULL, 17, NULL, NULL, 9, 1, NULL, NULL, NULL, 9),
('T', 'A', 'CH-T-0027', 59000.00, 'C', '2026-07-25', '2026-08-13', NULL, 'P', 'Cobro por vencer', NULL, 25, NULL, NULL, 6, 7, NULL, NULL, NULL, 3),
('T', 'A', 'CH-T-0028', 172000.00, 'D', '2026-07-28', '2026-08-15', NULL, 'P', 'Cobro por vencer en breve', NULL, 27, NULL, NULL, 2, 1, NULL, NULL, NULL, 4),
('T', 'A', 'CH-T-0029', 38000.00, 'C', '2026-09-05', '2026-09-22', NULL, 'P', 'Cobro pendiente', NULL, 29, NULL, NULL, 5, 1, NULL, NULL, NULL, 5),
('T', 'A', 'CH-T-0030', 244000.00, 'D', '2026-09-08', '2026-10-01', NULL, 'P', 'Cobro pendiente', NULL, 2, NULL, NULL, 7, 5, NULL, NULL, NULL, 6),
('T', 'A', 'CH-T-0031', 87000.00, 'C', '2026-09-10', '2026-10-08', NULL, 'P', 'Cobro pendiente', NULL, 4, NULL, NULL, 8, 1, NULL, NULL, NULL, 7),
('T', 'A', 'CH-T-0032', 122000.00, 'D', '2026-09-12', '2026-10-15', NULL, 'P', 'Cobro pendiente', NULL, 6, NULL, NULL, 1, 1, NULL, NULL, NULL, 8),
('T', 'A', 'CH-T-0033', 76000.00, 'C', '2026-09-15', '2026-10-23', NULL, 'P', 'Cobro pendiente a mediano plazo', NULL, 8, NULL, NULL, 3, 7, NULL, NULL, NULL, 9),
('T', 'A', 'CH-T-0034', 165000.00, 'D', '2026-09-18', '2026-11-04', NULL, 'P', 'Cobro pendiente', NULL, 10, NULL, NULL, 6, 1, NULL, NULL, NULL, 10),
('T', 'A', 'CH-T-0035', 51000.00, 'C', '2026-09-20', '2026-11-11', NULL, 'P', 'Cobro con vencimiento lejano', NULL, 12, NULL, NULL, 9, 5, NULL, NULL, NULL, 1);

-- Cheques Propios Cobrados (estado 'C' con imputación)
INSERT INTO cheques (clase, clasificacion, numero, importe, tipo, fecha_entrega, fecha_cobro, fecha_destino, estado, observacion, uso, id_titular, id_titular_destino, id_cuenta_banco, id_banco, id_concepto_entrada, id_concepto_salida, id_cuenta_entrada, id_cuenta_salida, id_usuario) VALUES
('P', 'E', 'CH-P-0036', 95000.00, 'C', '2026-06-10', '2026-07-10', '2026-07-10', 'C', 'Pago cobrado en término', NULL, 3, NULL, 1, NULL, NULL, 2, NULL, NULL, 1),
('P', 'E', 'CH-P-0037', 145000.00, 'D', '2026-06-15', '2026-07-15', '2026-07-16', 'C', 'Pago diferido cobrado', NULL, 8, NULL, 6, NULL, NULL, 4, NULL, NULL, 3),
('P', 'E', 'CH-P-0038', 72000.00, 'C', '2026-06-20', '2026-07-20', '2026-07-20', 'C', 'Pago cobrado al vencimiento', NULL, 16, NULL, 2, NULL, NULL, 6, NULL, NULL, 5),
('P', 'E', 'CH-P-0039', 310000.00, 'D', '2026-05-01', '2026-06-01', '2026-06-02', 'C', 'Pago diferido cobrado con un día de demora', NULL, 24, NULL, 9, NULL, NULL, 3, NULL, NULL, 7),
('P', 'E', 'CH-P-0040', 58000.00, 'C', '2026-07-01', '2026-08-01', '2026-08-01', 'C', 'Pago cobrado correctamente', NULL, 10, NULL, 3, NULL, NULL, 8, NULL, NULL, 9);

-- Cheques Terceros Cobrados (estado 'C' con imputación)
INSERT INTO cheques (clase, clasificacion, numero, importe, tipo, fecha_entrega, fecha_cobro, fecha_destino, estado, observacion, uso, id_titular, id_titular_destino, id_cuenta_banco, id_banco, id_concepto_entrada, id_concepto_salida, id_cuenta_entrada, id_cuenta_salida, id_usuario) VALUES
('T', 'A', 'CH-T-0036', 82000.00, 'C', '2026-06-05', '2026-07-05', '2026-07-05', 'C', 'Cobro depositado en banco', 'D', 15, NULL, NULL, 5, 1, NULL, 6, NULL, 8),
('T', 'A', 'CH-T-0037', 195000.00, 'D', '2026-06-12', '2026-07-12', '2026-07-13', 'C', 'Cobro diferido depositado', 'D', 25, NULL, NULL, 3, 5, NULL, 8, NULL, 4),
('T', 'E', 'CH-T-0038', 67000.00, 'C', '2026-06-18', '2026-07-18', '2026-07-18', 'C', 'Cobro endosado a proveedor', 'E', 29, 6, NULL, 8, 1, NULL, NULL, 2, 6),
('T', 'E', 'CH-T-0039', 230000.00, 'D', '2026-05-10', '2026-06-10', '2026-06-10', 'C', 'Cobro diferido endosado', 'E', 4, 12, NULL, 1, 7, NULL, NULL, 5, 10),
('T', 'A', 'CH-T-0040', 48000.00, 'C', '2026-07-05', '2026-08-05', '2026-08-05', 'C', 'Cobro depositado en caja', 'D', 8, NULL, NULL, 6, 1, NULL, 1, NULL, 3);

-- Cheques Propios Rechazados (estado 'R')
INSERT INTO cheques (clase, clasificacion, numero, importe, tipo, fecha_entrega, fecha_cobro, fecha_destino, estado, observacion, uso, id_titular, id_titular_destino, id_cuenta_banco, id_banco, id_concepto_entrada, id_concepto_salida, id_cuenta_entrada, id_cuenta_salida, id_usuario) VALUES
('P', 'E', 'CH-P-0041', 115000.00, 'D', '2026-06-01', '2026-07-01', NULL, 'R', 'Rechazado por fondos insuficientes', NULL, 20, NULL, 7, NULL, NULL, 2, NULL, NULL, 4),
('P', 'E', 'CH-P-0042', 43000.00, 'C', '2026-06-25', '2026-07-25', NULL, 'R', 'Rechazado por firma no registrada', NULL, 26, NULL, 5, NULL, NULL, 6, NULL, NULL, 6),
('P', 'E', 'CH-P-0043', 200000.00, 'D', '2026-05-15', '2026-06-15', NULL, 'R', 'Rechazado por cuenta cerrada', NULL, 18, NULL, 9, NULL, NULL, 4, NULL, NULL, 8);

-- Cheques Terceros Rechazados (estado 'R')
INSERT INTO cheques (clase, clasificacion, numero, importe, tipo, fecha_entrega, fecha_cobro, fecha_destino, estado, observacion, uso, id_titular, id_titular_destino, id_cuenta_banco, id_banco, id_concepto_entrada, id_concepto_salida, id_cuenta_entrada, id_cuenta_salida, id_usuario) VALUES
('T', 'A', 'CH-T-0041', 93000.00, 'C', '2026-06-08', '2026-07-08', NULL, 'R', 'Rechazado sin fondos', NULL, 17, NULL, NULL, 2, 1, NULL, NULL, NULL, 5),
('T', 'A', 'CH-T-0042', 156000.00, 'D', '2026-06-20', '2026-07-20', NULL, 'R', 'Rechazado por defecto formal', NULL, 21, NULL, NULL, 7, 5, NULL, NULL, NULL, 7),
('T', 'A', 'CH-T-0043', 78000.00, 'C', '2026-05-20', '2026-06-20', NULL, 'R', 'Rechazado por cuenta inhabilitada', NULL, 13, NULL, NULL, 4, 1, NULL, NULL, NULL, 1);

CREATE TABLE IF NOT EXISTS movimientos (
  id_movimiento INTEGER PRIMARY KEY AUTOINCREMENT,
  id_concepto INTEGER,
  id_cuenta INTEGER,
  fecha DATE,
  importe DECIMAL(15,2),
  id_usuario INTEGER,
  id_sucursal INTEGER,
  observaciones TEXT,
  id_tipo INTEGER,
  FOREIGN KEY (id_concepto) REFERENCES conceptos (id_concepto),
  FOREIGN KEY (id_cuenta) REFERENCES cuentas (id_cuenta),
  FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario),
  FOREIGN KEY (id_sucursal) REFERENCES sucursales (id_sucursal),
  FOREIGN KEY (id_tipo) REFERENCES tipos (id_tipo)
);