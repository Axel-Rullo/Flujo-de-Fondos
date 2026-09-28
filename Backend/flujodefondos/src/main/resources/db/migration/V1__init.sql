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
    nombre TEXT NOT NULL,
    saldo DECIMAL(15,2),
    id_banco INTEGER,
    FOREIGN KEY (id_banco) REFERENCES bancos (id_banco)
);

INSERT INTO cuentas (id_cuenta, nombre, saldo, id_banco) VALUES
	(1, 'Caja Casa Central', 1024000, null),
	(2, 'Banco Principal', 3860000, 6),
	(3, 'Banco Secundario', 560000, 3);

-- Volcando estructura para tabla bancos (limitado a 6 bancos)
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
	(6, 'Banco BBVA');

-- Volcando estructura para tabla bancos_clientprov (asocia cliente/proveedor <-> banco + alias)
CREATE TABLE IF NOT EXISTS bancos_clientprov (
  id_banco_clipro INTEGER PRIMARY KEY AUTOINCREMENT,
  id_clipro INTEGER NOT NULL,
  id_banco INTEGER NOT NULL,
  alias TEXT,
  FOREIGN KEY (id_clipro) REFERENCES clientes_proveedores (id_clipro),
  FOREIGN KEY (id_banco) REFERENCES bancos (id_banco)
);

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

-- Volcando estructura para tabla conceptos (recodificados 1.01, 1.02, 2.01... 15 conceptos)
CREATE TABLE IF NOT EXISTS conceptos (
  id_concepto INTEGER PRIMARY KEY AUTOINCREMENT,
  cod_concepto TEXT NOT NULL,
  concepto TEXT NOT NULL,
  clasificacion INTEGER
);

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

CREATE TABLE IF NOT EXISTS cheques (
    id_cheque INTEGER PRIMARY KEY AUTOINCREMENT,
    clase TEXT NOT NULL,              -- 'Propio' | 'Tercero'
    clasificacion TEXT NOT NULL,      -- 'Emitido' | 'A Cobrar'
    numero TEXT NOT NULL,
    importe DECIMAL(15,2) NOT NULL,
    tipo TEXT NOT NULL,               -- 'Corriente' | 'Diferido'
    fecha_emision DATE NOT NULL,
    fecha_pago DATE NOT NULL,
    fecha_destino DATE,
    estado TEXT NOT NULL,
    observacion TEXT,
    motivo TEXT,
    uso TEXT,                         -- 'Deposito' | 'Endoso', solo aplica a terceros
    id_clipro_emision INTEGER NOT NULL,        -- alta: emisor (terceros) o destino (propios)
    id_clipro_imputar INTEGER,        -- imputación: a quién se endosa (terceros)
    id_cuenta_propia_emision INTEGER, -- alta propios: cuenta propia
    id_banco_emision INTEGER,         -- alta terceros: banco ajeno
    id_concepto_emision INTEGER NOT NULL,      -- alta terceros: Cuenta Entrada / alta propios: Cuenta Salida
    id_cuenta_propia_imputar INTEGER, -- imputación (real): depósito
    id_concepto_imputar INTEGER,      -- imputación (real): endoso
    id_usuario INTEGER NOT NULL,      -- usuario que carga el cheque
    FOREIGN KEY (id_clipro_emision) REFERENCES clientes_proveedores (id_clipro),
    FOREIGN KEY (id_clipro_imputar) REFERENCES clientes_proveedores (id_clipro),
    FOREIGN KEY (id_cuenta_propia_emision) REFERENCES cuentas (id_cuenta),
    FOREIGN KEY (id_banco_emision) REFERENCES bancos (id_banco),
    FOREIGN KEY (id_concepto_emision) REFERENCES conceptos (id_concepto),
    FOREIGN KEY (id_cuenta_propia_imputar) REFERENCES cuentas (id_cuenta),
    FOREIGN KEY (id_concepto_imputar) REFERENCES conceptos (id_concepto),
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario)
);

INSERT INTO cheques (clase, clasificacion, numero, importe, tipo, fecha_emision, fecha_pago, fecha_destino, estado, observacion, motivo, uso, id_clipro_emision, id_clipro_imputar, id_cuenta_propia_emision, id_banco_emision, id_concepto_emision, id_cuenta_propia_imputar, id_concepto_imputar, id_usuario) VALUES
    -- ==== Propios (P) / Emitidos, estado Pendiente (P) ====
    ('P', 'E', 'CH-P-0001', 184500.00, 'C', '2026-09-19', '2026-09-19', NULL, 'P', 'Pago de mercadería', NULL, NULL, 3, NULL, 2, NULL, 2, NULL, NULL, 1),
    ('P', 'E', 'CH-P-0002', 96800.00, 'C', '2026-09-20', '2026-09-20', NULL, 'P', 'Pago de combustible', NULL, NULL, 18, NULL, 2, NULL, 4, NULL, NULL, 2),
    ('P', 'E', 'CH-P-0003', 320000.00, 'D', '2026-09-20', '2026-10-20', NULL, 'P', 'Pago diferido a 30 días', NULL, NULL, 6, NULL, 3, NULL, 2, NULL, NULL, 3),
    ('P', 'E', 'CH-P-0004', 275000.00, 'D', '2026-09-19', '2026-11-18', NULL, 'P', 'Pago diferido a 60 días', NULL, NULL, 12, NULL, 3, NULL, 2, NULL, NULL, 4),
    ('P', 'E', 'CH-P-0005', 210000.00, 'D', '2026-08-26', '2026-09-25', NULL, 'P', 'Vence el viernes', NULL, NULL, 16, NULL, 2, NULL, 13, NULL, NULL, 5),

    -- ==== Propios (P) / Emitidos, estado Cobrado (C) ====
    ('P', 'E', 'CH-P-0006', 58000.00, 'C', '2026-08-31', '2026-08-31', '2026-09-02', 'C', 'Cobrado por el proveedor', NULL, NULL, 8, NULL, 2, NULL, 4, NULL, NULL, 6),
    ('P', 'E', 'CH-P-0007', 72500.00, 'C', '2026-09-08', '2026-09-08', '2026-09-09', 'C', 'Cobrado por el proveedor', NULL, NULL, 20, NULL, 3, NULL, 2, NULL, NULL, 7),
    ('P', 'E', 'CH-P-0008', 150000.00, 'D', '2026-07-27', '2026-08-26', '2026-08-27', 'C', 'Diferido cobrado un día después del vencimiento', NULL, NULL, 4, NULL, 2, NULL, 2, NULL, NULL, 8),
    ('P', 'E', 'CH-P-0009', 240000.00, 'D', '2026-08-12', '2026-09-11', '2026-09-14', 'C', 'Diferido cobrado el lunes siguiente', NULL, NULL, 24, NULL, 3, NULL, 2, NULL, NULL, 1),

    -- ==== Propios (P) / Emitidos, estado Rechazado (R) ====
    ('P', 'E', 'CH-P-0010', 135000.00, 'D', '2026-07-20', '2026-08-19', '2026-08-20', 'R', 'Rechazado por el banco', 'Fondos insuficientes en la cuenta', NULL, 28, NULL, 3, NULL, 2, NULL, NULL, 2),
    ('P', 'E', 'CH-P-0011', 88000.00, 'C', '2026-09-01', '2026-09-01', '2026-09-03', 'R', 'Rechazado por el banco', 'Firma no coincide con la registrada', NULL, 10, NULL, 2, NULL, 2, NULL, NULL, 3),
    ('P', 'E', 'CH-P-0012', 165000.00, 'D', '2026-08-03', '2026-09-02', '2026-09-04', 'R', 'Rechazado por el banco', 'Importe en letras no coincide con el numérico', NULL, 26, NULL, 2, NULL, 2, NULL, NULL, 4),

    -- ==== Propios (P) / Emitidos, estado Anulado (A) ====
    ('P', 'E', 'CH-P-0013', 49000.00, 'C', '2026-09-14', '2026-09-14', '2026-09-15', 'A', 'Anulado antes de entregarlo', 'Error en el importe al emitir, se reemplaza por otro cheque', NULL, 30, NULL, 3, NULL, 2, NULL, NULL, 5),

    -- ==== Terceros (T) / A Cobrar, estado Pendiente (P) ====
    ('T', 'A', 'CH-T-0001', 62000.00, 'C', '2026-09-19', '2026-09-19', NULL, 'P', 'Cobranza de venta', NULL, NULL, 1, NULL, NULL, 1, 1, NULL, NULL, 1),
    ('T', 'A', 'CH-T-0002', 118000.00, 'C', '2026-09-20', '2026-09-20', NULL, 'P', 'Cobranza de venta', NULL, NULL, 11, NULL, NULL, 4, 1, NULL, NULL, 2),
    ('T', 'A', 'CH-T-0003', 225000.00, 'D', '2026-09-20', '2026-10-20', NULL, 'P', 'Cheque diferido a 30 días', NULL, NULL, 2, NULL, NULL, 2, 1, NULL, NULL, 3),
    ('T', 'A', 'CH-T-0004', 190000.00, 'D', '2026-09-19', '2026-11-18', NULL, 'P', 'Cheque diferido a 60 días', NULL, NULL, 15, NULL, NULL, 5, 1, NULL, NULL, 4),
    ('T', 'A', 'CH-T-0005', 145000.00, 'D', '2026-08-26', '2026-09-25', NULL, 'P', 'Vence el viernes', NULL, NULL, 13, NULL, NULL, 1, 1, NULL, NULL, 5),

    -- ==== Terceros (T) / A Cobrar, estado Cobrado (C) ====
    ('T', 'A', 'CH-T-0006', 54000.00, 'C', '2026-09-01', '2026-09-01', '2026-09-02', 'C', 'Depositado en cuenta', NULL, 'D', 7, NULL, NULL, 2, 1, 2, NULL, 6),
    ('T', 'A', 'CH-T-0007', 210000.00, 'D', '2026-07-29', '2026-08-28', '2026-08-31', 'C', 'Depositado el lunes siguiente al vencimiento', NULL, 'D', 17, NULL, NULL, 1, 1, 3, NULL, 7),
    ('T', 'A', 'CH-T-0008', 83000.00, 'C', '2026-09-10', '2026-09-10', '2026-09-11', 'C', 'Endosado a proveedor', NULL, 'E', 21, 6, NULL, 1, 1, NULL, 2, 8),
    ('T', 'A', 'CH-T-0009', 176000.00, 'D', '2026-08-05', '2026-09-04', '2026-09-04', 'C', 'Endosado a proveedor', NULL, 'E', 23, 12, NULL, 3, 1, NULL, 2, 1),

    -- ==== Terceros (T) / A Cobrar, estado Rechazado (R) ====
    ('T', 'A', 'CH-T-0010', 132000.00, 'D', '2026-07-22', '2026-08-21', '2026-08-24', 'R', 'Rechazado por el banco librador', 'Fondos insuficientes', NULL, 25, NULL, NULL, 1, 1, NULL, NULL, 2),
    ('T', 'A', 'CH-T-0011', 67000.00, 'C', '2026-09-03', '2026-09-03', '2026-09-08', 'R', 'Rechazado por el banco librador', 'Cuenta cerrada del librador', NULL, 29, NULL, NULL, 1, 1, NULL, NULL, 3),
    ('T', 'A', 'CH-T-0012', 198000.00, 'D', '2026-08-10', '2026-09-09', '2026-09-11', 'R', 'Rechazado por el banco librador', 'Defecto formal: enmienda sin salvar en la fecha de pago', NULL, 5, NULL, NULL, 1, 1, NULL, NULL, 4),

    -- ==== Terceros (T) / A Cobrar, estado Anulado (A) ====
    ('T', 'A', 'CH-T-0013', 91000.00, 'C', '2026-09-15', '2026-09-15', '2026-09-16', 'A', 'Anulado, cargado por error', 'El cliente entregó el cheque por otro importe', NULL, 11, NULL, NULL, 4, 1, NULL, NULL, 5);

CREATE TABLE IF NOT EXISTS movimientos (
    id_movimiento INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha DATE,
    id_cuenta INTEGER,
    id_concepto INTEGER,
    ingreso DECIMAL(15,2),
    egreso DECIMAL(15,2),
    saldo DECIMAL(15,2),
    observaciones TEXT,
    ch_endosado BOOLEAN NOT NULL DEFAULT FALSE,
    id_usuario INTEGER,
    id_sucursal INTEGER,
    FOREIGN KEY (id_cuenta) REFERENCES cuentas (id_cuenta),
    FOREIGN KEY (id_concepto) REFERENCES conceptos (id_concepto),
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario),
    FOREIGN KEY (id_sucursal) REFERENCES sucursales (id_sucursal),
    CHECK (
        (ch_endosado = FALSE AND id_cuenta IS NOT NULL) OR
        (ch_endosado = TRUE  AND id_cuenta IS NULL)
    )
);