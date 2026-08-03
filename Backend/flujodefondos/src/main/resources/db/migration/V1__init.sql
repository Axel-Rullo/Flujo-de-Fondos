-- Volcando estructura para tabla clientes_proveedores
CREATE TABLE IF NOT EXISTS clientes_proveedores (
  id_cliente_proveedor INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  dni_cuit TEXT,
  telefono TEXT,
  email TEXT,
  tipo TEXT
);

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
	(8, 'Otaku'),
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
	(2, 'mario_saluzzo', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 23425252, 'Mario Saluzzo', 'mario@mail.com', '3415789473', 'Admin', 3, NULL, 'E'),
	(3, 'matias_rivadeneira', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 54839604, 'Matías Rivadeneira', 'matias@gmail.com', '38259374823', 'Miembro', 5, NULL, 'E'),
	(4, 'facundo_sangiacomo', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 45123891, 'Facundo Sangiacomo', 'facundo@gmail.com', '3415123456', 'Miembro', 4, NULL, 'E'),
	(5, 'lucas_albarracin', '$argon2id$v=19$m=20000,t=2,p=1$V7UBBmVUGb/n37EOLDxSTg$NXQNgsSTbMxr1hajs66GKr8fJhlr3VhNNYyFdKI2Hgk', 46234782, 'Lucas Albarracin', 'lucas@gmail.com', '348295824', 'Miembro', 8, '/api/uploads/profiles/Loli.jpg', 'E'),
	(6, 'juan_bernal', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 47345673, 'Juan Cruz Bernal', 'juan@gmail.com', '3417345678', 'Miembro', 3, NULL, 'E'),
	(7, 'martin_menna', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 48456764, 'Martín Menna Castells', 'martin@gmail.com', '3418456789', 'Miembro', 3, NULL, 'E'),
	(8, 'fran_pilot', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 49567855, 'Francisco Pilot', 'fran@gmail.com', '3419567890', 'Miembro', 3, NULL, 'E'),
	(9, 'bruno_duarte', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 50678946, 'Bruno Duarte', 'bruno@gmail.com', '3421678901', 'Miembro', 4, NULL, 'N'),
	(10, 'lean_mignacco', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 51789037, 'Leandro Mignacco', 'lean@gmail.com', '3422789012', 'Miembro', 3, NULL, 'N'),
	(11, 'axel_rullo', '$argon2id$v=19$m=20000,t=2,p=1$Qw3XDzDjMhGDveEyFdActQ$3kUA1jNUVovHUpcW/RFviFkUpXlgMqA/JYCfzwTvBbE', 46996007, 'Axel Rullo', 'axelrullo17@gmail.com', '3417236528', 'Admin', 2, '/api/uploads/profiles/axel.jpg', 'E');

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
  fecha_cobro DATE,
  fecha_entrega DATE,
  estado TEXT,
  observacion TEXT,
  uso TEXT,
  id_titular INTEGER,
  id_cuenta_salida INTEGER,
  FOREIGN KEY (id_cuenta_salida) REFERENCES cuentas (id_cuenta),
  FOREIGN KEY (id_titular) REFERENCES clientes_proveedores (id_cliente_proveedor)
);

-- Volcando estructura para tabla cheques_terceros
CREATE TABLE IF NOT EXISTS cheques_terceros (
  id_cheque INTEGER PRIMARY KEY AUTOINCREMENT,
  numero_ch TEXT NOT NULL,
  importe DECIMAL(15,2) NOT NULL,
  fecha_cobro DATE,
  estado TEXT,
  observacion TEXT,
  uso TEXT,
  id_titular INTEGER,
  id_titular_destino INTEGER,
  id_cuenta_entrada INTEGER,
  id_cuenta_salida INTEGER,
  FOREIGN KEY (id_cuenta_entrada) REFERENCES cuentas (id_cuenta),
  FOREIGN KEY (id_cuenta_salida) REFERENCES cuentas (id_cuenta),
  FOREIGN KEY (id_titular) REFERENCES clientes_proveedores (id_cliente_proveedor),
  FOREIGN KEY (id_titular_destino) REFERENCES clientes_proveedores (id_cliente_proveedor)
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