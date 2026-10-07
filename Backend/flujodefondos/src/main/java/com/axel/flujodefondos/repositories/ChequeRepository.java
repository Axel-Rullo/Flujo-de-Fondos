package com.axel.flujodefondos.repositories;

import com.axel.flujodefondos.entities.Cheque;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@SuppressWarnings("null")
@Repository
public class ChequeRepository {

    private final JdbcTemplate jdbcTemplate;

    public ChequeRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // ── MAPPERS ──────────────────────────────────────────────────────

    private final RowMapper<Cheque> chequeMapper = new BeanPropertyRowMapper<>(Cheque.class);

    // ── BÚSQUEDA Y PAGINACIÓN ────────────────────────────────────────

    // Número, importe (con 2 decimales), nombre o DNI del usuario que cargó el cheque
    private static final String BUSQUEDA =
        "AND (ch.numero LIKE ? OR printf('%.2f', ch.importe) LIKE ? OR u.nombre LIKE ? OR CAST(u.dni AS TEXT) LIKE ?) ";

    private static final String PAGINA = "LIMIT ? OFFSET ?";

    // Pendientes: primero los que vencen antes. Historial: primero los más recientes
    private String orden(String estado) {
        return "P".equals(estado)
            ? "ORDER BY ch.fecha_pago, ch.id_cheque "
            : "ORDER BY ch.fecha_destino DESC, ch.id_cheque DESC ";
    }

    private Object[] parametros(String estado, String busqueda, int limit, int offset) {
        String texto = busqueda == null ? "" : busqueda.trim();
        String like = "%" + texto + "%";
        String likeImporte = "%" + texto.replace(",", "") + "%";
        return new Object[] { estado, like, likeImporte, like, like, limit, offset };
    }

    // ── RESUMEN ───────────────────────────────────────────────────────

    public List<Cheque> findAllTotales() {
        return jdbcTemplate.query(
            "SELECT clasificacion, tipo, SUM(importe) AS importe FROM cheques " +
            "WHERE estado = 'C' AND (uso IS NULL OR uso != 'E') " +
            "AND strftime('%Y-%m', fecha_destino) = strftime('%Y-%m', 'now', 'localtime') " +
            "GROUP BY clasificacion, tipo " +
            "ORDER BY clasificacion, tipo",
            chequeMapper
        );
    }

    // ── RESUMEN PRÓXIMOS 7 DÍAS (DESDE MAÑANA) ───────────────────────

    public List<Map<String, Object>> resumenProximosDias(String desde, String hasta) {
        return jdbcTemplate.queryForList(
            "SELECT ch.fecha_pago, ch.clasificacion, COUNT(*) AS cantidad, SUM(ch.importe) AS monto " +
            "FROM cheques ch " +

            // Solo pendientes dentro del rango de fechas
            "WHERE ch.estado = 'P' AND DATE(ch.fecha_pago, '+30 days') BETWEEN ? AND ? " +

            // Un registro por día y clasificación
            "GROUP BY ch.fecha_pago, ch.clasificacion " +
            "ORDER BY ch.fecha_pago",
            desde,
            hasta
        );
    }

    // ── LISTADO ───────────────────────────────────────────────────────

    public List<Cheque> findAllPropios(String estado, String busqueda, int limit, int offset) {
        return jdbcTemplate.query(
            "SELECT ch.id_cheque, ch.numero, ch.importe, ch.tipo, ch.fecha_pago, ch.estado, " +
            "cp.nombre AS clipro_emision, cb.nombre AS cuenta_propia_emision " +
            "FROM cheques ch " +

            // Titular en emisión
            "LEFT JOIN clientes_proveedores cp ON ch.id_clipro_emision = cp.id_clipro " +

            // Cuenta propia en emisión
            "LEFT JOIN cuentas cb ON ch.id_cuenta_propia_emision = cb.id_cuenta " +

            // Usuario (para la búsqueda)
            "LEFT JOIN usuarios u ON u.id_usuario = ch.id_usuario " +

            "WHERE ch.clase = 'P' AND ch.estado = ? " +
            BUSQUEDA + orden(estado) + PAGINA,
            chequeMapper,
            parametros(estado, busqueda, limit, offset)
        );
    }

    public List<Cheque> findAllTerceros(String estado, String busqueda, int limit, int offset) {
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

            // Usuario (para la búsqueda)
            "LEFT JOIN usuarios u ON u.id_usuario = ch.id_usuario " +

            "WHERE ch.clase = 'T' AND ch.estado = ? " +
            BUSQUEDA + orden(estado) + PAGINA,
            chequeMapper,
            parametros(estado, busqueda, limit, offset)
        );
    }

    // ── HISTORIAL ────────────────────────────────────────────────────

    public List<Cheque> findAllBajasPropios(String estado, String busqueda, int limit, int offset) {
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

            "WHERE ch.clase = 'P' AND ch.estado = ? " +
            BUSQUEDA + orden(estado) + PAGINA,
            chequeMapper,
            parametros(estado, busqueda, limit, offset)
        );
    }

    public List<Cheque> findAllBajasTerceros(String estado, String busqueda, int limit, int offset) {
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

            "WHERE ch.clase = 'T' AND ch.estado = ? " +
            BUSQUEDA + orden(estado) + PAGINA,
            chequeMapper,
            parametros(estado, busqueda, limit, offset)
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

    public int imputarChequePropio(Cheque cheque) {
        return jdbcTemplate.update(
            "UPDATE cheques SET fecha_destino = ?, estado = ? WHERE id_cheque = ? AND estado = ?",
            cheque.getFecha_destino(), "C", cheque.getId_cheque(), "P"
        );
    }

    public int imputarChequeTercero(Cheque cheque) {
        return jdbcTemplate.update(
            "UPDATE cheques SET estado = ?, uso = ?, fecha_destino = ?, id_cuenta_propia_imputar = ?, id_clipro_imputar = ?, id_concepto_imputar = ? WHERE id_cheque = ? AND estado = ?",
            "C", cheque.getUso(), cheque.getFecha_destino(), cheque.getId_cuenta_propia_imputar(),
            cheque.getId_clipro_imputar(), cheque.getId_concepto_imputar(), cheque.getId_cheque(), "P"
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

    // ── DATOS PARA MOVIMIENTOS ───────────────────────────────────────

    public Cheque findImputacionById(Long id) {
        return jdbcTemplate.queryForObject(
            "SELECT ch.numero, ch.importe, ch.id_concepto_emision, ch.id_cuenta_propia_emision " +
            "FROM cheques ch WHERE ch.id_cheque = ?",
            chequeMapper,
            id
        );
    }

    public String findSucursalByUsuario(String idUsuario) {
        return jdbcTemplate.queryForObject(
            "SELECT id_sucursal FROM usuarios WHERE id_usuario = ?",
            String.class,
            idUsuario
        );
    }
}