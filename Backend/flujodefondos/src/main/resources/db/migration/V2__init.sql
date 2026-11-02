ALTER TABLE clientes_proveedores RENAME COLUMN nombre TO razon_social;

-- ---------------------------------------------------------------------
-- UPDATE usuarios (nombre -> apellido nombre)
-- ---------------------------------------------------------------------
UPDATE usuarios SET nombre = 'Rullo Axel' WHERE id_usuario = 1;
UPDATE usuarios SET nombre = 'Saluzzo Mario' WHERE id_usuario = 2;
UPDATE usuarios SET nombre = 'Rivadeneira Matías' WHERE id_usuario = 3;
UPDATE usuarios SET nombre = 'Sangiacomo Facundo' WHERE id_usuario = 4;
UPDATE usuarios SET nombre = 'Albarracin Lucas' WHERE id_usuario = 5;
UPDATE usuarios SET nombre = 'Bernal Juan Cruz' WHERE id_usuario = 6;
UPDATE usuarios SET nombre = 'Menna Castells Martín' WHERE id_usuario = 7;
UPDATE usuarios SET nombre = 'Pilot Francisco' WHERE id_usuario = 8;
UPDATE usuarios SET nombre = 'Duarte Bruno' WHERE id_usuario = 9;
UPDATE usuarios SET nombre = 'Mignacco Leandro' WHERE id_usuario = 10;
UPDATE usuarios SET nombre = 'Baró Marcos' WHERE id_usuario = 11;
UPDATE usuarios SET nombre = 'Torresi Profesor' WHERE id_usuario = 12;
UPDATE usuarios SET nombre = 'Torresi Alumno' WHERE id_usuario = 13;
