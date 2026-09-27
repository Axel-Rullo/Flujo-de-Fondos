package com.axel.flujodefondos.repositories;

import com.axel.flujodefondos.entities.Movimiento;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@SuppressWarnings("null")
@Repository
public class MovimientoRepository {

    private final JdbcTemplate jdbcTemplate;

    public MovimientoRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Movimiento> movimientoMapper = new BeanPropertyRowMapper<>(Movimiento.class);

    public List<Movimiento> findAll() {
        return jdbcTemplate.query(
            "SELECT m.id_movimiento, m.fecha, m.id_cuenta, m.id_concepto, " +
            "m.ingreso, m.egreso, m.saldo, m.observaciones, m.ch_endosado, " +
            "m.id_usuario, m.id_sucursal, " +
            "cu.nombre AS cuenta, co.concepto AS concepto " +
            "FROM movimientos m " +
            "LEFT JOIN cuentas cu ON cu.id_cuenta = m.id_cuenta " +
            "JOIN conceptos co ON co.id_concepto = m.id_concepto " +
            "ORDER BY fecha ASC",
            movimientoMapper
        );
    }

    public void insert(Movimiento movimiento) {
        jdbcTemplate.update(
            "INSERT INTO movimientos (fecha, id_cuenta, id_concepto, ingreso, egreso, saldo, observaciones, " +
            "ch_endosado, id_usuario, id_sucursal) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            movimiento.getFecha(), movimiento.getId_cuenta(),
            movimiento.getId_concepto(), movimiento.getIngreso(), movimiento.getEgreso(),
            movimiento.getSaldo(), movimiento.getObservaciones(), movimiento.getCh_endosado(),
            movimiento.getId_usuario(), movimiento.getId_sucursal()
        );
    }

    public String findFechaUltimoMovimiento() {
    return jdbcTemplate.query(
        "SELECT fecha FROM movimientos ORDER BY fecha DESC LIMIT 1",
        (rs, rowNum) -> rs.getString("fecha")
    ).stream().findFirst().orElse(null);
}
}