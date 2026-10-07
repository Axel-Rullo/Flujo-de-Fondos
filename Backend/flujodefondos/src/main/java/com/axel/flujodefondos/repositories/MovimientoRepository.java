package com.axel.flujodefondos.repositories;

import com.axel.flujodefondos.entities.Movimiento;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@SuppressWarnings("null")
@Repository
public class MovimientoRepository {

    private final JdbcTemplate jdbcTemplate;

    public MovimientoRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Movimiento> movimientoMapper = new BeanPropertyRowMapper<>(Movimiento.class);

    public List<Movimiento> findAllMovimientos(int limit, int offset) {
        return jdbcTemplate.query(
            "SELECT m.id_movimiento, m.fecha, " +
            "m.ingreso, m.egreso, m.saldo, m.observaciones, m.ch_endosado, " +
            "cu.nombre AS cuenta, co.concepto AS concepto " +
            "FROM movimientos m " +
            "LEFT JOIN cuentas cu ON cu.id_cuenta = m.id_cuenta " +
            "LEFT JOIN conceptos co ON co.id_concepto = m.id_concepto " +
            "ORDER BY fecha ASC, m.id_movimiento ASC " +
            "LIMIT ? OFFSET ?",
            movimientoMapper,
            limit, offset
        );
    }

    public List<Movimiento> findAllOperaciones(int limit, int offset) {
        return jdbcTemplate.query(
            "SELECT m.id_movimiento, m.fecha, m.operacion, u.nombre AS usuario " +
            "FROM movimientos m " +
            "LEFT JOIN usuarios u ON u.id_usuario = m.id_usuario " +
            "WHERE m.operacion IS NOT NULL " +
            "ORDER BY fecha ASC, m.id_movimiento ASC " +
            "LIMIT ? OFFSET ?",
            movimientoMapper,
            limit, offset
        );
    }

    public void insert(Movimiento movimiento) {
        jdbcTemplate.update(
            "INSERT INTO movimientos (fecha, id_cuenta, id_concepto, ingreso, egreso, saldo, observaciones, operacion, " +
            "ch_endosado, id_usuario, id_sucursal) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            movimiento.getFecha(), movimiento.getId_cuenta(),
            movimiento.getId_concepto(), movimiento.getIngreso(), movimiento.getEgreso(),
            movimiento.getSaldo(), movimiento.getObservaciones(), movimiento.getOperacion(), movimiento.getCh_endosado(),
            movimiento.getId_usuario(), movimiento.getId_sucursal()
        );
    }

    public String findFechaUltimoMovimiento() {
        return jdbcTemplate.query(
            "SELECT fecha FROM movimientos ORDER BY fecha DESC LIMIT 1",
            (rs, rowNum) -> rs.getString("fecha")
        ).stream().findFirst().orElse(null);
    }

    public List<Map<String, Object>> ReporteAnual(int anio) {
        return jdbcTemplate.queryForList("""
            SELECT
            c.concepto AS concepto, c.clasificacion,
            SUM(CASE WHEN strftime('%m', m.fecha) = '01' THEN COALESCE(m.ingreso, 0) - COALESCE(m.egreso, 0) ELSE 0 END) AS ene,
            SUM(CASE WHEN strftime('%m', m.fecha) = '02' THEN COALESCE(m.ingreso, 0) - COALESCE(m.egreso, 0) ELSE 0 END) AS feb,
            SUM(CASE WHEN strftime('%m', m.fecha) = '03' THEN COALESCE(m.ingreso, 0) - COALESCE(m.egreso, 0) ELSE 0 END) AS mar,
            SUM(CASE WHEN strftime('%m', m.fecha) = '04' THEN COALESCE(m.ingreso, 0) - COALESCE(m.egreso, 0) ELSE 0 END) AS abr,
            SUM(CASE WHEN strftime('%m', m.fecha) = '05' THEN COALESCE(m.ingreso, 0) - COALESCE(m.egreso, 0) ELSE 0 END) AS may,
            SUM(CASE WHEN strftime('%m', m.fecha) = '06' THEN COALESCE(m.ingreso, 0) - COALESCE(m.egreso, 0) ELSE 0 END) AS jun,
            SUM(CASE WHEN strftime('%m', m.fecha) = '07' THEN COALESCE(m.ingreso, 0) - COALESCE(m.egreso, 0) ELSE 0 END) AS jul,
            SUM(CASE WHEN strftime('%m', m.fecha) = '08' THEN COALESCE(m.ingreso, 0) - COALESCE(m.egreso, 0) ELSE 0 END) AS ago,
            SUM(CASE WHEN strftime('%m', m.fecha) = '09' THEN COALESCE(m.ingreso, 0) - COALESCE(m.egreso, 0) ELSE 0 END) AS sep,
            SUM(CASE WHEN strftime('%m', m.fecha) = '10' THEN COALESCE(m.ingreso, 0) - COALESCE(m.egreso, 0) ELSE 0 END) AS oct,
            SUM(CASE WHEN strftime('%m', m.fecha) = '11' THEN COALESCE(m.ingreso, 0) - COALESCE(m.egreso, 0) ELSE 0 END) AS nov,
            SUM(CASE WHEN strftime('%m', m.fecha) = '12' THEN COALESCE(m.ingreso, 0) - COALESCE(m.egreso, 0) ELSE 0 END) AS dic
            FROM conceptos c
            LEFT JOIN movimientos m ON m.id_concepto = c.id_concepto
            AND CAST(strftime('%Y', m.fecha) AS INTEGER) = ?
            GROUP BY c.id_concepto, c.concepto, c.clasificacion
            ORDER BY c.concepto
            """, anio);
    }

    public List<Map<String, Object>> ReporteMensual(int mes, int anio) {
        return jdbcTemplate.queryForList("""
            SELECT
            c.concepto AS concepto, c.clasificacion,
            CAST(strftime('%d', m.fecha) AS INTEGER) AS dia,
            SUM(COALESCE(m.ingreso, 0) - COALESCE(m.egreso, 0)) AS neto
            FROM conceptos c
            LEFT JOIN movimientos m ON m.id_concepto = c.id_concepto
            AND CAST(strftime('%Y', m.fecha) AS INTEGER) = ?
            AND CAST(strftime('%m', m.fecha) AS INTEGER) = ?
            GROUP BY c.id_concepto, c.concepto, c.clasificacion, dia
            ORDER BY c.concepto, dia
            """, anio, mes);
    }
}