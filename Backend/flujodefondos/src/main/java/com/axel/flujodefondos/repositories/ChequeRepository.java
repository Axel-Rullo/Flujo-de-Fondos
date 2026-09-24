package com.axel.flujodefondos.repositories;

import com.axel.flujodefondos.entities.Cheque;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@SuppressWarnings("null")
@Repository
public class ChequeRepository {

    private final JdbcTemplate jdbcTemplate;

    public ChequeRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // ── MAPPERS ──────────────────────────────────────────────────────

    private final RowMapper<Cheque> chequeMapper = new BeanPropertyRowMapper<>(Cheque.class);

    // ── LISTADO ───────────────────────────────────────────────────────

    public List<Cheque> findAllPropios(String estado) {
        return jdbcTemplate.query(
            "SELECT ch.id_cheque, ch.numero, ch.importe, ch.tipo, ch.fecha_pago, ch.estado, " +
            "cp.nombre AS clipro_emision, cb.nombre AS cuenta_propia_emision " +
            "FROM cheques ch " +

            // Titular en emisión
            "LEFT JOIN clientes_proveedores cp ON ch.id_clipro_emision = cp.id_clipro " +

            // Cuenta propia en emisión
            "LEFT JOIN cuentas cb ON ch.id_cuenta_propia_emision = cb.id_cuenta " +

            "WHERE ch.clase = 'P' AND ch.estado = ?",
            chequeMapper,
            estado
        );
    }

    public List<Cheque> findAllTerceros(String estado) {
        return jdbcTemplate.query(
            "SELECT ch.id_cheque, ch.numero, ch.importe, ch.tipo, ch.fecha_pago, ch.fecha_destino, ch.estado, ch.uso, " +
            "cp.nombre AS clipro_emision, cpd.nombre AS clipro_imputar, ce.nombre AS cuenta_propia_imputar, b.nombre AS banco_emision " +
            "FROM cheques ch " +

            // Titular en emisión
            "LEFT JOIN clientes_proveedores cp ON ch.id_clipro_emision = cp.id_clipro " +

            // Titular en imputación
            "LEFT JOIN clientes_proveedores cpd ON ch.id_clipro_imputar = cpd.id_clipro " +

            // Cuenta propia en imputación (depósito)
            "LEFT JOIN cuentas ce ON ch.id_cuenta_propia_imputar = ce.id_cuenta " +

            // Banco del cheque
            "LEFT JOIN bancos b ON ch.id_banco_emision = b.id_banco " +

            "WHERE ch.clase = 'T' AND ch.estado = ?",
            chequeMapper,
            estado
        );
    }

    // ── HISTORIAL ────────────────────────────────────────────────────

    public List<Cheque> findAllBajasPropios(String estado) {
        return jdbcTemplate.query(
            "SELECT ch.id_cheque, ch.numero, ch.importe, ch.fecha_destino, ch.estado, ch.motivo, ch.clase, " +
            "cp.nombre AS clipro_emision, cb.nombre AS cuenta_propia_emision, u.nombre AS usuario " +
            "FROM cheques ch " +

            // Titular en emisión
            "LEFT JOIN clientes_proveedores cp ON ch.id_clipro_emision = cp.id_clipro " +

            // Cuenta propia en emisión
            "LEFT JOIN cuentas cb ON ch.id_cuenta_propia_emision = cb.id_cuenta " +

            // Usuario
            "LEFT JOIN usuarios u ON u.id_usuario = ch.id_usuario " +

            "WHERE ch.clase = 'P' AND ch.estado = ?",
            chequeMapper,
            estado
        );
    }

    public List<Cheque> findAllBajasTerceros(String estado) {
        return jdbcTemplate.query(
            "SELECT ch.id_cheque, ch.numero, ch.importe, ch.fecha_pago, ch.fecha_destino, ch.estado, ch.motivo, " +
            "cp.nombre AS clipro_emision, b.nombre AS banco_emision, u.nombre AS usuario, ch.clase " +
            "FROM cheques ch " +

            // Titular en emisión
            "LEFT JOIN clientes_proveedores cp ON ch.id_clipro_emision = cp.id_clipro " +

            // Banco del cheque
            "LEFT JOIN bancos b ON ch.id_banco_emision = b.id_banco " +

            // Usuario
            "LEFT JOIN usuarios u ON u.id_usuario = ch.id_usuario " +

            "WHERE ch.clase = 'T' AND ch.estado = ?",
            chequeMapper,
            estado
        );
    }

    // ── DETALLE ──────────────────────────────────────────────────────

    public Cheque findById(Long id) {
        return jdbcTemplate.queryForObject(
            "SELECT ch.id_cheque, ch.clase, ch.clasificacion, ch.numero, ch.importe, ch.tipo, " +
            "ch.fecha_emision, ch.fecha_pago, ch.fecha_destino, ch.estado, ch.observacion, ch.motivo, ch.uso, " +
            "cp.nombre AS clipro_emision, cpd.nombre AS clipro_imputar, b.nombre AS banco_emision, " +
            "cb.nombre AS cuenta_propia_emision, ce.nombre AS cuenta_propia_imputar, " +
            "cce.concepto AS concepto_emision, ccs.concepto AS concepto_imputar, u.nombre AS usuario " +
            "FROM cheques ch " +

            // Titular en emisión
            "LEFT JOIN clientes_proveedores cp ON ch.id_clipro_emision = cp.id_clipro " +

            // Titular en imputación
            "LEFT JOIN clientes_proveedores cpd ON ch.id_clipro_imputar = cpd.id_clipro " +

            // Cuenta propia en imputación (depósito)
            "LEFT JOIN cuentas ce ON ch.id_cuenta_propia_imputar = ce.id_cuenta " +

            // Cuenta propia en emisión
            "LEFT JOIN cuentas cb ON ch.id_cuenta_propia_emision = cb.id_cuenta " +

            // Concepto en emisión
            "LEFT JOIN conceptos cce ON ch.id_concepto_emision = cce.id_concepto " +

            // Concepto en imputación (endoso)
            "LEFT JOIN conceptos ccs ON ch.id_concepto_imputar = ccs.id_concepto " +

            // Banco del cheque
            "LEFT JOIN bancos b ON ch.id_banco_emision = b.id_banco " +

            // Usuario que registró el cheque
            "LEFT JOIN usuarios u ON ch.id_usuario = u.id_usuario " +

            "WHERE ch.id_cheque = ?",
            chequeMapper,
            id
        );
    }

    // ── ALTA ─────────────────────────────────────────────────────────

    public void insertChequePropio(Cheque cheque) {
        jdbcTemplate.update(
            "INSERT INTO cheques (clase, clasificacion, numero, importe, tipo, fecha_emision, fecha_pago, estado, observacion, id_clipro_emision, id_cuenta_propia_emision, id_concepto_emision, id_usuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            "P", "E", cheque.getNumero(), cheque.getImporte(), cheque.getTipo(), cheque.getFecha_emision(),
            cheque.getFecha_pago(), "P", cheque.getObservacion(), cheque.getId_clipro_emision(), 
            cheque.getId_cuenta_propia_emision(), cheque.getId_concepto_emision(), cheque.getId_usuario()
        );
    }

    public void insertChequeTercero(Cheque cheque) {
        jdbcTemplate.update(
            "INSERT INTO cheques (clase, clasificacion, numero, id_banco_emision, importe, tipo, fecha_emision, fecha_pago, estado, observacion, id_clipro_emision, id_concepto_emision, id_usuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            "T", "A", cheque.getNumero(), cheque.getId_banco_emision(), cheque.getImporte(), cheque.getTipo(), 
            cheque.getFecha_emision(), cheque.getFecha_pago(), "P", cheque.getObservacion(),
            cheque.getId_clipro_emision(), cheque.getId_concepto_emision(), cheque.getId_usuario()
        );
    }

    // ── IMPUTACIÓN ───────────────────────────────────────────────────

    public void imputarChequePropio(Cheque cheque) {
        jdbcTemplate.update(
            "UPDATE cheques SET fecha_destino = ?, estado = ? WHERE id_cheque = ?",
            cheque.getFecha_destino(), "C", cheque.getId_cheque()
        );
    }

    public void imputarChequeTercero(Cheque cheque) {
        jdbcTemplate.update(
            "UPDATE cheques SET estado = ?, uso = ?, fecha_destino = ?, id_cuenta_propia_imputar = ?, id_clipro_imputar = ?, id_concepto_imputar = ? WHERE id_cheque = ?",
            "C", cheque.getUso(), cheque.getFecha_destino(), cheque.getId_cuenta_propia_imputar(),
            cheque.getId_clipro_imputar(), cheque.getId_concepto_imputar(), cheque.getId_cheque()
        );
    }

    // ── RECHAZO ──────────────────────────────────────────────────────

    public void rechazarCheque(Cheque cheque) {
        jdbcTemplate.update(
            "UPDATE cheques SET estado = ?, motivo = ?, fecha_destino = ? WHERE id_cheque = ?",
            "R", cheque.getMotivo(), cheque.getFecha_destino(), cheque.getId_cheque()
        );
    }

    // ── ANULACION ────────────────────────────────────────────────────

    public void anularCheque(Cheque cheque) {
        jdbcTemplate.update(
            "UPDATE cheques SET estado = ?, motivo = ?, fecha_destino = ? WHERE id_cheque = ?",
            "A", cheque.getMotivo(), cheque.getFecha_destino(), cheque.getId_cheque()
        );
    }
}