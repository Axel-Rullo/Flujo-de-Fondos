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

-- Volcando estructura para tabla tipos
CREATE TABLE IF NOT EXISTS tipos (
  id_tipo INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL
);

INSERT INTO tipos (nombre) VALUES
	('Ingreso'),
	('Egreso'),
	('Transaccion');

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

    (1, 'axel_rullo', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 46996007, 'Axel Rullo', 'axelrullo17@gmail.com', '3417236528', 'Admin', 2, '/api/uploads/profiles/axel.jpg', 'E'),

    (2, 'mario_saluzzo', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 23425252, 'Mario Saluzzo', 'mario@mail.com', '3415789473', 'Admin', 3, NULL, 'E'),

    (3, 'matias_rivadeneira', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 54839604, 'Matías Rivadeneira', 'matias@gmail.com', '38259374823', 'Miembro', 5, NULL, 'E'),

    (4, 'facundo_sangiacomo', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 45123891, 'Facundo Sangiacomo', 'facundo@gmail.com', '3415123456', 'Miembro', 4, NULL, 'E'),

    (5, 'lucas_albarracin', '$argon2id$v=19$m=20000,t=2,p=1$V7UBBmVUGb/n37EOLDxSTg$NXQNgsSTbMxr1hajs66GKr8fJhlr3VhNNYyFdKI2Hgk', 46234782, 'Lucas Albarracin', 'lucas@gmail.com', '348295824', 'Miembro', 3, '/api/uploads/profiles/Loli.jpg', 'E'),

    (6, 'juan_bernal', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 47345673, 'Juan Cruz Bernal', 'juan@gmail.com', '3417345678', 'Miembro', 3, NULL, 'E'),

    (7, 'martin_menna', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 48456764, 'Martín Menna Castells', 'martin@gmail.com', '3418456789', 'Miembro', 3, NULL, 'E'),

    (8, 'fran_pilot', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 49567855, 'Francisco Pilot', 'fran@gmail.com', '3419567890', 'Miembro', 3, NULL, 'E'),

    (9, 'bruno_duarte', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 50678946, 'Bruno Duarte', 'bruno@gmail.com', '3421678901', 'Miembro', 4, NULL, 'N'),

    (10, 'lean_mignacco', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 51789037, 'Leandro Mignacco', 'lean@gmail.com', '3422789012', 'Miembro', 3, NULL, 'N'),

    (11, 'usuario1', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 52000001, 'Usuario 1', 'usuario1@mail.com', '3415600001', 'Miembro', 1, NULL, 'E'),

    (12, 'usuario2', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 52000002, 'Usuario 2', 'usuario2@mail.com', '3415600002', 'Miembro', 2, NULL, 'E'),

    (13, 'usuario3', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 52000003, 'Usuario 3', 'usuario3@mail.com', '3415600003', 'Miembro', 3, NULL, 'E'),

    (14, 'usuario4', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 52000004, 'Usuario 4', 'usuario4@mail.com', '3415600004', 'Miembro', 4, NULL, 'E'),

    (15, 'usuario5', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 52000005, 'Usuario 5', 'usuario5@mail.com', '3415600005', 'Admin', 5, NULL, 'E'),

    (16, 'usuario6', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 52000006, 'Usuario 6', 'usuario6@mail.com', '3415600006', 'Miembro', 8, NULL, 'E'),

    (17, 'usuario7', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 52000007, 'Usuario 7', 'usuario7@mail.com', '3415600007', 'Miembro', 9, NULL, 'E'),

    (18, 'usuario8', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 52000008, 'Usuario 8', 'usuario8@mail.com', '3415600008', 'Miembro', 1, NULL, 'E'),

    (19, 'usuario9', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 52000009, 'Usuario 9', 'usuario9@mail.com', '3415600009', 'Miembro', 2, NULL, 'E'),

    (20, 'usuario10', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 52000010, 'Usuario 10', 'usuario10@mail.com', '3415600010', 'Admin', 3, NULL, 'E'),

    (21, 'usuario11', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 52000011, 'Usuario 11', 'usuario11@mail.com', '3415600011', 'Miembro', 4, NULL, 'E'),

    (22, 'usuario12', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 52000012, 'Usuario 12', 'usuario12@mail.com', '3415600012', 'Miembro', 5, NULL, 'E'),

    (23, 'usuario13', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 52000013, 'Usuario 13', 'usuario13@mail.com', '3415600013', 'Miembro', 8, NULL, 'E'),

    (24, 'usuario14', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 52000014, 'Usuario 14', 'usuario14@mail.com', '3415600014', 'Miembro', 9, NULL, 'E'),

    (25, 'usuario15', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 52000015, 'Usuario 15', 'usuario15@mail.com', '3415600015', 'Miembro', 1, NULL, 'E'),

    (26, 'usuario16', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 52000016, 'Usuario 16', 'usuario16@mail.com', '3415600016', 'Miembro', 2, NULL, 'E'),

    (27, 'usuario17', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 52000017, 'Usuario 17', 'usuario17@mail.com', '3415600017', 'Miembro', 3, NULL, 'E'),

    (28, 'usuario18', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 52000018, 'Usuario 18', 'usuario18@mail.com', '3415600018', 'Miembro', 4, NULL, 'E'),

    (29, 'usuario19', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 52000019, 'Usuario 19', 'usuario19@mail.com', '3415600019', 'Miembro', 5, NULL, 'E'),

    (30, 'usuario20', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 52000020, 'Usuario 20', 'usuario20@mail.com', '3415600020', 'Miembro', 8, NULL, 'E');

-- Volcando estructura para tabla conceptos
CREATE TABLE IF NOT EXISTS conceptos (
  id_concepto INTEGER PRIMARY KEY AUTOINCREMENT,
  cod_concepto TEXT NOT NULL,
  concepto TEXT NOT NULL,
  id_tipo INTEGER,
  FOREIGN KEY (id_tipo) REFERENCES tipos (id_tipo)
);

-- Volcando estructura para tabla cheques_propios
CREATE TABLE IF NOT EXISTS cheques_propios (
  id_cheque INTEGER PRIMARY KEY AUTOINCREMENT,
  numero_ch TEXT NOT NULL,
  importe DECIMAL(15,2) NOT NULL,
  tipo_ch TEXT NOT NULL,
  fecha_entrega DATE,
  fecha_cobro DATE,
  estado TEXT,
  observacion TEXT,
  uso TEXT,
  id_titular INTEGER,
  id_cuenta_salida INTEGER,
  id_usuario INTEGER,
  FOREIGN KEY (id_cuenta_salida) REFERENCES cuentas (id_cuenta),
  FOREIGN KEY (id_titular) REFERENCES clientes_proveedores (id_clipro),
  FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario)
);

-- Volcando estructura para tabla cheques_terceros
CREATE TABLE IF NOT EXISTS cheques_terceros (
  id_cheque INTEGER PRIMARY KEY AUTOINCREMENT,
  numero_ch TEXT NOT NULL,
  importe DECIMAL(15,2) NOT NULL,
  tipo_ch TEXT NOT NULL,
  banco TEXT,
  fecha_entrega DATE,
  fecha_cobro DATE,
  fecha_destino DATE,
  estado TEXT,
  observacion TEXT,
  uso TEXT,
  id_titular INTEGER,
  id_titular_destino INTEGER,
  id_cuenta_entrada INTEGER,
  id_cuenta_salida INTEGER,
  id_usuario INTEGER,
  FOREIGN KEY (id_cuenta_entrada) REFERENCES cuentas (id_cuenta),
  FOREIGN KEY (id_cuenta_salida) REFERENCES cuentas (id_cuenta),
  FOREIGN KEY (id_titular) REFERENCES clientes_proveedores (id_clipro),
  FOREIGN KEY (id_titular_destino) REFERENCES clientes_proveedores (id_clipro),
  FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario)
);

-- Volcando estructura para tabla movimientos
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