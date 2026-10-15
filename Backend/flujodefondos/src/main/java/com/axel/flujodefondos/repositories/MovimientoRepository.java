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
            "WHERE strftime('%Y-%m', m.fecha) = strftime('%Y-%m', 'now', 'localtime') " +
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
            "AND strftime('%Y-%m', m.fecha) = strftime('%Y-%m', 'now', 'localtime') " +
            "ORDER BY fecha ASC, m.id_movimiento ASC " +
            "LIMIT ? OFFSET ?",
            movimientoMapper,
            limit, offset
        );
    }

    public List<Movimiento> filtroMovimientos(String desde, String hasta, Integer id_concepto, int limit, int offset) {
        return jdbcTemplate.query(
            "SELECT m.id_movimiento, m.fecha, " +
            "m.ingreso, m.egreso, m.saldo, m.observaciones, m.ch_endosado, " +
            "cu.nombre AS cuenta, co.concepto AS concepto " +
            "FROM movimientos m " +
            "LEFT JOIN cuentas cu ON cu.id_cuenta = m.id_cuenta " +
            "LEFT JOIN conceptos co ON co.id_concepto = m.id_concepto " +
            "WHERE (? IS NULL OR date(m.fecha) >= ?) " +
            "AND (? IS NULL OR date(m.fecha) <= ?) " +
            "AND (? IS NULL OR m.id_concepto = ?) " +
            "ORDER BY m.fecha ASC, m.id_movimiento ASC " +
            "LIMIT ? OFFSET ?",
            movimientoMapper,
            desde, desde,
            hasta, hasta,
            id_concepto, id_concepto,
            limit, offset
        );
    }

    public Map<String, Object> mostrarTotales() {
        return jdbcTemplate.queryForMap(
            "SELECT COALESCE(SUM(m.ingreso), 0) AS ingreso, COALESCE(SUM(m.egreso), 0) AS egreso " +
            "FROM movimientos m " +
            "WHERE m.fecha = strftime('%Y-%m-%d', 'now', 'localtime') AND m.id_cuenta IS NOT NULL"
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
        List<Map<String, Object>> result = jdbcTemplate.queryForList("""
            SELECT
            c.concepto AS concepto,
            CASE WHEN c.clasificacion = 1 AND c.sub_clasificacion = 'E' THEN 1.5 ELSE c.clasificacion END AS clasificacion,
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
            GROUP BY c.id_concepto, c.concepto, c.clasificacion, c.sub_clasificacion
            ORDER BY c.concepto
            """, anio);

        String[] meses = {"ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"};
        List<Map<String, Object>> filas = new java.util.ArrayList<>(result);

        // Saldo Inicial (una fila con el saldo de cada mes + total anual)
        Map<String, Object> saldoInicial = new java.util.HashMap<>();
        saldoInicial.put("concepto", "SALDO INICIAL");
        saldoInicial.put("clasificacion", 0);

        List<Map<String, Object>> saldosDB = jdbcTemplate.queryForList(
            "SELECT CAST(strftime('%m', fecha) AS INTEGER) AS mes, SUM(ingreso) AS total " +
            "FROM movimientos WHERE id_concepto IS NULL AND CAST(strftime('%Y', fecha) AS INTEGER) = ? GROUP BY mes", anio);

        for (String mes : meses) saldoInicial.put(mes, java.math.BigDecimal.ZERO);
        for (Map<String, Object> row : saldosDB)
            if (row.get("total") != null)
                saldoInicial.put(meses[((Number) row.get("mes")).intValue() - 1], new java.math.BigDecimal(row.get("total").toString()));

        List<java.math.BigDecimal> saldoDiciembre = jdbcTemplate.query(
            "SELECT saldo FROM movimientos WHERE fecha < ? ORDER BY fecha DESC, id_movimiento DESC LIMIT 1",
            (rs, rowNum) -> rs.getBigDecimal("saldo"), String.format("%04d-01-01", anio + 1));
        saldoInicial.put("total_anual", saldoDiciembre.isEmpty() || saldoDiciembre.get(0) == null ? java.math.BigDecimal.ZERO : saldoDiciembre.get(0));

        filas.add(0, saldoInicial);
        return filas;
    }

    public List<Map<String, Object>> ReporteMensual(String desde, String hasta) {
        List<Map<String, Object>> result = jdbcTemplate.queryForList("""
            SELECT
            c.concepto AS concepto,
            CASE WHEN c.clasificacion = 1 AND c.sub_clasificacion = 'E' THEN 1.5 ELSE c.clasificacion END AS clasificacion,
            strftime('%Y-%m-%d', m.fecha) AS fecha_mov,
            SUM(COALESCE(m.ingreso, 0)) AS ingreso,
            SUM(COALESCE(m.egreso, 0)) AS egreso,
            SUM(COALESCE(m.ingreso, 0) - COALESCE(m.egreso, 0)) AS neto
            FROM conceptos c
            LEFT JOIN movimientos m ON m.id_concepto = c.id_concepto
            AND date(m.fecha) >= date(?) AND date(m.fecha) <= date(?)
            GROUP BY c.id_concepto, c.concepto, c.clasificacion, c.sub_clasificacion, fecha_mov
            ORDER BY c.concepto, fecha_mov
            """, desde, hasta
        );

        return result;
    }
}