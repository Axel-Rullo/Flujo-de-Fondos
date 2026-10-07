-- =====================================================================
-- CREATE TABLES
-- =====================================================================

-- ---------------------------------------------------------------------
-- CREATE TABLE bancos
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bancos (
    id_banco INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL
);

-- ---------------------------------------------------------------------
-- CREATE TABLE sucursales
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sucursales (
    id_sucursal INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL
);

-- ---------------------------------------------------------------------
-- CREATE TABLE usuarios
-- ---------------------------------------------------------------------
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

-- ---------------------------------------------------------------------
-- CREATE TABLE clientes_proveedores
-- ---------------------------------------------------------------------
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

-- ---------------------------------------------------------------------
-- CREATE TABLE bancos_clientprov
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bancos_clientprov (
    id_banco_clipro INTEGER PRIMARY KEY AUTOINCREMENT,
    id_clipro INTEGER NOT NULL,
    id_banco INTEGER NOT NULL,
    alias TEXT,
    FOREIGN KEY (id_clipro) REFERENCES clientes_proveedores (id_clipro),
    FOREIGN KEY (id_banco) REFERENCES bancos (id_banco)
);

-- ---------------------------------------------------------------------
-- CREATE TABLE cuentas
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cuentas (
    id_cuenta INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    saldo DECIMAL(15,2),
    id_banco INTEGER,
    FOREIGN KEY (id_banco) REFERENCES bancos (id_banco)
);

-- ---------------------------------------------------------------------
-- CREATE TABLE conceptos
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS conceptos (
    id_concepto INTEGER PRIMARY KEY AUTOINCREMENT,
    cod_concepto TEXT NOT NULL,
    concepto TEXT NOT NULL,
    clasificacion INTEGER
);

-- ---------------------------------------------------------------------
-- CREATE TABLE transacciones_internas
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS transacciones_internas (
    id_transaccion INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha DATE,
    id_cuenta_origen INTEGER,
    id_cuenta_destino INTEGER,
    id_usuario INTEGER,
    monto DECIMAL(15,2),
    FOREIGN KEY (id_cuenta_origen) REFERENCES cuentas (id_cuenta),
    FOREIGN KEY (id_cuenta_destino) REFERENCES cuentas (id_cuenta),
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario)
);

-- ---------------------------------------------------------------------
-- CREATE TABLE cheques
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cheques (
    id_cheque INTEGER PRIMARY KEY AUTOINCREMENT,
    clase TEXT NOT NULL,
    clasificacion TEXT NOT NULL,
    numero TEXT NOT NULL,
    importe DECIMAL(15,2) NOT NULL,
    tipo TEXT NOT NULL,
    fecha_emision DATE NOT NULL,
    fecha_pago DATE NOT NULL,
    fecha_destino DATE,
    estado TEXT NOT NULL,
    observacion TEXT,
    motivo TEXT,
    uso TEXT,
    id_clipro_emision INTEGER NOT NULL,
    id_clipro_imputar INTEGER,
    id_cuenta_propia_emision INTEGER,
    id_banco_emision INTEGER,
    id_concepto_emision INTEGER NOT NULL,
    id_cuenta_propia_imputar INTEGER,
    id_concepto_imputar INTEGER,
    id_usuario INTEGER NOT NULL,
    FOREIGN KEY (id_clipro_emision) REFERENCES clientes_proveedores (id_clipro),
    FOREIGN KEY (id_clipro_imputar) REFERENCES clientes_proveedores (id_clipro),
    FOREIGN KEY (id_cuenta_propia_emision) REFERENCES cuentas (id_cuenta),
    FOREIGN KEY (id_banco_emision) REFERENCES bancos (id_banco),
    FOREIGN KEY (id_concepto_emision) REFERENCES conceptos (id_concepto),
    FOREIGN KEY (id_cuenta_propia_imputar) REFERENCES cuentas (id_cuenta),
    FOREIGN KEY (id_concepto_imputar) REFERENCES conceptos (id_concepto),
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario)
);

-- ---------------------------------------------------------------------
-- CREATE TABLE movimientos
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS movimientos (
    id_movimiento INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha DATE,
    id_cuenta INTEGER,
    id_concepto INTEGER,
    ingreso DECIMAL(15,2),
    egreso DECIMAL(15,2),
    saldo DECIMAL(15,2),
    observaciones TEXT,
    operacion TEXT,
    ch_endosado TEXT,
    id_usuario INTEGER,
    id_sucursal INTEGER,
    FOREIGN KEY (id_cuenta) REFERENCES cuentas (id_cuenta),
    FOREIGN KEY (id_concepto) REFERENCES conceptos (id_concepto),
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario),
    FOREIGN KEY (id_sucursal) REFERENCES sucursales (id_sucursal)
);

-- =====================================================================
-- INSERTS
-- =====================================================================

-- ---------------------------------------------------------------------
-- INSERT bancos
-- ---------------------------------------------------------------------
INSERT INTO bancos (id_banco, nombre) VALUES
    (1, 'Banco de la Nación Argentina'),
    (2, 'Banco Provincia de Santa Fe'),
    (3, 'Banco Galicia'),
    (4, 'Banco Macro'),
    (5, 'Banco Santander'),
    (6, 'Banco BBVA');

-- ---------------------------------------------------------------------
-- INSERT sucursales
-- ---------------------------------------------------------------------
INSERT INTO sucursales (id_sucursal, nombre) VALUES
    (1, 'Casa Central'),
    (2, 'Luis Palacios'),
    (3, 'Totoras'),
    (4, 'San Genaro'),
    (5, 'Salto Grande'),
    (9, 'Lucio V. Lopez');

-- ---------------------------------------------------------------------
-- INSERT usuarios
-- ---------------------------------------------------------------------
INSERT INTO usuarios (id_usuario, user, pass, dni, nombre, email, telefono, rango, id_sucursal, photo, estado) VALUES
    (1, 'axel_rullo', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 46996007, 'Axel Rullo', 'axelrullo17@gmail.com', '3417236528', 'Admin', 2, NULL, 'E'),
    (2, 'mario_saluzzo', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 23425252, 'Mario Saluzzo', 'mario@mail.com', '3415789473', 'Admin', 3, NULL, 'E'),
    (3, 'matias_rivadeneira', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 54839604, 'Matías Rivadeneira', 'matias@gmail.com', '38259374823', 'Miembro', 5, NULL, 'E'),
    (4, 'facundo_sangiacomo', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 45123891, 'Facundo Sangiacomo', 'facundo@gmail.com', '3415123456', 'Miembro', 4, NULL, 'E'),
    (5, 'lucas_albarracin', '$argon2id$v=19$m=20000,t=2,p=1$V7UBBmVUGb/n37EOLDxSTg$NXQNgsSTbMxr1hajs66GKr8fJhlr3VhNNYyFdKI2Hgk', 46234782, 'Lucas Albarracin', 'lucas@gmail.com', '348295824', 'Miembro', 3, NULL, 'E'),
    (6, 'juan_bernal', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 47345673, 'Juan Cruz Bernal', 'juan@gmail.com', '3417345678', 'Miembro', 3, NULL, 'E'),
    (7, 'martin_menna', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 48456764, 'Martín Menna Castells', 'martin@gmail.com', '3418456789', 'Miembro', 3, NULL, 'E'),
    (8, 'fran_pilot', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 49567855, 'Francisco Pilot', 'fran@gmail.com', '3419567890', 'Miembro', 3, NULL, 'E'),
    (9, 'bruno_duarte', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 50678946, 'Bruno Duarte', 'bruno@gmail.com', '3421678901', 'Miembro', 4, NULL, 'N'),
    (10, 'lean_mignacco', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 51789037, 'Leandro Mignacco', 'lean@gmail.com', '3422789012', 'Miembro', 3, NULL, 'N'),
    (11, 'marcos_baro', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 43872156, 'Marcos Baró', 'marcos.baro@gmail.com', '3416237845', 'Admin', 3, NULL, 'E');

-- ---------------------------------------------------------------------
-- INSERT clientes_proveedores
-- ---------------------------------------------------------------------
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

-- ---------------------------------------------------------------------
-- INSERT bancos_clientprov
-- ---------------------------------------------------------------------
INSERT INTO bancos_clientprov (id_clipro, id_banco, alias) VALUES
    (1, 1, 'juan.bianchi.nacion'),
    (2, 2, 'maria.ferreyra.bpsf'),
    (3, 3, 'dsanmartin.galicia.sa'),
    (4, 4, 'losaromos.macro.agro'),
    (5, 1, 'roberto.ponce.nacion'),
    (6, 5, 'cerealesdelsur.santander'),
    (7, 2, 'silvia.coronel.provincia'),
    (8, 6, 'trivadavia.bbva.log'),
    (9, 1, 'marcelo.gomez.nacion'),
    (10, 3, 'insumosfunes.galicia'),
    (11, 4, 'norma.ibarra.macro'),
    (12, 3, 'molinossanjorge.galicia.sa'),
    (13, 1, 'pablo.suarez.nacion'),
    (14, 2, 'ferreteriacentral.provincia'),
    (15, 5, 'claudia.ortiz.santander'),
    (16, 6, 'metalurgicarojas.bbva'),
    (17, 1, 'gustavo.peralta.nacion'),
    (18, 4, 'combustibleslitoral.macro'),
    (19, 2, 'laura.acosta.provincia'),
    (20, 5, 'repuestosagrosur.santander'),
    (21, 1, 'diego.molina.nacion'),
    (22, 6, 'corralontotoras.bbva'),
    (23, 3, 'andrea.vega.galicia'),
    (24, 4, 'semillasdelnorte.macro.sa'),
    (25, 1, 'hernan.dominguez.nacion'),
    (26, 2, 'distrafaela.provincia'),
    (27, 5, 'monica.rios.santander'),
    (28, 6, 'acerosdelcentro.bbva'),
    (29, 1, 'fernando.luna.nacion'),
    (30, 3, 'agroquimicoscasilda.galicia');

-- ---------------------------------------------------------------------
-- INSERT cuentas
-- ---------------------------------------------------------------------
INSERT INTO cuentas (id_cuenta, nombre, saldo, id_banco) VALUES
    (1, 'Caja Casa Central', 2165000.00, NULL),
    (2, 'Banco Principal', 55159495.86, 6),
    (3, 'Banco Secundario', 29267939.32, 3);

-- ---------------------------------------------------------------------
-- INSERT conceptos
-- ---------------------------------------------------------------------
INSERT INTO conceptos (id_concepto, cod_concepto, concepto, clasificacion) VALUES
    (1, '1.01', 'Cobranzas', 1),
    (2, '1.02', 'Pagos a Proveedores', 1),
    (3, '1.03', 'Sueldos y Cargas Sociales', 1),
    (4, '1.04', 'Gastos Generales', 1),
    (5, '1.05', 'Gastos de Alquiler', 1),
    (6, '1.06', 'Impuestos y Tasas', 1),
    (7, '2.01', 'Préstamos Recibidos', 2),
    (8, '2.02', 'Pago de Préstamos', 2),
    (9, '2.03', 'Intereses Pagados', 2),
    (10, '2.04', 'Intereses Cobrados', 2),
    (11, '2.05', 'Adelantos en Cuenta Corriente', 2),
    (12, '3.01', 'Venta de Bienes de Uso', 3),
    (13, '3.02', 'Compra de Bienes de Uso', 3),
    (14, '3.03', 'Venta de Inmuebles', 3),
    (15, '3.04', 'Compra de Rodados', 3);

-- ---------------------------------------------------------------------
-- INSERT cheques (propios · pendientes)
-- ---------------------------------------------------------------------
INSERT INTO cheques (clase, clasificacion, numero, importe, tipo, fecha_emision, fecha_pago, fecha_destino, estado, observacion, motivo, uso, id_clipro_emision, id_clipro_imputar, id_cuenta_propia_emision, id_banco_emision, id_concepto_emision, id_cuenta_propia_imputar, id_concepto_imputar, id_usuario) VALUES
    ('P', 'E', 'CH-P-0001', 45000, 'C', '2026-10-07', '2026-10-07', '2026-11-06', 'P', 'Pago pendiente', NULL, NULL, 4, NULL, 3, NULL, 2, NULL, NULL, 2),
    ('P', 'E', 'CH-P-0002', 62321, 'D', '2026-10-06', '2026-10-09', '2026-11-08', 'P', 'Pago pendiente', NULL, NULL, 4, NULL, 2, NULL, 4, NULL, NULL, 3),
    ('P', 'E', 'CH-P-0003', 79642, 'D', '2026-10-05', '2026-10-10', '2026-11-09', 'P', 'Pago pendiente', NULL, NULL, 8, NULL, 3, NULL, 13, NULL, NULL, 4),
    ('P', 'E', 'CH-P-0004', 96963, 'D', '2026-10-04', '2026-10-11', '2026-11-10', 'P', 'Pago pendiente', NULL, NULL, 10, NULL, 2, NULL, 2, NULL, NULL, 5),
    ('P', 'E', 'CH-P-0005', 114284, 'D', '2026-10-03', '2026-10-12', '2026-11-11', 'P', 'Pago pendiente', NULL, NULL, 12, NULL, 2, NULL, 4, NULL, NULL, 6),
    ('P', 'E', 'CH-P-0006', 131605, 'D', '2026-09-18', '2026-10-13', '2026-11-12', 'P', 'Pago pendiente', NULL, NULL, 16, NULL, 3, NULL, 13, NULL, NULL, 7),
    ('P', 'E', 'CH-P-0007', 148926, 'D', '2026-09-16', '2026-10-14', '2026-11-13', 'P', 'Pago pendiente', NULL, NULL, 18, NULL, 3, NULL, 2, NULL, NULL, 8),
    ('P', 'E', 'CH-P-0008', 166247, 'D', '2026-09-14', '2026-10-15', '2026-11-14', 'P', 'Pago pendiente', NULL, NULL, 20, NULL, 2, NULL, 4, NULL, NULL, 4),
    ('P', 'E', 'CH-P-0009', 183568, 'D', '2026-09-12', '2026-10-16', '2026-11-15', 'P', 'Pago pendiente', NULL, NULL, 24, NULL, 3, NULL, 13, NULL, NULL, 5),
    ('P', 'E', 'CH-P-0010', 200889, 'D', '2026-09-10', '2026-10-17', '2026-11-16', 'P', 'Pago pendiente', NULL, NULL, 28, NULL, 2, NULL, 2, NULL, NULL, 11),
    ('P', 'E', 'CH-P-0011', 218210, 'D', '2026-08-27', '2026-09-08', '2026-10-08', 'P', 'Cobro automático próximo', NULL, NULL, 28, NULL, 2, NULL, 4, NULL, NULL, 1),
    ('P', 'E', 'CH-P-0012', 235531, 'D', '2026-08-30', '2026-09-09', '2026-10-09', 'P', 'Cobro automático próximo', NULL, NULL, 4, NULL, 3, NULL, 13, NULL, NULL, 2),
    ('P', 'E', 'CH-P-0013', 252852, 'D', '2026-08-30', '2026-09-10', '2026-10-10', 'P', 'Cobro automático próximo', NULL, NULL, 3, NULL, 3, NULL, 2, NULL, NULL, 3),
    ('P', 'E', 'CH-P-0014', 270173, 'D', '2026-08-30', '2026-09-11', '2026-10-11', 'P', 'Cobro automático próximo', NULL, NULL, 10, NULL, 2, NULL, 4, NULL, NULL, 4),
    ('P', 'E', 'CH-P-0015', 287494, 'D', '2026-09-02', '2026-09-12', '2026-10-12', 'P', 'Cobro automático próximo', NULL, NULL, 6, NULL, 3, NULL, 13, NULL, NULL, 5),
    ('P', 'E', 'CH-P-0016', 304815, 'D', '2026-09-02', '2026-09-13', '2026-10-13', 'P', 'Cobro automático próximo', NULL, NULL, 16, NULL, 2, NULL, 2, NULL, NULL, 6),
    ('P', 'E', 'CH-P-0017', 322136, 'D', '2026-09-02', '2026-09-14', '2026-10-14', 'P', 'Cobro automático próximo', NULL, NULL, 10, NULL, 2, NULL, 4, NULL, NULL, 7),
    ('P', 'E', 'CH-P-0018', 339457, 'D', '2026-09-05', '2026-09-15', '2026-10-15', 'P', 'Cobro automático próximo', NULL, NULL, 12, NULL, 3, NULL, 13, NULL, NULL, 8),
    ('P', 'E', 'CH-P-0019', 356778, 'D', '2026-09-05', '2026-09-16', '2026-10-16', 'P', 'Cobro automático próximo', NULL, NULL, 16, NULL, 3, NULL, 2, NULL, NULL, 4),
    ('P', 'E', 'CH-P-0020', 374099, 'D', '2026-09-05', '2026-09-17', '2026-10-17', 'P', 'Cobro automático próximo', NULL, NULL, 28, NULL, 2, NULL, 4, NULL, NULL, 5),
    ('P', 'E', 'CH-P-0021', 391420, 'D', '2026-08-19', '2026-10-19', '2026-11-18', 'P', 'Pago diferido', NULL, NULL, 20, NULL, 3, NULL, 13, NULL, NULL, 11),
    ('P', 'E', 'CH-P-0022', 408741, 'D', '2026-08-17', '2026-10-19', '2026-11-18', 'P', 'Pago diferido', NULL, NULL, 4, NULL, 2, NULL, 2, NULL, NULL, 1),
    ('P', 'E', 'CH-P-0023', 426062, 'D', '2026-08-15', '2026-10-20', '2026-11-19', 'P', 'Pago diferido', NULL, NULL, 26, NULL, 2, NULL, 4, NULL, NULL, 2),
    ('P', 'E', 'CH-P-0024', 443383, 'D', '2026-08-13', '2026-10-21', '2026-11-20', 'P', 'Pago diferido', NULL, NULL, 10, NULL, 3, NULL, 13, NULL, NULL, 3),
    ('P', 'E', 'CH-P-0025', 460704, 'D', '2026-08-11', '2026-10-22', '2026-11-21', 'P', 'Pago diferido', NULL, NULL, 30, NULL, 3, NULL, 2, NULL, NULL, 4),
    ('P', 'E', 'CH-P-0026', 478025, 'D', '2026-08-09', '2026-10-23', '2026-11-22', 'P', 'Pago diferido', NULL, NULL, 16, NULL, 2, NULL, 4, NULL, NULL, 5),
    ('P', 'E', 'CH-P-0027', 495346, 'D', '2026-08-07', '2026-10-24', '2026-11-23', 'P', 'Pago diferido', NULL, NULL, 4, NULL, 3, NULL, 13, NULL, NULL, 6),
    ('P', 'E', 'CH-P-0028', 512667, 'D', '2026-08-05', '2026-10-25', '2026-11-24', 'P', 'Pago diferido', NULL, NULL, 6, NULL, 2, NULL, 2, NULL, NULL, 7),
    ('P', 'E', 'CH-P-0029', 529988, 'D', '2026-08-03', '2026-10-26', '2026-11-25', 'P', 'Pago diferido', NULL, NULL, 8, NULL, 2, NULL, 4, NULL, NULL, 8),
    ('P', 'E', 'CH-P-0030', 547309, 'D', '2026-08-01', '2026-10-27', '2026-11-26', 'P', 'Pago diferido', NULL, NULL, 28, NULL, 3, NULL, 13, NULL, NULL, 4),
    ('P', 'E', 'CH-P-0031', 564630, 'D', '2026-07-30', '2026-10-28', '2026-11-27', 'P', 'Pago diferido', NULL, NULL, 12, NULL, 3, NULL, 2, NULL, NULL, 5),
    ('P', 'E', 'CH-P-0032', 581951, 'D', '2026-07-28', '2026-10-29', '2026-11-28', 'P', 'Pago diferido', NULL, NULL, 4, NULL, 2, NULL, 4, NULL, NULL, 11),
    ('P', 'E', 'CH-P-0033', 599272, 'D', '2026-07-26', '2026-10-30', '2026-11-29', 'P', 'Pago diferido', NULL, NULL, 18, NULL, 3, NULL, 13, NULL, NULL, 1),
    ('P', 'E', 'CH-P-0034', 616593, 'D', '2026-07-24', '2026-10-31', '2026-11-30', 'P', 'Pago diferido', NULL, NULL, 10, NULL, 2, NULL, 2, NULL, NULL, 2),
    ('P', 'E', 'CH-P-0035', 633914, 'D', '2026-07-22', '2026-11-01', '2026-12-01', 'P', 'Pago diferido', NULL, NULL, 24, NULL, 2, NULL, 4, NULL, NULL, 3),
    ('P', 'E', 'CH-P-0036', 651235, 'D', '2026-07-20', '2026-11-02', '2026-12-02', 'P', 'Pago diferido', NULL, NULL, 16, NULL, 3, NULL, 13, NULL, NULL, 4),
    ('P', 'E', 'CH-P-0037', 668556, 'D', '2026-07-18', '2026-11-03', '2026-12-03', 'P', 'Pago diferido', NULL, NULL, 28, NULL, 3, NULL, 2, NULL, NULL, 5),
    ('P', 'E', 'CH-P-0038', 685877, 'D', '2026-07-16', '2026-11-04', '2026-12-04', 'P', 'Pago diferido', NULL, NULL, 30, NULL, 2, NULL, 4, NULL, NULL, 6),
    ('P', 'E', 'CH-P-0039', 703198, 'D', '2026-07-14', '2026-11-05', '2026-12-05', 'P', 'Pago diferido', NULL, NULL, 3, NULL, 3, NULL, 13, NULL, NULL, 7),
    ('P', 'E', 'CH-P-0040', 720519, 'D', '2026-07-12', '2026-11-06', '2026-12-06', 'P', 'Pago diferido', NULL, NULL, 28, NULL, 2, NULL, 2, NULL, NULL, 8),
    ('P', 'E', 'CH-P-0041', 737840, 'D', '2026-07-10', '2026-11-07', '2026-12-07', 'P', 'Pago diferido', NULL, NULL, 6, NULL, 2, NULL, 4, NULL, NULL, 4),
    ('P', 'E', 'CH-P-0042', 755161, 'D', '2026-07-08', '2026-11-08', '2026-12-08', 'P', 'Pago diferido', NULL, NULL, 4, NULL, 3, NULL, 13, NULL, NULL, 5),
    ('P', 'E', 'CH-P-0043', 772482, 'D', '2026-07-06', '2026-11-09', '2026-12-09', 'P', 'Pago diferido', NULL, NULL, 10, NULL, 3, NULL, 2, NULL, NULL, 11),
    ('P', 'E', 'CH-P-0044', 789803, 'D', '2026-07-04', '2026-11-10', '2026-12-10', 'P', 'Pago diferido', NULL, NULL, 10, NULL, 2, NULL, 4, NULL, NULL, 1),
    ('P', 'E', 'CH-P-0045', 807124, 'D', '2026-07-02', '2026-11-11', '2026-12-11', 'P', 'Pago diferido', NULL, NULL, 16, NULL, 3, NULL, 13, NULL, NULL, 2),
    ('P', 'E', 'CH-P-0046', 824445, 'D', '2026-06-30', '2026-11-12', '2026-12-12', 'P', 'Pago diferido', NULL, NULL, 16, NULL, 2, NULL, 2, NULL, NULL, 3),
    ('P', 'E', 'CH-P-0047', 841766, 'D', '2026-06-28', '2026-11-13', '2026-12-13', 'P', 'Pago diferido', NULL, NULL, 20, NULL, 2, NULL, 4, NULL, NULL, 4),
    ('P', 'E', 'CH-P-0048', 859087, 'D', '2026-06-26', '2026-11-14', '2026-12-14', 'P', 'Pago diferido', NULL, NULL, 24, NULL, 3, NULL, 13, NULL, NULL, 5),
    ('P', 'E', 'CH-P-0049', 876408, 'D', '2026-06-24', '2026-11-15', '2026-12-15', 'P', 'Pago diferido', NULL, NULL, 26, NULL, 3, NULL, 2, NULL, NULL, 6),
    ('P', 'E', 'CH-P-0050', 893729, 'D', '2026-06-22', '2026-11-16', '2026-12-16', 'P', 'Pago diferido', NULL, NULL, 28, NULL, 2, NULL, 4, NULL, NULL, 7),
    ('P', 'E', 'CH-P-0051', 911050, 'D', '2026-06-20', '2026-11-17', '2026-12-17', 'P', 'Pago diferido', NULL, NULL, 30, NULL, 3, NULL, 13, NULL, NULL, 8),
    ('P', 'E', 'CH-P-0052', 928371, 'D', '2026-06-18', '2026-11-18', '2026-12-18', 'P', 'Pago diferido', NULL, NULL, 4, NULL, 2, NULL, 2, NULL, NULL, 4),
    ('P', 'E', 'CH-P-0053', 945692, 'D', '2026-06-16', '2026-11-19', '2026-12-19', 'P', 'Pago diferido', NULL, NULL, 4, NULL, 2, NULL, 4, NULL, NULL, 5),
    ('P', 'E', 'CH-P-0054', 963013, 'D', '2026-06-14', '2026-11-20', '2026-12-20', 'P', 'Pago diferido', NULL, NULL, 10, NULL, 3, NULL, 13, NULL, NULL, 11),
    ('P', 'E', 'CH-P-0055', 980334, 'D', '2026-06-12', '2026-11-21', '2026-12-21', 'P', 'Pago diferido', NULL, NULL, 8, NULL, 3, NULL, 2, NULL, NULL, 1);

-- ---------------------------------------------------------------------
-- INSERT cheques (propios · cobrados)
-- ---------------------------------------------------------------------
INSERT INTO cheques (clase, clasificacion, numero, importe, tipo, fecha_emision, fecha_pago, fecha_destino, estado, observacion, motivo, uso, id_clipro_emision, id_clipro_imputar, id_cuenta_propia_emision, id_banco_emision, id_concepto_emision, id_cuenta_propia_imputar, id_concepto_imputar, id_usuario) VALUES
    ('P', 'E', 'CH-P-0056', 38000, 'C', '2026-09-06', '2026-09-06', '2026-10-06', 'C', 'Cheque propio cobrado automáticamente', NULL, NULL, 8, NULL, 2, NULL, 2, NULL, NULL, 4),
    ('P', 'E', 'CH-P-0057', 59917, 'D', '2026-08-24', '2026-09-03', '2026-10-03', 'C', 'Cheque propio cobrado automáticamente', NULL, NULL, 12, NULL, 3, NULL, 4, NULL, NULL, 6),
    ('P', 'E', 'CH-P-0058', 81834, 'D', '2026-08-21', '2026-08-31', '2026-09-30', 'C', 'Cheque propio cobrado automáticamente', NULL, NULL, 18, NULL, 2, NULL, 13, NULL, NULL, 8),
    ('P', 'E', 'CH-P-0059', 103751, 'C', '2026-08-28', '2026-08-28', '2026-09-27', 'C', 'Cheque propio cobrado', NULL, NULL, 18, NULL, 2, NULL, 2, NULL, NULL, 10),
    ('P', 'E', 'CH-P-0060', 125668, 'D', '2026-08-15', '2026-08-25', '2026-09-24', 'C', 'Cheque propio cobrado automáticamente', NULL, NULL, 28, NULL, 3, NULL, 4, NULL, NULL, 1),
    ('P', 'E', 'CH-P-0061', 147585, 'D', '2026-08-12', '2026-08-22', '2026-09-21', 'C', 'Cheque propio cobrado automáticamente', NULL, NULL, 3, NULL, 3, NULL, 13, NULL, NULL, 3),
    ('P', 'E', 'CH-P-0062', 169502, 'C', '2026-08-29', '2026-08-29', '2026-09-28', 'C', 'Cheque propio cobrado', NULL, NULL, 8, NULL, 2, NULL, 2, NULL, NULL, 5),
    ('P', 'E', 'CH-P-0063', 191419, 'D', '2026-08-25', '2026-09-04', '2026-10-04', 'C', 'Cheque propio cobrado automáticamente', NULL, NULL, 28, NULL, 3, NULL, 4, NULL, NULL, 7),
    ('P', 'E', 'CH-P-0064', 213336, 'D', '2026-08-21', '2026-08-31', '2026-09-30', 'C', 'Cheque propio cobrado automáticamente', NULL, NULL, 18, NULL, 2, NULL, 13, NULL, NULL, 9),
    ('P', 'E', 'CH-P-0065', 235253, 'C', '2026-08-17', '2026-08-17', '2026-09-16', 'C', 'Cheque propio cobrado', NULL, NULL, 3, NULL, 2, NULL, 2, NULL, NULL, 11),
    ('P', 'E', 'CH-P-0066', 257170, 'D', '2026-08-13', '2026-08-23', '2026-09-22', 'C', 'Cheque propio cobrado automáticamente', NULL, NULL, 28, NULL, 3, NULL, 4, NULL, NULL, 2),
    ('P', 'E', 'CH-P-0067', 279087, 'D', '2026-08-09', '2026-08-19', '2026-09-18', 'C', 'Cheque propio cobrado automáticamente', NULL, NULL, 3, NULL, 3, NULL, 13, NULL, NULL, 4),
    ('P', 'E', 'CH-P-0068', 301004, 'C', '2026-08-05', '2026-08-05', '2026-09-04', 'C', 'Cheque propio cobrado', NULL, NULL, 8, NULL, 2, NULL, 2, NULL, NULL, 6),
    ('P', 'E', 'CH-P-0069', 322921, 'D', '2026-08-01', '2026-08-11', '2026-09-10', 'C', 'Cheque propio cobrado automáticamente', NULL, NULL, 10, NULL, 3, NULL, 4, NULL, NULL, 8),
    ('P', 'E', 'CH-P-0070', 344838, 'D', '2026-07-28', '2026-08-07', '2026-09-06', 'C', 'Cheque propio cobrado automáticamente', NULL, NULL, 18, NULL, 2, NULL, 13, NULL, NULL, 10),
    ('P', 'E', 'CH-P-0071', 366755, 'C', '2026-07-24', '2026-07-24', '2026-08-23', 'C', 'Cheque propio cobrado', NULL, NULL, 16, NULL, 2, NULL, 2, NULL, NULL, 1),
    ('P', 'E', 'CH-P-0072', 388672, 'D', '2026-07-20', '2026-07-30', '2026-08-29', 'C', 'Cheque propio cobrado automáticamente', NULL, NULL, 28, NULL, 3, NULL, 4, NULL, NULL, 3),
    ('P', 'E', 'CH-P-0073', 410589, 'D', '2026-07-16', '2026-07-26', '2026-08-25', 'C', 'Cheque propio cobrado automáticamente', NULL, NULL, 3, NULL, 3, NULL, 13, NULL, NULL, 5),
    ('P', 'E', 'CH-P-0074', 432506, 'C', '2026-07-12', '2026-07-12', '2026-08-11', 'C', 'Cheque propio cobrado', NULL, NULL, 8, NULL, 2, NULL, 2, NULL, NULL, 7),
    ('P', 'E', 'CH-P-0075', 454423, 'D', '2026-07-08', '2026-07-18', '2026-08-17', 'C', 'Cheque propio cobrado automáticamente', NULL, NULL, 26, NULL, 3, NULL, 4, NULL, NULL, 9),
    ('P', 'E', 'CH-P-0076', 476340, 'D', '2026-07-04', '2026-07-14', '2026-08-13', 'C', 'Cheque propio cobrado automáticamente', NULL, NULL, 18, NULL, 2, NULL, 13, NULL, NULL, 11),
    ('P', 'E', 'CH-P-0077', 498257, 'C', '2026-06-30', '2026-06-30', '2026-07-30', 'C', 'Cheque propio cobrado', NULL, NULL, 30, NULL, 2, NULL, 2, NULL, NULL, 2),
    ('P', 'E', 'CH-P-0078', 520174, 'D', '2026-06-26', '2026-07-06', '2026-08-05', 'C', 'Cheque propio cobrado automáticamente', NULL, NULL, 28, NULL, 3, NULL, 4, NULL, NULL, 4),
    ('P', 'E', 'CH-P-0079', 542091, 'D', '2026-06-22', '2026-07-02', '2026-08-01', 'C', 'Cheque propio cobrado automáticamente', NULL, NULL, 3, NULL, 3, NULL, 13, NULL, NULL, 6),
    ('P', 'E', 'CH-P-0080', 564008, 'C', '2026-06-18', '2026-06-18', '2026-07-18', 'C', 'Cheque propio cobrado', NULL, NULL, 8, NULL, 2, NULL, 2, NULL, NULL, 8),
    ('P', 'E', 'CH-P-0081', 585925, 'D', '2026-06-14', '2026-06-24', '2026-07-24', 'C', 'Cheque propio cobrado automáticamente', NULL, NULL, 8, NULL, 3, NULL, 4, NULL, NULL, 10),
    ('P', 'E', 'CH-P-0082', 607842, 'D', '2026-06-10', '2026-06-20', '2026-07-20', 'C', 'Cheque propio cobrado automáticamente', NULL, NULL, 18, NULL, 2, NULL, 13, NULL, NULL, 1),
    ('P', 'E', 'CH-P-0083', 629759, 'C', '2026-06-06', '2026-06-06', '2026-07-06', 'C', 'Cheque propio cobrado', NULL, NULL, 12, NULL, 2, NULL, 2, NULL, NULL, 3),
    ('P', 'E', 'CH-P-0084', 651676, 'D', '2026-06-02', '2026-06-12', '2026-07-12', 'C', 'Cheque propio cobrado automáticamente', NULL, NULL, 28, NULL, 3, NULL, 4, NULL, NULL, 5),
    ('P', 'E', 'CH-P-0085', 673593, 'D', '2026-05-29', '2026-06-08', '2026-07-08', 'C', 'Cheque propio cobrado automáticamente', NULL, NULL, 3, NULL, 3, NULL, 13, NULL, NULL, 7),
    ('P', 'E', 'CH-P-0086', 695510, 'C', '2026-05-25', '2026-05-25', '2026-06-24', 'C', 'Cheque propio cobrado', NULL, NULL, 8, NULL, 2, NULL, 2, NULL, NULL, 9),
    ('P', 'E', 'CH-P-0087', 717427, 'D', '2026-05-21', '2026-05-31', '2026-06-30', 'C', 'Cheque propio cobrado automáticamente', NULL, NULL, 24, NULL, 3, NULL, 4, NULL, NULL, 11),
    ('P', 'E', 'CH-P-0088', 739344, 'D', '2026-05-17', '2026-05-27', '2026-06-26', 'C', 'Cheque propio cobrado automáticamente', NULL, NULL, 18, NULL, 2, NULL, 13, NULL, NULL, 2),
    ('P', 'E', 'CH-P-0089', 761261, 'C', '2026-05-13', '2026-05-13', '2026-06-12', 'C', 'Cheque propio cobrado', NULL, NULL, 28, NULL, 2, NULL, 2, NULL, NULL, 4),
    ('P', 'E', 'CH-P-0090', 783178, 'D', '2026-05-09', '2026-05-19', '2026-06-18', 'C', 'Cheque propio cobrado automáticamente', NULL, NULL, 28, NULL, 3, NULL, 4, NULL, NULL, 6),
    ('P', 'E', 'CH-P-0091', 805095, 'D', '2026-05-05', '2026-05-15', '2026-06-14', 'C', 'Cheque propio cobrado automáticamente', NULL, NULL, 3, NULL, 3, NULL, 13, NULL, NULL, 8),
    ('P', 'E', 'CH-P-0092', 827012, 'C', '2026-05-01', '2026-05-01', '2026-05-31', 'C', 'Cheque propio cobrado', NULL, NULL, 8, NULL, 2, NULL, 2, NULL, NULL, 10),
    ('P', 'E', 'CH-P-0093', 848929, 'D', '2026-04-27', '2026-05-07', '2026-06-06', 'C', 'Cheque propio cobrado automáticamente', NULL, NULL, 6, NULL, 3, NULL, 4, NULL, NULL, 1),
    ('P', 'E', 'CH-P-0094', 870846, 'D', '2026-04-23', '2026-05-03', '2026-06-02', 'C', 'Cheque propio cobrado automáticamente', NULL, NULL, 18, NULL, 2, NULL, 13, NULL, NULL, 3),
    ('P', 'E', 'CH-P-0095', 892763, 'C', '2026-04-19', '2026-04-19', '2026-05-19', 'C', 'Cheque propio cobrado', NULL, NULL, 10, NULL, 2, NULL, 2, NULL, NULL, 5),
    ('P', 'E', 'CH-P-0096', 914680, 'D', '2026-04-15', '2026-04-25', '2026-05-25', 'C', 'Cheque propio cobrado automáticamente', NULL, NULL, 28, NULL, 3, NULL, 4, NULL, NULL, 7);

-- ---------------------------------------------------------------------
-- INSERT cheques (propios · rechazados)
-- ---------------------------------------------------------------------
INSERT INTO cheques (clase, clasificacion, numero, importe, tipo, fecha_emision, fecha_pago, fecha_destino, estado, observacion, motivo, uso, id_clipro_emision, id_clipro_imputar, id_cuenta_propia_emision, id_banco_emision, id_concepto_emision, id_cuenta_propia_imputar, id_concepto_imputar, id_usuario) VALUES
    ('P', 'E', 'CH-P-0097', 92000, 'D', '2026-08-23', '2026-09-22', '2026-09-23', 'R', 'Cheque rechazado por el banco', 'Fondos insuficientes', NULL, 16, NULL, 2, NULL, 2, NULL, NULL, 7),
    ('P', 'E', 'CH-P-0098', 139000, 'D', '2026-08-03', '2026-09-02', '2026-09-03', 'R', 'Cheque rechazado por el banco', 'Firma no coincide', NULL, 12, NULL, 3, NULL, 4, NULL, NULL, 8);

-- ---------------------------------------------------------------------
-- INSERT cheques (propios · anulados)
-- ---------------------------------------------------------------------
INSERT INTO cheques (clase, clasificacion, numero, importe, tipo, fecha_emision, fecha_pago, fecha_destino, estado, observacion, motivo, uso, id_clipro_emision, id_clipro_imputar, id_cuenta_propia_emision, id_banco_emision, id_concepto_emision, id_cuenta_propia_imputar, id_concepto_imputar, id_usuario) VALUES
    ('P', 'E', 'CH-P-0099', 57000, 'C', '2026-09-29', '2026-09-29', '2026-09-30', 'A', 'Cheque anulado', 'Error de carga', NULL, 20, NULL, 3, NULL, 4, NULL, NULL, 9),
    ('P', 'E', 'CH-P-0100', 88000, 'C', '2026-09-22', '2026-09-22', '2026-09-23', 'A', 'Cheque anulado', 'Reemplazo del cheque', NULL, 24, NULL, 2, NULL, 2, NULL, NULL, 10);

-- ---------------------------------------------------------------------
-- INSERT cheques (terceros · pendientes)
-- ---------------------------------------------------------------------
INSERT INTO cheques (clase, clasificacion, numero, importe, tipo, fecha_emision, fecha_pago, fecha_destino, estado, observacion, motivo, uso, id_clipro_emision, id_clipro_imputar, id_cuenta_propia_emision, id_banco_emision, id_concepto_emision, id_cuenta_propia_imputar, id_concepto_imputar, id_usuario) VALUES
    ('T', 'A', 'CH-T-0001', 52311, 'C', '2026-10-07', '2026-10-07', '2026-11-06', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 2, NULL, NULL, 2, 1, NULL, NULL, 2),
    ('T', 'A', 'CH-T-0002', 69632, 'D', '2026-10-06', '2026-10-09', '2026-11-08', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 5, NULL, NULL, 1, 1, NULL, NULL, 3),
    ('T', 'A', 'CH-T-0003', 86953, 'D', '2026-10-05', '2026-10-10', '2026-11-09', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 7, NULL, NULL, 2, 1, NULL, NULL, 4),
    ('T', 'A', 'CH-T-0004', 104274, 'D', '2026-10-04', '2026-10-11', '2026-11-10', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 11, NULL, NULL, 4, 1, NULL, NULL, 5),
    ('T', 'A', 'CH-T-0005', 121595, 'D', '2026-10-03', '2026-10-12', '2026-11-11', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 13, NULL, NULL, 1, 1, NULL, NULL, 6),
    ('T', 'A', 'CH-T-0006', 138916, 'D', '2026-09-18', '2026-10-13', '2026-11-12', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 17, NULL, NULL, 1, 1, NULL, NULL, 7),
    ('T', 'A', 'CH-T-0007', 156237, 'D', '2026-09-16', '2026-10-14', '2026-11-13', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 17, NULL, NULL, 1, 1, NULL, NULL, 8),
    ('T', 'A', 'CH-T-0008', 173558, 'D', '2026-09-14', '2026-10-15', '2026-11-14', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 23, NULL, NULL, 3, 1, NULL, NULL, 4),
    ('T', 'A', 'CH-T-0009', 190879, 'D', '2026-09-12', '2026-10-16', '2026-11-15', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 23, NULL, NULL, 3, 1, NULL, NULL, 5),
    ('T', 'A', 'CH-T-0010', 208200, 'D', '2026-09-10', '2026-10-17', '2026-11-16', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 29, NULL, NULL, 1, 1, NULL, NULL, 11),
    ('T', 'A', 'CH-T-0011', 225521, 'D', '2026-08-27', '2026-09-08', '2026-10-08', 'P', 'Cobro automático próximo', NULL, NULL, 2, NULL, NULL, 2, 1, NULL, NULL, 1),
    ('T', 'A', 'CH-T-0012', 242842, 'D', '2026-08-30', '2026-09-09', '2026-10-09', 'P', 'Cobro automático próximo', NULL, NULL, 5, NULL, NULL, 1, 1, NULL, NULL, 2),
    ('T', 'A', 'CH-T-0013', 260163, 'D', '2026-08-30', '2026-09-10', '2026-10-10', 'P', 'Cobro automático próximo', NULL, NULL, 2, NULL, NULL, 2, 1, NULL, NULL, 3),
    ('T', 'A', 'CH-T-0014', 277484, 'D', '2026-08-30', '2026-09-11', '2026-10-11', 'P', 'Cobro automático próximo', NULL, NULL, 11, NULL, NULL, 4, 1, NULL, NULL, 4),
    ('T', 'A', 'CH-T-0015', 294805, 'D', '2026-09-02', '2026-09-12', '2026-10-12', 'P', 'Cobro automático próximo', NULL, NULL, 7, NULL, NULL, 2, 1, NULL, NULL, 5),
    ('T', 'A', 'CH-T-0016', 312126, 'D', '2026-09-02', '2026-09-13', '2026-10-13', 'P', 'Cobro automático próximo', NULL, NULL, 17, NULL, NULL, 1, 1, NULL, NULL, 6),
    ('T', 'A', 'CH-T-0017', 329447, 'D', '2026-09-02', '2026-09-14', '2026-10-14', 'P', 'Cobro automático próximo', NULL, NULL, 13, NULL, NULL, 1, 1, NULL, NULL, 7),
    ('T', 'A', 'CH-T-0018', 346768, 'D', '2026-09-05', '2026-09-15', '2026-10-15', 'P', 'Cobro automático próximo', NULL, NULL, 23, NULL, NULL, 3, 1, NULL, NULL, 8),
    ('T', 'A', 'CH-T-0019', 364089, 'D', '2026-09-05', '2026-09-16', '2026-10-16', 'P', 'Cobro automático próximo', NULL, NULL, 17, NULL, NULL, 1, 1, NULL, NULL, 4),
    ('T', 'A', 'CH-T-0020', 381410, 'D', '2026-09-05', '2026-09-17', '2026-10-17', 'P', 'Cobro automático próximo', NULL, NULL, 29, NULL, NULL, 1, 1, NULL, NULL, 5),
    ('T', 'A', 'CH-T-0021', 398731, 'D', '2026-08-19', '2026-10-19', '2026-11-18', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 2, NULL, NULL, 2, 1, NULL, NULL, 11),
    ('T', 'A', 'CH-T-0022', 416052, 'D', '2026-08-17', '2026-10-20', '2026-11-19', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 5, NULL, NULL, 1, 1, NULL, NULL, 1),
    ('T', 'A', 'CH-T-0023', 433373, 'D', '2026-08-15', '2026-10-21', '2026-11-20', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 29, NULL, NULL, 1, 1, NULL, NULL, 2),
    ('T', 'A', 'CH-T-0024', 450694, 'D', '2026-08-13', '2026-10-22', '2026-11-21', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 11, NULL, NULL, 4, 1, NULL, NULL, 3),
    ('T', 'A', 'CH-T-0025', 468015, 'D', '2026-08-11', '2026-10-23', '2026-11-22', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 2, NULL, NULL, 2, 1, NULL, NULL, 4),
    ('T', 'A', 'CH-T-0026', 485336, 'D', '2026-08-09', '2026-10-24', '2026-11-23', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 17, NULL, NULL, 1, 1, NULL, NULL, 5),
    ('T', 'A', 'CH-T-0027', 502657, 'D', '2026-08-07', '2026-10-25', '2026-11-24', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 7, NULL, NULL, 2, 1, NULL, NULL, 6),
    ('T', 'A', 'CH-T-0028', 519978, 'D', '2026-08-05', '2026-10-26', '2026-11-25', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 23, NULL, NULL, 3, 1, NULL, NULL, 7),
    ('T', 'A', 'CH-T-0029', 537299, 'D', '2026-08-03', '2026-10-27', '2026-11-26', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 13, NULL, NULL, 1, 1, NULL, NULL, 8),
    ('T', 'A', 'CH-T-0030', 554620, 'D', '2026-08-01', '2026-10-28', '2026-11-27', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 29, NULL, NULL, 1, 1, NULL, NULL, 4),
    ('T', 'A', 'CH-T-0031', 571941, 'D', '2026-07-30', '2026-10-29', '2026-11-28', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 2, NULL, NULL, 2, 1, NULL, NULL, 5),
    ('T', 'A', 'CH-T-0032', 589262, 'D', '2026-07-28', '2026-10-30', '2026-11-29', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 5, NULL, NULL, 1, 1, NULL, NULL, 11),
    ('T', 'A', 'CH-T-0033', 606583, 'D', '2026-07-26', '2026-10-31', '2026-11-30', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 23, NULL, NULL, 3, 1, NULL, NULL, 1),
    ('T', 'A', 'CH-T-0034', 623904, 'D', '2026-07-24', '2026-11-01', '2026-12-01', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 11, NULL, NULL, 4, 1, NULL, NULL, 2),
    ('T', 'A', 'CH-T-0035', 641225, 'D', '2026-07-22', '2026-11-02', '2026-12-02', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 29, NULL, NULL, 1, 1, NULL, NULL, 3),
    ('T', 'A', 'CH-T-0036', 658546, 'D', '2026-07-20', '2026-11-03', '2026-12-03', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 17, NULL, NULL, 1, 1, NULL, NULL, 4),
    ('T', 'A', 'CH-T-0037', 675867, 'D', '2026-07-18', '2026-11-04', '2026-12-04', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 2, NULL, NULL, 2, 1, NULL, NULL, 5),
    ('T', 'A', 'CH-T-0038', 693188, 'D', '2026-07-16', '2026-11-05', '2026-12-05', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 23, NULL, NULL, 3, 1, NULL, NULL, 6),
    ('T', 'A', 'CH-T-0039', 710509, 'D', '2026-07-14', '2026-11-06', '2026-12-06', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 7, NULL, NULL, 2, 1, NULL, NULL, 7),
    ('T', 'A', 'CH-T-0040', 727830, 'D', '2026-07-12', '2026-11-07', '2026-12-07', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 29, NULL, NULL, 1, 1, NULL, NULL, 8),
    ('T', 'A', 'CH-T-0041', 745151, 'D', '2026-07-10', '2026-11-08', '2026-12-08', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 2, NULL, NULL, 2, 1, NULL, NULL, 4),
    ('T', 'A', 'CH-T-0042', 762472, 'D', '2026-07-08', '2026-11-09', '2026-12-09', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 5, NULL, NULL, 1, 1, NULL, NULL, 5),
    ('T', 'A', 'CH-T-0043', 779793, 'D', '2026-07-06', '2026-11-10', '2026-12-10', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 17, NULL, NULL, 1, 1, NULL, NULL, 11),
    ('T', 'A', 'CH-T-0044', 797114, 'D', '2026-07-04', '2026-11-11', '2026-12-11', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 11, NULL, NULL, 4, 1, NULL, NULL, 1),
    ('T', 'A', 'CH-T-0045', 814435, 'D', '2026-07-02', '2026-11-12', '2026-12-12', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 23, NULL, NULL, 3, 1, NULL, NULL, 2),
    ('T', 'A', 'CH-T-0046', 831756, 'D', '2026-06-30', '2026-11-13', '2026-12-13', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 17, NULL, NULL, 1, 1, NULL, NULL, 3),
    ('T', 'A', 'CH-T-0047', 849077, 'D', '2026-06-28', '2026-11-14', '2026-12-14', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 29, NULL, NULL, 1, 1, NULL, NULL, 4),
    ('T', 'A', 'CH-T-0048', 866398, 'D', '2026-06-26', '2026-11-15', '2026-12-15', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 23, NULL, NULL, 3, 1, NULL, NULL, 5),
    ('T', 'A', 'CH-T-0049', 883719, 'D', '2026-06-24', '2026-11-16', '2026-12-16', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 2, NULL, NULL, 2, 1, NULL, NULL, 6),
    ('T', 'A', 'CH-T-0050', 901040, 'D', '2026-06-22', '2026-11-17', '2026-12-17', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 29, NULL, NULL, 1, 1, NULL, NULL, 7),
    ('T', 'A', 'CH-T-0051', 918361, 'D', '2026-06-20', '2026-11-18', '2026-12-18', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 2, NULL, NULL, 2, 1, NULL, NULL, 8),
    ('T', 'A', 'CH-T-0052', 935682, 'D', '2026-06-18', '2026-11-19', '2026-12-19', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 5, NULL, NULL, 1, 1, NULL, NULL, 4),
    ('T', 'A', 'CH-T-0053', 953003, 'D', '2026-06-16', '2026-11-20', '2026-12-20', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 13, NULL, NULL, 1, 1, NULL, NULL, 5),
    ('T', 'A', 'CH-T-0054', 970324, 'D', '2026-06-14', '2026-11-21', '2026-12-21', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 11, NULL, NULL, 4, 1, NULL, NULL, 11),
    ('T', 'A', 'CH-T-0055', 987645, 'D', '2026-06-12', '2026-11-22', '2026-12-22', 'P', 'Cheque de tercero pendiente de cobro', NULL, NULL, 17, NULL, NULL, 1, 1, NULL, NULL, 1);

-- ---------------------------------------------------------------------
-- INSERT cheques (terceros · cobrados)
-- ---------------------------------------------------------------------
INSERT INTO cheques (clase, clasificacion, numero, importe, tipo, fecha_emision, fecha_pago, fecha_destino, estado, observacion, motivo, uso, id_clipro_emision, id_clipro_imputar, id_cuenta_propia_emision, id_banco_emision, id_concepto_emision, id_cuenta_propia_imputar, id_concepto_imputar, id_usuario) VALUES
    ('T', 'A', 'CH-T-0056', 40000, 'C', '2026-09-06', '2026-09-06', '2026-10-06', 'C', 'Cheque de tercero cobrado automáticamente', NULL, 'D', 17, NULL, NULL, 1, 1, 2, NULL, 4),
    ('T', 'A', 'CH-T-0057', 61917, 'D', '2026-08-24', '2026-09-03', '2026-10-03', 'C', 'Cheque de tercero cobrado automáticamente', NULL, 'D', 23, NULL, NULL, 3, 1, 3, NULL, 6),
    ('T', 'A', 'CH-T-0058', 83834, 'D', '2026-08-21', '2026-08-31', '2026-09-30', 'C', 'Cheque de tercero cobrado automáticamente', NULL, 'D', 23, NULL, NULL, 3, 1, 2, NULL, 8),
    ('T', 'A', 'CH-T-0059', 105751, 'C', '2026-08-28', '2026-08-28', '2026-09-27', 'C', 'Cheque de tercero cobrado', NULL, 'D', 29, NULL, NULL, 1, 1, 3, NULL, 10),
    ('T', 'A', 'CH-T-0060', 127668, 'D', '2026-08-15', '2026-08-25', '2026-09-24', 'C', 'Cheque de tercero endosado', NULL, 'E', 29, 30, NULL, 1, 1, NULL, 2, 1),
    ('T', 'A', 'CH-T-0061', 149585, 'D', '2026-08-12', '2026-08-22', '2026-09-21', 'C', 'Cheque de tercero cobrado automáticamente', NULL, 'D', 2, NULL, NULL, 2, 1, 3, NULL, 3),
    ('T', 'A', 'CH-T-0062', 171502, 'C', '2026-08-29', '2026-08-29', '2026-09-28', 'C', 'Cheque de tercero cobrado', NULL, 'D', 5, NULL, NULL, 1, 1, 2, NULL, 5),
    ('T', 'A', 'CH-T-0063', 193419, 'D', '2026-08-25', '2026-09-04', '2026-10-04', 'C', 'Cheque de tercero cobrado automáticamente', NULL, 'D', 7, NULL, NULL, 2, 1, 3, NULL, 7),
    ('T', 'A', 'CH-T-0064', 215336, 'D', '2026-08-21', '2026-08-31', '2026-09-30', 'C', 'Cheque de tercero cobrado automáticamente', NULL, 'D', 11, NULL, NULL, 4, 1, 2, NULL, 9),
    ('T', 'A', 'CH-T-0065', 237253, 'C', '2026-08-17', '2026-08-17', '2026-09-16', 'C', 'Cheque de tercero endosado', NULL, 'E', 13, 3, NULL, 1, 1, NULL, 4, 11),
    ('T', 'A', 'CH-T-0066', 259170, 'D', '2026-08-13', '2026-08-23', '2026-09-22', 'C', 'Cheque de tercero cobrado automáticamente', NULL, 'D', 17, NULL, NULL, 1, 1, 2, NULL, 2),
    ('T', 'A', 'CH-T-0067', 281087, 'D', '2026-08-09', '2026-08-19', '2026-09-18', 'C', 'Cheque de tercero cobrado automáticamente', NULL, 'D', 17, NULL, NULL, 1, 1, 3, NULL, 4),
    ('T', 'A', 'CH-T-0068', 303004, 'C', '2026-08-05', '2026-08-05', '2026-09-04', 'C', 'Cheque de tercero cobrado', NULL, 'D', 23, NULL, NULL, 3, 1, 2, NULL, 6),
    ('T', 'A', 'CH-T-0069', 324921, 'D', '2026-08-01', '2026-08-11', '2026-09-10', 'C', 'Cheque de tercero cobrado automáticamente', NULL, 'D', 23, NULL, NULL, 3, 1, 3, NULL, 8),
    ('T', 'A', 'CH-T-0070', 346838, 'D', '2026-07-28', '2026-08-07', '2026-09-06', 'C', 'Cheque de tercero endosado', NULL, 'E', 29, 4, NULL, 1, 1, NULL, 13, 10),
    ('T', 'A', 'CH-T-0071', 368755, 'C', '2026-07-24', '2026-07-24', '2026-08-23', 'C', 'Cheque de tercero cobrado', NULL, 'D', 2, NULL, NULL, 2, 1, 3, NULL, 1),
    ('T', 'A', 'CH-T-0072', 390672, 'D', '2026-07-20', '2026-07-30', '2026-08-29', 'C', 'Cheque de tercero cobrado automáticamente', NULL, 'D', 5, NULL, NULL, 1, 1, 2, NULL, 3),
    ('T', 'A', 'CH-T-0073', 412589, 'D', '2026-07-16', '2026-07-26', '2026-08-25', 'C', 'Cheque de tercero cobrado automáticamente', NULL, 'D', 2, NULL, NULL, 2, 1, 3, NULL, 5),
    ('T', 'A', 'CH-T-0074', 434506, 'C', '2026-07-12', '2026-07-12', '2026-08-11', 'C', 'Cheque de tercero cobrado', NULL, 'D', 11, NULL, NULL, 4, 1, 2, NULL, 7),
    ('T', 'A', 'CH-T-0075', 456423, 'D', '2026-07-08', '2026-07-18', '2026-08-17', 'C', 'Cheque de tercero endosado', NULL, 'E', 7, 6, NULL, 2, 1, NULL, 2, 9),
    ('T', 'A', 'CH-T-0076', 478340, 'D', '2026-07-04', '2026-07-14', '2026-08-13', 'C', 'Cheque de tercero cobrado automáticamente', NULL, 'D', 17, NULL, NULL, 1, 1, 2, NULL, 11),
    ('T', 'A', 'CH-T-0077', 500257, 'C', '2026-06-30', '2026-06-30', '2026-07-30', 'C', 'Cheque de tercero cobrado', NULL, 'D', 13, NULL, NULL, 1, 1, 3, NULL, 2),
    ('T', 'A', 'CH-T-0078', 522174, 'D', '2026-06-26', '2026-07-06', '2026-08-05', 'C', 'Cheque de tercero cobrado automáticamente', NULL, 'D', 23, NULL, NULL, 3, 1, 2, NULL, 4),
    ('T', 'A', 'CH-T-0079', 544091, 'D', '2026-06-22', '2026-07-02', '2026-08-01', 'C', 'Cheque de tercero cobrado automáticamente', NULL, 'D', 17, NULL, NULL, 1, 1, 3, NULL, 6),
    ('T', 'A', 'CH-T-0080', 566008, 'C', '2026-06-18', '2026-06-18', '2026-07-18', 'C', 'Cheque de tercero endosado', NULL, 'E', 29, 8, NULL, 1, 1, NULL, 4, 8),
    ('T', 'A', 'CH-T-0081', 587925, 'D', '2026-06-14', '2026-06-24', '2026-07-24', 'C', 'Cheque de tercero cobrado automáticamente', NULL, 'D', 2, NULL, NULL, 2, 1, 3, NULL, 10),
    ('T', 'A', 'CH-T-0082', 609842, 'D', '2026-06-10', '2026-06-20', '2026-07-20', 'C', 'Cheque de tercero cobrado automáticamente', NULL, 'D', 5, NULL, NULL, 1, 1, 2, NULL, 1),
    ('T', 'A', 'CH-T-0083', 631759, 'C', '2026-06-06', '2026-06-06', '2026-07-06', 'C', 'Cheque de tercero cobrado', NULL, 'D', 29, NULL, NULL, 1, 1, 3, NULL, 3),
    ('T', 'A', 'CH-T-0084', 653676, 'D', '2026-06-02', '2026-06-12', '2026-07-12', 'C', 'Cheque de tercero cobrado automáticamente', NULL, 'D', 11, NULL, NULL, 4, 1, 2, NULL, 5),
    ('T', 'A', 'CH-T-0085', 675593, 'D', '2026-05-29', '2026-06-08', '2026-07-08', 'C', 'Cheque de tercero endosado', NULL, 'E', 2, 10, NULL, 2, 1, NULL, 13, 7),
    ('T', 'A', 'CH-T-0086', 697510, 'C', '2026-05-25', '2026-05-25', '2026-06-24', 'C', 'Cheque de tercero cobrado', NULL, 'D', 17, NULL, NULL, 1, 1, 2, NULL, 9),
    ('T', 'A', 'CH-T-0087', 719427, 'D', '2026-05-21', '2026-05-31', '2026-06-30', 'C', 'Cheque de tercero cobrado automáticamente', NULL, 'D', 7, NULL, NULL, 2, 1, 3, NULL, 11),
    ('T', 'A', 'CH-T-0088', 741344, 'D', '2026-05-17', '2026-05-27', '2026-06-26', 'C', 'Cheque de tercero cobrado automáticamente', NULL, 'D', 23, NULL, NULL, 3, 1, 2, NULL, 2),
    ('T', 'A', 'CH-T-0089', 763261, 'C', '2026-05-13', '2026-05-13', '2026-06-12', 'C', 'Cheque de tercero cobrado', NULL, 'D', 13, NULL, NULL, 1, 1, 3, NULL, 4),
    ('T', 'A', 'CH-T-0090', 785178, 'D', '2026-05-09', '2026-05-19', '2026-06-18', 'C', 'Cheque de tercero endosado', NULL, 'E', 29, 12, NULL, 1, 1, NULL, 2, 6),
    ('T', 'A', 'CH-T-0091', 807095, 'D', '2026-05-05', '2026-05-15', '2026-06-14', 'C', 'Cheque de tercero cobrado automáticamente', NULL, 'D', 2, NULL, NULL, 2, 1, 3, NULL, 8),
    ('T', 'A', 'CH-T-0092', 829012, 'C', '2026-05-01', '2026-05-01', '2026-05-31', 'C', 'Cheque de tercero cobrado', NULL, 'D', 5, NULL, NULL, 1, 1, 2, NULL, 10),
    ('T', 'A', 'CH-T-0093', 850929, 'D', '2026-04-27', '2026-05-07', '2026-06-06', 'C', 'Cheque de tercero cobrado automáticamente', NULL, 'D', 23, NULL, NULL, 3, 1, 3, NULL, 1),
    ('T', 'A', 'CH-T-0094', 872846, 'D', '2026-04-23', '2026-05-03', '2026-06-02', 'C', 'Cheque de tercero cobrado automáticamente', NULL, 'D', 11, NULL, NULL, 4, 1, 2, NULL, 3),
    ('T', 'A', 'CH-T-0095', 894763, 'C', '2026-04-19', '2026-04-19', '2026-05-19', 'C', 'Cheque de tercero endosado', NULL, 'E', 29, 16, NULL, 1, 1, NULL, 4, 5),
    ('T', 'A', 'CH-T-0096', 916680, 'D', '2026-04-15', '2026-04-25', '2026-05-25', 'C', 'Cheque de tercero cobrado automáticamente', NULL, 'D', 17, NULL, NULL, 1, 1, 2, NULL, 7);

-- ---------------------------------------------------------------------
-- INSERT cheques (terceros · rechazados)
-- ---------------------------------------------------------------------
INSERT INTO cheques (clase, clasificacion, numero, importe, tipo, fecha_emision, fecha_pago, fecha_destino, estado, observacion, motivo, uso, id_clipro_emision, id_clipro_imputar, id_cuenta_propia_emision, id_banco_emision, id_concepto_emision, id_cuenta_propia_imputar, id_concepto_imputar, id_usuario) VALUES
    ('T', 'A', 'CH-T-0097', 95000, 'D', '2026-08-23', '2026-09-22', '2026-09-23', 'R', 'Cheque de tercero rechazado por el banco', 'Fondos insuficientes', NULL, 2, NULL, NULL, 2, 1, NULL, NULL, 8),
    ('T', 'A', 'CH-T-0098', 142000, 'D', '2026-08-03', '2026-09-02', '2026-09-03', 'R', 'Cheque de tercero rechazado por el banco', 'Firma no coincide', NULL, 23, NULL, NULL, 3, 1, NULL, NULL, 9);

-- ---------------------------------------------------------------------
-- INSERT cheques (terceros · anulados)
-- ---------------------------------------------------------------------
INSERT INTO cheques (clase, clasificacion, numero, importe, tipo, fecha_emision, fecha_pago, fecha_destino, estado, observacion, motivo, uso, id_clipro_emision, id_clipro_imputar, id_cuenta_propia_emision, id_banco_emision, id_concepto_emision, id_cuenta_propia_imputar, id_concepto_imputar, id_usuario) VALUES
    ('T', 'A', 'CH-T-0099', 61000, 'C', '2026-09-29', '2026-09-29', '2026-09-30', 'A', 'Cheque de tercero anulado', 'Error de carga', NULL, 7, NULL, NULL, 2, 1, NULL, NULL, 10),
    ('T', 'A', 'CH-T-0100', 93000, 'C', '2026-09-22', '2026-09-22', '2026-09-23', 'A', 'Cheque de tercero anulado', 'Reemplazo del cheque', NULL, 29, NULL, NULL, 1, 1, NULL, NULL, 11);

-- ---------------------------------------------------------------------
-- INSERT movimientos
-- ---------------------------------------------------------------------
INSERT INTO movimientos (fecha, id_cuenta, id_concepto, ingreso, egreso, saldo, observaciones, operacion, ch_endosado, id_usuario, id_sucursal) VALUES
    ('2026-02-01', 1, NULL, 5000000.00, NULL, 5000000.00, 'Saldo inicial de la cuenta', NULL, NULL, NULL, NULL),
    ('2026-02-01', 2, NULL, 60000000.00, NULL, 65000000.00, 'Saldo inicial de la cuenta', NULL, NULL, NULL, NULL),
    ('2026-02-01', 3, NULL, 25000000.00, NULL, 90000000.00, 'Saldo inicial de la cuenta', NULL, NULL, NULL, NULL),
    ('2026-02-03', 1, 10, 70000.00, NULL, 90070000.00, 'Intereses cobrados', 'Ingreso', NULL, 1, 2),
    ('2026-02-05', 2, 2, NULL, 180000.00, 89890000.00, 'Pago a proveedores', 'Egreso', NULL, 2, 3),
    ('2026-02-07', 2, 3, NULL, 150000.00, 89740000.00, 'Sueldos y cargas sociales', 'Egreso', NULL, 1, 2),
    ('2026-02-11', 3, 1, 600000.00, NULL, 90340000.00, 'Cobranza de clientes', 'Ingreso', NULL, 1, 2),
    ('2026-02-12', 3, 4, NULL, 65000.00, 90275000.00, 'Gastos generales', 'Egreso', NULL, 3, 5),
    ('2026-02-14', 1, 1, 350000.00, NULL, 90625000.00, 'Cobranza de clientes', 'Ingreso', NULL, 1, 2),
    ('2026-02-18', 2, 1, 70000.00, NULL, 90695000.00, 'Cobranza de clientes', 'Ingreso', NULL, 1, 2),
    ('2026-02-20', 1, 1, 240000.00, NULL, 90935000.00, 'Cobranza de clientes', 'Ingreso', NULL, 4, 4),
    ('2026-02-22', 3, 1, 120000.00, NULL, 91055000.00, 'Cobranza de clientes', 'Ingreso', NULL, 1, 2),
    ('2026-02-26', 1, 6, NULL, 50000.00, 91005000.00, 'Pago de impuestos', 'Egreso', NULL, 1, 2),
    ('2026-03-01', 1, NULL, 5610000.00, NULL, 5610000.00, 'Saldo inicial del mes', NULL, NULL, NULL, NULL),
    ('2026-03-01', 2, NULL, 59740000.00, NULL, 65350000.00, 'Saldo inicial del mes', NULL, NULL, NULL, NULL),
    ('2026-03-01', 3, NULL, 25655000.00, NULL, 91005000.00, 'Saldo inicial del mes', NULL, NULL, NULL, NULL),
    ('2026-03-03', 2, 3, NULL, 450000.00, 90555000.00, 'Sueldos y cargas sociales', 'Egreso', NULL, 1, 2),
    ('2026-03-06', 3, 10, 320000.00, NULL, 90875000.00, 'Intereses cobrados', 'Ingreso', NULL, 1, 2),
    ('2026-03-10', 1, 3, NULL, 50000.00, 90825000.00, 'Sueldos y cargas sociales', 'Egreso', NULL, 1, 2),
    ('2026-03-12', 3, 9, NULL, 95000.00, 90730000.00, 'Intereses pagados', 'Egreso', NULL, 2, 3),
    ('2026-03-14', 2, 7, 180000.00, NULL, 90910000.00, 'Préstamo recibido', 'Ingreso', NULL, 1, 2),
    ('2026-03-18', 3, 1, 180000.00, NULL, 91090000.00, 'Cobranza de clientes', 'Ingreso', NULL, 1, 2),
    ('2026-03-20', 1, 5, NULL, 220000.00, 90870000.00, 'Pago de alquiler', 'Egreso', NULL, 1, 2),
    ('2026-03-21', 1, 1, 180000.00, NULL, 91050000.00, 'Cobranza de clientes', 'Ingreso', NULL, 1, 2),
    ('2026-03-25', 2, 4, NULL, 80000.00, 90970000.00, 'Gastos generales', 'Egreso', NULL, 1, 2),
    ('2026-03-27', 1, 1, 130000.00, NULL, 91100000.00, 'Cobranza de clientes', 'Ingreso', NULL, 5, 3),
    ('2026-03-29', 3, 7, 800000.00, NULL, 91900000.00, 'Préstamo recibido', 'Ingreso', NULL, 1, 2),
    ('2026-04-01', 1, NULL, 5650000.00, NULL, 5650000.00, 'Saldo inicial del mes', NULL, NULL, NULL, NULL),
    ('2026-04-01', 2, NULL, 59390000.00, NULL, 65040000.00, 'Saldo inicial del mes', NULL, NULL, NULL, NULL),
    ('2026-04-01', 3, NULL, 26860000.00, NULL, 91900000.00, 'Saldo inicial del mes', NULL, NULL, NULL, NULL),
    ('2026-04-03', 1, 1, 700000.00, NULL, 92600000.00, 'Cobranza de clientes', 'Ingreso', NULL, 1, 2),
    ('2026-04-07', 2, 1, 350000.00, NULL, 92950000.00, 'Cobranza de clientes', 'Ingreso', NULL, 1, 2),
    ('2026-04-10', 3, 1, 320000.00, NULL, 93270000.00, 'Cobranza de clientes', 'Ingreso', NULL, 1, 2),
    ('2026-04-12', 3, 11, 500000.00, NULL, 93770000.00, 'Adelanto en cuenta corriente', 'Ingreso', NULL, 2, 3),
    ('2026-04-14', 1, 6, NULL, 300000.00, 93470000.00, 'Pago de impuestos', 'Egreso', NULL, 1, 2),
    ('2026-04-18', 2, 2, NULL, 80000.00, 93390000.00, 'Pago a proveedores', 'Egreso', NULL, 1, 2),
    ('2026-04-20', 1, 5, NULL, 220000.00, 93170000.00, 'Pago de alquiler', 'Egreso', NULL, 1, 2),
    ('2026-04-22', 3, 1, 600000.00, NULL, 93770000.00, 'Cobranza de clientes', 'Ingreso', NULL, 1, 2),
    ('2026-04-24', 2, 4, NULL, 75000.00, 93695000.00, 'Gastos generales', 'Egreso', NULL, 6, 3),
    ('2026-04-26', 1, 1, 70000.00, NULL, 93765000.00, 'Cobranza de clientes', 'Ingreso', NULL, 1, 2),
    ('2026-04-29', 2, 7, 250000.00, NULL, 94015000.00, 'Préstamo recibido', 'Ingreso', NULL, 1, 2),
    ('2026-05-01', 1, NULL, 5900000.00, NULL, 5900000.00, 'Saldo inicial del mes', NULL, NULL, NULL, NULL),
    ('2026-05-01', 2, NULL, 59835000.00, NULL, 65735000.00, 'Saldo inicial del mes', NULL, NULL, NULL, NULL),
    ('2026-05-01', 3, NULL, 28280000.00, NULL, 94015000.00, 'Saldo inicial del mes', NULL, NULL, NULL, NULL),
    ('2026-05-04', 3, 10, 320000.00, NULL, 94335000.00, 'Intereses cobrados', 'Ingreso', NULL, 1, 2),
    ('2026-05-08', 1, 7, 120000.00, NULL, 94455000.00, 'Préstamo recibido', 'Ingreso', NULL, 1, 2),
    ('2026-05-10', 3, 9, NULL, 110000.00, 94345000.00, 'Intereses pagados', 'Egreso', NULL, 2, 3),
    ('2026-05-12', 2, 8, NULL, 220000.00, 94125000.00, 'Pago de préstamo', 'Egreso', NULL, 1, 2),
    ('2026-05-15', 3, 10, 600000.00, NULL, 94725000.00, 'Intereses cobrados', 'Ingreso', NULL, 1, 2),
    ('2026-05-18', 1, 1, 310000.00, NULL, 95035000.00, 'Cobranza de clientes', 'Ingreso', NULL, 7, 3),
    ('2026-05-19', 1, 6, NULL, 110000.00, 94925000.00, 'Pago de impuestos', 'Egreso', NULL, 1, 2),
    ('2026-05-19', 2, 2, NULL, 892763.00, 94032237.00, 'Cheque Propio N° CH-P-0095', 'Cheque Propio', NULL, 5, 3),
    ('2026-05-19', NULL, 1, 894763.00, NULL, 94032237.00, 'Cheque de Terceros N° CH-T-0095', 'Cheque de Terceros Endosado', 'Cheque Endosado', 5, 3),
    ('2026-05-19', NULL, 4, NULL, 894763.00, 94032237.00, 'Cheque de Terceros N° CH-T-0095', 'Cheque de Terceros Endosado', 'Cheque Endosado', 5, 3),
    ('2026-05-20', 1, 5, NULL, 220000.00, 93812237.00, 'Pago de alquiler', 'Egreso', NULL, 1, 2),
    ('2026-05-23', 2, 7, 120000.00, NULL, 93932237.00, 'Préstamo recibido', 'Ingreso', NULL, 1, 2),
    ('2026-05-25', 3, 4, NULL, 914680.00, 93017557.00, 'Cheque Propio N° CH-P-0096', 'Cheque Propio', NULL, 7, 3),
    ('2026-05-25', 2, 1, 916680.00, NULL, 93934237.00, 'Cheque de Terceros N° CH-T-0096', 'Cheque de Terceros Depositado CH-T-0096', NULL, 7, 3),
    ('2026-05-27', 3, 7, 320000.00, NULL, 94254237.00, 'Préstamo recibido', 'Ingreso', NULL, 1, 2),
    ('2026-05-31', 1, 10, 500000.00, NULL, 94754237.00, 'Intereses cobrados', 'Ingreso', NULL, 1, 2),
    ('2026-05-31', 2, 2, NULL, 827012.00, 93927225.00, 'Cheque Propio N° CH-P-0092', 'Cheque Propio', NULL, 1, 2),
    ('2026-05-31', 2, 1, 829012.00, NULL, 94756237.00, 'Cheque de Terceros N° CH-T-0092', 'Cheque de Terceros Depositado CH-T-0092', NULL, 1, 2),
    ('2026-06-01', 1, NULL, 6500000.00, NULL, 6500000.00, 'Saldo inicial del mes', NULL, NULL, NULL, NULL),
    ('2026-06-01', 2, NULL, 59760917.00, NULL, 66260917.00, 'Saldo inicial del mes', NULL, NULL, NULL, NULL),
    ('2026-06-01', 3, NULL, 28495320.00, NULL, 94756237.00, 'Saldo inicial del mes', NULL, NULL, NULL, NULL),
    ('2026-06-02', 2, 13, NULL, 870846.00, 93885391.00, 'Cheque Propio N° CH-P-0094', 'Cheque Propio', NULL, 3, 5),
    ('2026-06-02', 2, 1, 872846.00, NULL, 94758237.00, 'Cheque de Terceros N° CH-T-0094', 'Cheque de Terceros Depositado CH-T-0094', NULL, 3, 5),
    ('2026-06-04', 2, 2, NULL, 300000.00, 94458237.00, 'Pago a proveedores', 'Egreso', NULL, 1, 2),
    ('2026-06-06', 3, 4, NULL, 848929.00, 93609308.00, 'Cheque Propio N° CH-P-0093', 'Cheque Propio', NULL, 1, 2),
    ('2026-06-06', 3, 1, 850929.00, NULL, 94460237.00, 'Cheque de Terceros N° CH-T-0093', 'Cheque de Terceros Depositado CH-T-0093', NULL, 1, 2),
    ('2026-06-08', 3, 1, 180000.00, NULL, 94640237.00, 'Cobranza de clientes', 'Ingreso', NULL, 1, 2),
    ('2026-06-12', 1, 7, 250000.00, NULL, 94890237.00, 'Préstamo recibido', 'Ingreso', NULL, 1, 2),
    ('2026-06-12', 2, 2, NULL, 761261.00, 94128976.00, 'Cheque Propio N° CH-P-0089', 'Cheque Propio', NULL, 4, 4),
    ('2026-06-12', 3, 1, 763261.00, NULL, 94892237.00, 'Cheque de Terceros N° CH-T-0089', 'Cheque de Terceros Depositado CH-T-0089', NULL, 4, 4),
    ('2026-06-14', 3, 12, 850000.00, NULL, 95742237.00, 'Venta de bienes de uso', 'Ingreso', NULL, 3, 5),
    ('2026-06-14', 3, 13, NULL, 805095.00, 94937142.00, 'Cheque Propio N° CH-P-0091', 'Cheque Propio', NULL, 8, 3),
    ('2026-06-14', 3, 1, 807095.00, NULL, 95744237.00, 'Cheque de Terceros N° CH-T-0091', 'Cheque de Terceros Depositado CH-T-0091', NULL, 8, 3),
    ('2026-06-16', 2, 3, NULL, 300000.00, 95444237.00, 'Sueldos y cargas sociales', 'Egreso', NULL, 1, 2),
    ('2026-06-18', 3, 4, NULL, 783178.00, 94661059.00, 'Cheque Propio N° CH-P-0090', 'Cheque Propio', NULL, 6, 3),
    ('2026-06-18', NULL, 1, 785178.00, NULL, 94661059.00, 'Cheque de Terceros N° CH-T-0090', 'Cheque de Terceros Endosado', 'Cheque Endosado', 6, 3),
    ('2026-06-18', NULL, 2, NULL, 785178.00, 94661059.00, 'Cheque de Terceros N° CH-T-0090', 'Cheque de Terceros Endosado', 'Cheque Endosado', 6, 3),
    ('2026-06-20', 3, 7, 600000.00, NULL, 95261059.00, 'Préstamo recibido', 'Ingreso', NULL, 1, 2),
    ('2026-06-20', 1, 5, NULL, 220000.00, 95041059.00, 'Pago de alquiler', 'Egreso', NULL, 1, 2),
    ('2026-06-23', 1, 3, NULL, 600000.00, 94441059.00, 'Sueldos y cargas sociales', 'Egreso', NULL, 1, 2),
    ('2026-06-24', 2, 2, NULL, 695510.00, 93745549.00, 'Cheque Propio N° CH-P-0086', 'Cheque Propio', NULL, 1, 2),
    ('2026-06-24', 2, 1, 697510.00, NULL, 94443059.00, 'Cheque de Terceros N° CH-T-0086', 'Cheque de Terceros Depositado CH-T-0086', NULL, 1, 2),
    ('2026-06-25', 1, 4, NULL, 40000.00, 94403059.00, 'Gastos generales', 'Egreso', NULL, 8, 3),
    ('2026-06-26', 2, 13, NULL, 739344.00, 93663715.00, 'Cheque Propio N° CH-P-0088', 'Cheque Propio', NULL, 2, 3),
    ('2026-06-26', 2, 1, 741344.00, NULL, 94405059.00, 'Cheque de Terceros N° CH-T-0088', 'Cheque de Terceros Depositado CH-T-0088', NULL, 2, 3),
    ('2026-06-27', 2, 8, NULL, 150000.00, 94255059.00, 'Pago de préstamo', 'Egreso', NULL, 1, 2),
    ('2026-06-30', 3, 4, NULL, 717427.00, 93537632.00, 'Cheque Propio N° CH-P-0087', 'Cheque Propio', NULL, 11, 3),
    ('2026-06-30', 3, 1, 719427.00, NULL, 94257059.00, 'Cheque de Terceros N° CH-T-0087', 'Cheque de Terceros Depositado CH-T-0087', NULL, 11, 3),
    ('2026-07-01', 1, NULL, 5890000.00, NULL, 5890000.00, 'Saldo inicial del mes', NULL, NULL, NULL, NULL),
    ('2026-07-01', 2, NULL, 58255656.00, NULL, 64145656.00, 'Saldo inicial del mes', NULL, NULL, NULL, NULL),
    ('2026-07-01', 3, NULL, 30111403.00, NULL, 94257059.00, 'Saldo inicial del mes', NULL, NULL, NULL, NULL),
    ('2026-07-02', 3, 10, 450000.00, NULL, 94707059.00, 'Intereses cobrados', 'Ingreso', NULL, 1, 2),
    ('2026-07-06', 1, 6, NULL, 450000.00, 94257059.00, 'Pago de impuestos', 'Egreso', NULL, 1, 2),
    ('2026-07-06', 2, 2, NULL, 629759.00, 93627300.00, 'Cheque Propio N° CH-P-0083', 'Cheque Propio', NULL, 3, 5),
    ('2026-07-06', 3, 1, 631759.00, NULL, 94259059.00, 'Cheque de Terceros N° CH-T-0083', 'Cheque de Terceros Depositado CH-T-0083', NULL, 3, 5),
    ('2026-07-08', 3, 13, NULL, 673593.00, 93585466.00, 'Cheque Propio N° CH-P-0085', 'Cheque Propio', NULL, 7, 3),
    ('2026-07-08', NULL, 1, 675593.00, NULL, 93585466.00, 'Cheque de Terceros N° CH-T-0085', 'Cheque de Terceros Endosado', 'Cheque Endosado', 7, 3),
    ('2026-07-08', NULL, 13, NULL, 675593.00, 93585466.00, 'Cheque de Terceros N° CH-T-0085', 'Cheque de Terceros Endosado', 'Cheque Endosado', 7, 3),
    ('2026-07-09', 2, 3, NULL, 150000.00, 93435466.00, 'Sueldos y cargas sociales', 'Egreso', NULL, 1, 2),
    ('2026-07-12', 3, 4, NULL, 651676.00, 92783790.00, 'Cheque Propio N° CH-P-0084', 'Cheque Propio', NULL, 5, 3),
    ('2026-07-12', 2, 1, 653676.00, NULL, 93437466.00, 'Cheque de Terceros N° CH-T-0084', 'Cheque de Terceros Depositado CH-T-0084', NULL, 5, 3),
    ('2026-07-13', 3, 7, 450000.00, NULL, 93887466.00, 'Préstamo recibido', 'Ingreso', NULL, 1, 2),
    ('2026-07-15', 3, 9, NULL, 105000.00, 93782466.00, 'Intereses pagados', 'Egreso', NULL, 2, 3),
    ('2026-07-17', 1, 2, NULL, 50000.00, 93732466.00, 'Pago a proveedores', 'Egreso', NULL, 1, 2),
    ('2026-07-18', 2, 2, NULL, 564008.00, 93168458.00, 'Cheque Propio N° CH-P-0080', 'Cheque Propio', NULL, 8, 3),
    ('2026-07-18', NULL, 1, 566008.00, NULL, 93168458.00, 'Cheque de Terceros N° CH-T-0080', 'Cheque de Terceros Endosado', 'Cheque Endosado', 8, 3),
    ('2026-07-18', NULL, 4, NULL, 566008.00, 93168458.00, 'Cheque de Terceros N° CH-T-0080', 'Cheque de Terceros Endosado', 'Cheque Endosado', 8, 3),
    ('2026-07-20', 1, 5, NULL, 220000.00, 92948458.00, 'Pago de alquiler', 'Egreso', NULL, 1, 2),
    ('2026-07-20', 2, 13, NULL, 607842.00, 92340616.00, 'Cheque Propio N° CH-P-0082', 'Cheque Propio', NULL, 1, 2),
    ('2026-07-20', 2, 1, 609842.00, NULL, 92950458.00, 'Cheque de Terceros N° CH-T-0082', 'Cheque de Terceros Depositado CH-T-0082', NULL, 1, 2),
    ('2026-07-21', 2, 8, NULL, 110000.00, 92840458.00, 'Pago de préstamo', 'Egreso', NULL, 1, 2),
    ('2026-07-24', 3, 4, NULL, 585925.00, 92254533.00, 'Cheque Propio N° CH-P-0081', 'Cheque Propio', NULL, 1, 2),
    ('2026-07-24', 3, 1, 587925.00, NULL, 92842458.00, 'Cheque de Terceros N° CH-T-0081', 'Cheque de Terceros Depositado CH-T-0081', NULL, 1, 2),
    ('2026-07-25', 3, 10, 320000.00, NULL, 93162458.00, 'Intereses cobrados', 'Ingreso', NULL, 1, 2),
    ('2026-07-28', 1, 6, NULL, 450000.00, 92712458.00, 'Pago de impuestos', 'Egreso', NULL, 1, 2),
    ('2026-07-30', 1, 1, 275000.00, NULL, 92987458.00, 'Cobranza de clientes', 'Ingreso', NULL, 4, 4),
    ('2026-07-30', 2, 2, NULL, 498257.00, 92489201.00, 'Cheque Propio N° CH-P-0077', 'Cheque Propio', NULL, 2, 3),
    ('2026-07-30', 3, 1, 500257.00, NULL, 92989458.00, 'Cheque de Terceros N° CH-T-0077', 'Cheque de Terceros Depositado CH-T-0077', NULL, 2, 3),
    ('2026-08-01', 1, NULL, 4995000.00, NULL, 4995000.00, 'Saldo inicial del mes', NULL, NULL, NULL, NULL),
    ('2026-08-01', 2, NULL, 56959308.00, NULL, 61954308.00, 'Saldo inicial del mes', NULL, NULL, NULL, NULL),
    ('2026-08-01', 3, NULL, 31035150.00, NULL, 92989458.00, 'Saldo inicial del mes', NULL, NULL, NULL, NULL),
    ('2026-08-01', 3, 13, NULL, 542091.00, 92447367.00, 'Cheque Propio N° CH-P-0079', 'Cheque Propio', NULL, 6, 3),
    ('2026-08-01', 3, 1, 544091.00, NULL, 92991458.00, 'Cheque de Terceros N° CH-T-0079', 'Cheque de Terceros Depositado CH-T-0079', NULL, 6, 3),
    ('2026-08-02', 2, 7, 350000.00, NULL, 93341458.00, 'Préstamo recibido', 'Ingreso', NULL, 1, 2),
    ('2026-08-05', 3, 4, NULL, 520174.00, 92821284.00, 'Cheque Propio N° CH-P-0078', 'Cheque Propio', NULL, 4, 4),
    ('2026-08-05', 2, 1, 522174.00, NULL, 93343458.00, 'Cheque de Terceros N° CH-T-0078', 'Cheque de Terceros Depositado CH-T-0078', NULL, 4, 4),
    ('2026-08-06', 3, 1, 450000.00, NULL, 93793458.00, 'Cobranza de clientes', 'Ingreso', NULL, 1, 2),
    ('2026-08-10', 1, 10, 70000.00, NULL, 93863458.00, 'Intereses cobrados', 'Ingreso', NULL, 1, 2),
    ('2026-08-11', 2, 2, NULL, 432506.00, 93430952.00, 'Cheque Propio N° CH-P-0074', 'Cheque Propio', NULL, 7, 3),
    ('2026-08-11', 2, 1, 434506.00, NULL, 93865458.00, 'Cheque de Terceros N° CH-T-0074', 'Cheque de Terceros Depositado CH-T-0074', NULL, 7, 3),
    ('2026-08-13', 2, 13, NULL, 476340.00, 93389118.00, 'Cheque Propio N° CH-P-0076', 'Cheque Propio', NULL, 11, 3),
    ('2026-08-13', 2, 1, 478340.00, NULL, 93867458.00, 'Cheque de Terceros N° CH-T-0076', 'Cheque de Terceros Depositado CH-T-0076', NULL, 11, 3),
    ('2026-08-14', 2, 7, 700000.00, NULL, 94567458.00, 'Préstamo recibido', 'Ingreso', NULL, 1, 2),
    ('2026-08-17', 3, 10, 800000.00, NULL, 95367458.00, 'Intereses cobrados', 'Ingreso', NULL, 1, 2),
    ('2026-08-17', 3, 4, NULL, 454423.00, 94913035.00, 'Cheque Propio N° CH-P-0075', 'Cheque Propio', NULL, 1, 2),
    ('2026-08-17', NULL, 1, 456423.00, NULL, 94913035.00, 'Cheque de Terceros N° CH-T-0075', 'Cheque de Terceros Endosado', 'Cheque Endosado', 1, 2),
    ('2026-08-17', NULL, 2, NULL, 456423.00, 94913035.00, 'Cheque de Terceros N° CH-T-0075', 'Cheque de Terceros Endosado', 'Cheque Endosado', 1, 2),
    ('2026-08-21', 1, 5, NULL, 220000.00, 94693035.00, 'Pago de alquiler', 'Egreso', NULL, 1, 2),
    ('2026-08-23', 2, 2, NULL, 366755.00, 94326280.00, 'Cheque Propio N° CH-P-0071', 'Cheque Propio', NULL, 1, 2),
    ('2026-08-23', 3, 1, 368755.00, NULL, 94695035.00, 'Cheque de Terceros N° CH-T-0071', 'Cheque de Terceros Depositado CH-T-0071', NULL, 1, 2),
    ('2026-08-25', 2, 8, NULL, 50000.00, 94645035.00, 'Pago de préstamo', 'Egreso', NULL, 1, 2),
    ('2026-08-25', 3, 13, NULL, 410589.00, 94234446.00, 'Cheque Propio N° CH-P-0073', 'Cheque Propio', NULL, 5, 3),
    ('2026-08-25', 3, 1, 412589.00, NULL, 94647035.00, 'Cheque de Terceros N° CH-T-0073', 'Cheque de Terceros Depositado CH-T-0073', NULL, 5, 3),
    ('2026-08-29', 3, 4, NULL, 388672.00, 94258363.00, 'Cheque Propio N° CH-P-0072', 'Cheque Propio', NULL, 3, 5),
    ('2026-08-29', 2, 1, 390672.00, NULL, 94649035.00, 'Cheque de Terceros N° CH-T-0072', 'Cheque de Terceros Depositado CH-T-0072', NULL, 3, 5),
    ('2026-08-30', 3, 7, 600000.00, NULL, 95249035.00, 'Préstamo recibido', 'Ingreso', NULL, 1, 2),
    ('2026-09-01', 1, NULL, 4845000.00, NULL, 4845000.00, 'Saldo inicial del mes', NULL, NULL, NULL, NULL),
    ('2026-09-01', 2, NULL, 58509399.00, NULL, 63354399.00, 'Saldo inicial del mes', NULL, NULL, NULL, NULL),
    ('2026-09-01', 3, NULL, 31894636.00, NULL, 95249035.00, 'Saldo inicial del mes', NULL, NULL, NULL, NULL),
    ('2026-09-04', 2, 2, NULL, 301004.00, 94948031.00, 'Cheque Propio N° CH-P-0068', 'Cheque Propio', NULL, 6, 3),
    ('2026-09-04', 2, 1, 303004.00, NULL, 95251035.00, 'Cheque de Terceros N° CH-T-0068', 'Cheque de Terceros Depositado CH-T-0068', NULL, 6, 3),
    ('2026-09-06', 1, 1, 700000.00, NULL, 95951035.00, 'Cobranza de clientes', 'Ingreso', NULL, 1, 2),
    ('2026-09-06', 2, 13, NULL, 344838.00, 95606197.00, 'Cheque Propio N° CH-P-0070', 'Cheque Propio', NULL, 1, 2),
    ('2026-09-06', NULL, 1, 346838.00, NULL, 95606197.00, 'Cheque de Terceros N° CH-T-0070', 'Cheque de Terceros Endosado', 'Cheque Endosado', 1, 2),
    ('2026-09-06', NULL, 13, NULL, 346838.00, 95606197.00, 'Cheque de Terceros N° CH-T-0070', 'Cheque de Terceros Endosado', 'Cheque Endosado', 1, 2),
    ('2026-09-10', 3, 4, NULL, 322921.00, 95283276.00, 'Cheque Propio N° CH-P-0069', 'Cheque Propio', NULL, 8, 3),
    ('2026-09-10', 3, 1, 324921.00, NULL, 95608197.00, 'Cheque de Terceros N° CH-T-0069', 'Cheque de Terceros Depositado CH-T-0069', NULL, 8, 3),
    ('2026-09-12', 2, 8, NULL, 80000.00, 95528197.00, 'Pago de préstamo', 'Egreso', NULL, 1, 2),
    ('2026-09-16', 2, 2, NULL, 235253.00, 95292944.00, 'Cheque Propio N° CH-P-0065', 'Cheque Propio', NULL, 11, 3),
    ('2026-09-16', NULL, 1, 237253.00, NULL, 95292944.00, 'Cheque de Terceros N° CH-T-0065', 'Cheque de Terceros Endosado', 'Cheque Endosado', 11, 3),
    ('2026-09-16', NULL, 4, NULL, 237253.00, 95292944.00, 'Cheque de Terceros N° CH-T-0065', 'Cheque de Terceros Endosado', 'Cheque Endosado', 11, 3),
    ('2026-09-17', 3, 10, 250000.00, NULL, 95542944.00, 'Intereses cobrados', 'Ingreso', NULL, 1, 2),
    ('2026-09-18', 3, 13, NULL, 279087.00, 95263857.00, 'Cheque Propio N° CH-P-0067', 'Cheque Propio', NULL, 4, 4),
    ('2026-09-18', 3, 1, 281087.00, NULL, 95544944.00, 'Cheque de Terceros N° CH-T-0067', 'Cheque de Terceros Depositado CH-T-0067', NULL, 4, 4),
    ('2026-09-21', 1, 3, NULL, 150000.00, 95394944.00, 'Sueldos y cargas sociales', 'Egreso', NULL, 1, 2),
    ('2026-09-21', 3, 13, NULL, 147585.00, 95247359.00, 'Cheque Propio N° CH-P-0061', 'Cheque Propio', NULL, 3, 5),
    ('2026-09-21', 3, 1, 149585.00, NULL, 95396944.00, 'Cheque de Terceros N° CH-T-0061', 'Cheque de Terceros Depositado CH-T-0061', NULL, 3, 5),
    ('2026-09-22', 3, 4, NULL, 257170.00, 95139774.00, 'Cheque Propio N° CH-P-0066', 'Cheque Propio', NULL, 2, 3),
    ('2026-09-22', 2, 1, 259170.00, NULL, 95398944.00, 'Cheque de Terceros N° CH-T-0066', 'Cheque de Terceros Depositado CH-T-0066', NULL, 2, 3),
    ('2026-09-24', 3, 4, NULL, 125668.00, 95273276.00, 'Cheque Propio N° CH-P-0060', 'Cheque Propio', NULL, 1, 2),
    ('2026-09-24', NULL, 1, 127668.00, NULL, 95273276.00, 'Cheque de Terceros N° CH-T-0060', 'Cheque de Terceros Endosado', 'Cheque Endosado', 1, 2),
    ('2026-09-24', NULL, 2, NULL, 127668.00, 95273276.00, 'Cheque de Terceros N° CH-T-0060', 'Cheque de Terceros Endosado', 'Cheque Endosado', 1, 2),
    ('2026-09-25', 2, 6, NULL, 110000.00, 95163276.00, 'Pago de impuestos', 'Egreso', NULL, 1, 2),
    ('2026-09-27', 2, 2, NULL, 103751.00, 95059525.00, 'Cheque Propio N° CH-P-0059', 'Cheque Propio', NULL, 1, 2),
    ('2026-09-27', 3, 1, 105751.00, NULL, 95165276.00, 'Cheque de Terceros N° CH-T-0059', 'Cheque de Terceros Depositado CH-T-0059', NULL, 1, 2),
    ('2026-09-28', 3, 10, 800000.00, NULL, 95965276.00, 'Intereses cobrados', 'Ingreso', NULL, 1, 2),
    ('2026-09-28', 2, 2, NULL, 169502.00, 95795774.00, 'Cheque Propio N° CH-P-0062', 'Cheque Propio', NULL, 5, 3),
    ('2026-09-28', 2, 1, 171502.00, NULL, 95967276.00, 'Cheque de Terceros N° CH-T-0062', 'Cheque de Terceros Depositado CH-T-0062', NULL, 5, 3),
    ('2026-09-30', 2, 13, NULL, 81834.00, 95885442.00, 'Cheque Propio N° CH-P-0058', 'Cheque Propio', NULL, 8, 3),
    ('2026-09-30', 2, 13, NULL, 213336.00, 95672106.00, 'Cheque Propio N° CH-P-0064', 'Cheque Propio', NULL, 1, 2),
    ('2026-09-30', 2, 1, 83834.00, NULL, 95755940.00, 'Cheque de Terceros N° CH-T-0058', 'Cheque de Terceros Depositado CH-T-0058', NULL, 8, 3),
    ('2026-09-30', 2, 1, 215336.00, NULL, 95971276.00, 'Cheque de Terceros N° CH-T-0064', 'Cheque de Terceros Depositado CH-T-0064', NULL, 1, 2),
    ('2026-10-01', 1, NULL, 5395000.00, NULL, 5395000.00, 'Saldo inicial del mes', NULL, NULL, NULL, NULL),
    ('2026-10-01', 2, NULL, 57902727.00, NULL, 63297727.00, 'Saldo inicial del mes', NULL, NULL, NULL, NULL),
    ('2026-10-01', 3, NULL, 32673549.00, NULL, 95971276.00, 'Saldo inicial del mes', NULL, NULL, NULL, NULL),
    ('2026-10-03', 1, 7, 350000.00, NULL, 96321276.00, 'Préstamo recibido', 'Ingreso', NULL, 1, 2),
    ('2026-10-03', 3, 4, NULL, 59917.00, 96261359.00, 'Cheque Propio N° CH-P-0057', 'Cheque Propio', NULL, 6, 3),
    ('2026-10-03', 3, 1, 61917.00, NULL, 96323276.00, 'Cheque de Terceros N° CH-T-0057', 'Cheque de Terceros Depositado CH-T-0057', NULL, 6, 3),
    ('2026-10-04', 1, 15, NULL, 3580000.00, 92743276.00, 'Compra de rodados', 'Egreso', NULL, 1, 2),
    ('2026-10-04', 3, 4, NULL, 191419.00, 92551857.00, 'Cheque Propio N° CH-P-0063', 'Cheque Propio', NULL, 7, 3),
    ('2026-10-04', 3, 1, 193419.00, NULL, 92745276.00, 'Cheque de Terceros N° CH-T-0063', 'Cheque de Terceros Depositado CH-T-0063', NULL, 7, 3),
    ('2026-10-05', 2, 8, NULL, 2665231.14, 90080044.86, 'Pago de préstamo', 'Egreso', NULL, 1, 2),
    ('2026-10-06', 3, 13, NULL, 3409609.68, 86670435.18, 'Compra de bienes de uso', 'Egreso', NULL, 1, 2),
    ('2026-10-06', 2, 2, NULL, 38000.00, 86632435.18, 'Cheque Propio N° CH-P-0056', 'Cheque Propio', NULL, 4, 4),
    ('2026-10-06', 2, 1, 40000.00, NULL, 86672435.18, 'Cheque de Terceros N° CH-T-0056', 'Cheque de Terceros Depositado CH-T-0056', NULL, 4, 4),
    ('2026-10-07', 2, 4, NULL, 80000.00, 86592435.18, 'Gastos generales', 'Egreso', NULL, 1, 2);