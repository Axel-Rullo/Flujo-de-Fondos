package com.axel.flujodefondos.repositories;

import com.axel.flujodefondos.entities.Cheque;
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

    private final RowMapper<Cheque> chequeMapper = (rs, rowNum) -> new Cheque(
        rs.getLong("id_cheque"),
        rs.getString("clase"),
        rs.getString("clasificacion"),
        rs.getString("numero"),
        rs.getString("banco"),
        rs.getBigDecimal("importe"),
        rs.getString("tipo"),
        rs.getString("fecha_entrega"),
        rs.getString("fecha_cobro"),
        rs.getString("fecha_destino"),
        rs.getString("estado"),
        rs.getString("observacion"),
        rs.getString("uso"),
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        rs.getString("titular"),
        rs.getString("titular_destino"),
        rs.getString("cuenta_entrada"),
        rs.getString("cuenta_salida"),
        rs.getString("concepto_entrada"),
        rs.getString("concepto_salida"),
        rs.getString("usuario"),
        rs.getString("cuenta_banco")
    );

    // ── LISTADO ───────────────────────────────────────────────────────

public List<Cheque> findAllPropios() {
    return jdbcTemplate.query(
        "SELECT ch.id_cheque, ch.clase, ch.clasificacion, ch.numero, b.nombre AS banco, ch.importe, ch.tipo, " +
        "ch.fecha_entrega, ch.fecha_cobro, ch.fecha_destino, ch.estado, ch.observacion, ch.uso, " +
        "cp.nombre AS titular, cpd.nombre AS titular_destino, " +
        "ce.nombre AS cuenta_entrada, cs.nombre AS cuenta_salida, " +
        "cce.concepto AS concepto_entrada, ccs.concepto AS concepto_salida, u.nombre AS usuario, " +
        "cb.nombre AS cuenta_banco " +
        "FROM cheques ch " +

            // Titular
            "LEFT JOIN clientes_proveedores cp ON ch.id_titular = cp.id_clipro " +

            // Titular destino
            "LEFT JOIN clientes_proveedores cpd ON ch.id_titular_destino = cpd.id_clipro " +

            // Cuenta de entrada
            "LEFT JOIN cuentas ce ON ch.id_cuenta_entrada = ce.id_cuenta " +

            // Cuenta de salida
            "LEFT JOIN cuentas cs ON ch.id_cuenta_salida = cs.id_cuenta " +

            // Cuenta bancaria propia
            "LEFT JOIN cuentas cb ON ch.id_cuenta_banco = cb.id_cuenta " +

            // Concepto de entrada
            "LEFT JOIN conceptos cce ON ch.id_concepto_entrada = cce.id_concepto " +

            // Concepto de salida
            "LEFT JOIN conceptos ccs ON ch.id_concepto_salida = ccs.id_concepto " +

            // Banco del cheque
            "LEFT JOIN bancos b ON ch.id_banco = b.id_banco " +

            // Usuario que registró el cheque
            "LEFT JOIN usuarios u ON ch.id_usuario = u.id_usuario " +

            "WHERE ch.clasificacion = 'E'",
            chequeMapper
        );
    }


    public List<Cheque> findAllTerceros() {
        return jdbcTemplate.query(
            "SELECT ch.id_cheque, ch.clase, ch.clasificacion, ch.numero, b.nombre AS banco, ch.importe, ch.tipo, " +
            "ch.fecha_entrega, ch.fecha_cobro, ch.fecha_destino, ch.estado, ch.observacion, ch.uso, " +
            "cp.nombre AS titular, cpd.nombre AS titular_destino, " +
            "ce.nombre AS cuenta_entrada, cs.nombre AS cuenta_salida, " +
            "cce.concepto AS concepto_entrada, ccs.concepto AS concepto_salida, u.nombre AS usuario, " +
            "cb.nombre AS cuenta_banco " +
            "FROM cheques ch " +

            // Titular del cheque
            "LEFT JOIN clientes_proveedores cp ON ch.id_titular = cp.id_clipro " +

            // Titular destino del cheque
            "LEFT JOIN clientes_proveedores cpd ON ch.id_titular_destino = cpd.id_clipro " +

            // Cuenta de entrada
            "LEFT JOIN cuentas ce ON ch.id_cuenta_entrada = ce.id_cuenta " +

            // Cuenta de salida
            "LEFT JOIN cuentas cs ON ch.id_cuenta_salida = cs.id_cuenta " +

            // Cuenta bancaria propia
            "LEFT JOIN cuentas cb ON ch.id_cuenta_banco = cb.id_cuenta " +

            // Concepto de entrada
            "LEFT JOIN conceptos cce ON ch.id_concepto_entrada = cce.id_concepto " +

            // Concepto de salida
            "LEFT JOIN conceptos ccs ON ch.id_concepto_salida = ccs.id_concepto " +

            // Banco del cheque
            "LEFT JOIN bancos b ON ch.id_banco = b.id_banco " +

            // Usuario que registró el cheque
            "LEFT JOIN usuarios u ON ch.id_usuario = u.id_usuario " +

            "WHERE ch.clasificacion = 'A'",
            chequeMapper
        );
    }

    // ── ALTA ─────────────────────────────────────────────────────────

    public void insertChequePropio(Cheque cheque) {
        jdbcTemplate.update(
            "INSERT INTO cheques (clase, clasificacion, numero, importe, tipo, fecha_entrega, fecha_cobro, estado, observacion, id_titular, id_cuenta_banco, id_concepto_salida, id_usuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            cheque.getClase(), cheque.getClasificacion(), cheque.getNumero(), cheque.getImporte(), cheque.getTipo(), cheque.getFecha_entrega(),
            cheque.getFecha_cobro(), cheque.getEstado(), cheque.getObservacion(),
            cheque.getId_titular(), cheque.getId_cuenta_banco(), cheque.getId_concepto_salida(), cheque.getId_usuario()
        );
    }

    public void insertChequeTercero(Cheque cheque) {
        jdbcTemplate.update(
            "INSERT INTO cheques (clase, clasificacion, numero, id_banco, importe, tipo, fecha_entrega, fecha_cobro, estado, observacion, id_titular, id_concepto_entrada, id_usuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            cheque.getClase(), cheque.getClasificacion(), cheque.getNumero(), cheque.getId_banco(), cheque.getImporte(), cheque.getTipo(), cheque.getFecha_entrega(),
            cheque.getFecha_cobro(), cheque.getEstado(), cheque.getObservacion(),
            cheque.getId_titular(), cheque.getId_concepto_entrada(), cheque.getId_usuario()
        );
    }

    // ── IMPUTACIÓN ───────────────────────────────────────────────────

    public void imputarChequePropio(Cheque cheque) {
        jdbcTemplate.update(
            "UPDATE cheques SET fecha_destino = ? WHERE id_cheque = ?",
            cheque.getFecha_destino(), cheque.getId_cheque()
        );
    }

    public void imputarChequeTercero(Cheque cheque) {
        String clasificacion = "Endoso".equals(cheque.getUso()) ? "Emitido" : "A Cobrar";

        jdbcTemplate.update(
            "UPDATE cheques SET uso = ?, fecha_destino = ?, id_cuenta_entrada = ?, id_titular_destino = ?, id_cuenta_salida = ?, clasificacion = ? WHERE id_cheque = ?",
            cheque.getUso(), cheque.getFecha_destino(), cheque.getId_cuenta_entrada(),
            cheque.getId_titular_destino(), cheque.getId_cuenta_salida(), clasificacion, cheque.getId_cheque()
        );
    }
}