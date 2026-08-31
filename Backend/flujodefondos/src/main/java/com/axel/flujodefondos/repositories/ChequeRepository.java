package com.axel.flujodefondos.repositories;

import com.axel.flujodefondos.entities.ChequePropio;
import com.axel.flujodefondos.entities.ChequeTercero;
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

    private final RowMapper<ChequePropio> chequePropioMapper = (rs, rowNum) -> new ChequePropio(
    rs.getLong("id_cheque"),
    rs.getString("numero"),
    rs.getString("importe"),
    rs.getString("tipo"),
    rs.getString("fecha_entrega"),
    rs.getString("fecha_cobro"),
    rs.getString("fecha_destino"),
    rs.getString("estado"),
    rs.getString("observacion"),
    rs.getString("id_titular"),
    rs.getString("id_cuenta_salida"),
    rs.getString("id_usuario")
);

private final RowMapper<ChequeTercero> chequeTerceroMapper = (rs, rowNum) -> new ChequeTercero(
    rs.getLong("id_cheque"),
    rs.getString("numero"),
    rs.getString("importe"),
    rs.getString("tipo"),
    rs.getString("banco"),
    rs.getString("fecha_entrega"),
    rs.getString("fecha_cobro"),
    rs.getString("fecha_destino"),
    rs.getString("estado"),
    rs.getString("observacion"),
    rs.getString("uso"),
    rs.getString("id_titular"),
    rs.getString("id_titular_destino"),
    rs.getString("id_cuenta_entrada"),
    rs.getString("id_cuenta_salida"),
    rs.getString("id_usuario")
);

    // ── LISTADO ───────────────────────────────────────────────────────

    public List<ChequePropio> findAllPropios() {
    return jdbcTemplate.query(
            "SELECT * FROM cheques_propios",
            chequePropioMapper
        );
    }

    public List<ChequeTercero> findAllTerceros() {
    return jdbcTemplate.query(
            "SELECT * FROM cheques_terceros",
            chequeTerceroMapper
        );
    }

    // ── ALTA ─────────────────────────────────────────────────────────

    public void insertChequepro(ChequePropio chequePropio) {
        jdbcTemplate.update(
            "INSERT INTO cheques_propios (numero_ch, importe, tipo, fecha_entrega, fecha_cobro, estado, observacion, id_titular, id_cuenta_salida, id_usuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            chequePropio.getNumero(), chequePropio.getImporte(), chequePropio.getTipo(), chequePropio.getFecha_entrega(),
            chequePropio.getFecha_cobro(), chequePropio.getEstado(), chequePropio.getObservacion(),
            chequePropio.getId_titular(), chequePropio.getId_cuenta_salida(), chequePropio.getId_usuario()
        );
    }

    public void insertChequeter(ChequeTercero chequeTercero) {
        jdbcTemplate.update(
            "INSERT INTO cheques_terceros (numero_ch, importe, tipo_ch, banco, fecha_entrega, fecha_cobro, estado, observacion, id_titular, id_usuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            chequeTercero.getNumero(), chequeTercero.getImporte(), chequeTercero.getTipo(), chequeTercero.getBanco(),
            chequeTercero.getFecha_entrega(), chequeTercero.getFecha_cobro(), chequeTercero.getEstado(), chequeTercero.getObservacion(),
            chequeTercero.getId_titular(), chequeTercero.getId_usuario()
        );
    }
}