package com.axel.flujodefondos.repositories;

import com.axel.flujodefondos.entities.ChequePropio;
import com.axel.flujodefondos.entities.ChequeTercero;
import org.springframework.jdbc.core.JdbcTemplate;
//import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

//@SuppressWarnings("null")
@Repository
public class ChequeRepository {

    private final JdbcTemplate jdbcTemplate;

    public ChequeRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // ── MAPPERS ──────────────────────────────────────────────────────
/*
    private final RowMapper<ChequePropio> chequePropioMapper = (rs, rowNum) -> new ChequePropio(
        rs.getLong("id_chequepro"),
        rs.getString("numero"),
        rs.getString("importe"),
        rs.getString("fechacob"),
        rs.getString("fechaent"),
        rs.getString("estado"),
        rs.getString("observacion"),
        rs.getString("uso"),
        rs.getString("id_titular"),
        rs.getString("id_cuentasal")
    );

    private final RowMapper<ChequeTercero> chequeTerceroMapper = (rs, rowNum) -> new ChequeTercero(
        rs.getLong("id_chequeter"),
        rs.getString("numero"),
        rs.getString("importe"),
        rs.getString("fechacob"),
        rs.getString("estado"),
        rs.getString("observacion"),
        rs.getString("uso"),
        rs.getString("id_titular"),
        rs.getString("id_titulardes"),
        rs.getString("id_cuentaent"),
        rs.getString("id_cuentasal")
    );*/

    // ── ALTA ─────────────────────────────────────────────────────────

    public void insertChequepro(ChequePropio chequePropio) {
        jdbcTemplate.update("INSERT INTO cheques_propios (numero_ch, importe, fecha_cobro, fecha_entrega, estado, observacion, uso, id_titular, id_cuenta_salida) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            chequePropio.getNumero(), chequePropio.getImporte(), chequePropio.getFechacob(),
            chequePropio.getFechaent(), chequePropio.getEstado(), chequePropio.getObservacion(),
            chequePropio.getUso(), chequePropio.getId_titular(), chequePropio.getId_cuentasal()
        );
    }

    public void insertChequeter(ChequeTercero chequeTercero) {
        jdbcTemplate.update("INSERT INTO cheques_terceros (numero_ch, importe, fecha_cobro, estado, observacion, uso, id_titular, id_titular_destino, id_cuenta_entrada, id_cuenta_salida) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            chequeTercero.getNumero(), chequeTercero.getImporte(), chequeTercero.getFechacob(),
            chequeTercero.getEstado(), chequeTercero.getObservacion(), chequeTercero.getUso(),
            chequeTercero.getId_titular(), chequeTercero.getId_titulardes(),
            chequeTercero.getId_cuentaent(), chequeTercero.getId_cuentasal()
        );
    }
}