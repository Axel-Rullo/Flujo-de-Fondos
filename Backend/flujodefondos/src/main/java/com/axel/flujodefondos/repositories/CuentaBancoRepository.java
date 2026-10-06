package com.axel.flujodefondos.repositories;

import com.axel.flujodefondos.entities.CuentaPropia;
import com.axel.flujodefondos.entities.Banco;
import com.axel.flujodefondos.entities.BancoCliPro;
import com.axel.flujodefondos.entities.Tercero;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@SuppressWarnings("null")
@Repository
public class CuentaBancoRepository {

    private final JdbcTemplate jdbcTemplate;

    public CuentaBancoRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // ── MAPPERS ──────────────────────────────────────────────────────

    private final RowMapper<CuentaPropia> cuentaPropiaMapper = new BeanPropertyRowMapper<>(CuentaPropia.class);

    private final RowMapper<Banco> bancoMapper = new BeanPropertyRowMapper<>(Banco.class);

    // ── LISTADO ──────────────────────────────────────────────────────

    public List<CuentaPropia> findAllCuentasPropias() {
        return jdbcTemplate.query(
            "SELECT c.id_cuenta, c.nombre, c.saldo, b.nombre AS banco FROM cuentas c LEFT JOIN bancos b ON b.id_banco = c.id_banco ORDER BY c.nombre ASC", 
            cuentaPropiaMapper);
    }

    public List<CuentaPropia> findAllTransaccionesInternas() {
        return jdbcTemplate.query(
            """
            SELECT ti.id_transaccion, ti.fecha, ti.monto,
                co.nombre AS cuenta_origen,
                cd.nombre AS cuenta_destino,
                u.nombre  AS usuario
            FROM transacciones_internas ti
            JOIN cuentas co ON co.id_cuenta = ti.id_cuenta_origen
            JOIN cuentas cd ON cd.id_cuenta = ti.id_cuenta_destino
            LEFT JOIN usuarios u ON u.id_usuario = ti.id_usuario
            ORDER BY ti.fecha DESC, ti.id_transaccion DESC
            """,
            cuentaPropiaMapper);
    }

    public List<Banco> findAllBancosNames() {
        return jdbcTemplate.query(
            "SELECT id_banco, nombre FROM bancos ORDER BY nombre ASC",
            bancoMapper
        );
    }

    public List<Banco> findAllBancosCliPro() {
        List<Banco> bancos = jdbcTemplate.query(
            "SELECT id_banco, nombre FROM bancos ORDER BY nombre ASC",
            bancoMapper
        );

        List<Object[]> filas = jdbcTemplate.query(
            """
            SELECT bc.id_banco, cp.id_clipro, cp.nombre, bc.alias
            FROM bancos_clientprov bc
            JOIN clientes_proveedores cp ON cp.id_clipro = bc.id_clipro
            ORDER BY cp.nombre ASC
            """,
            (rs, rowNum) -> {
                Tercero t = new Tercero();
                t.setId_clipro(rs.getLong("id_clipro"));
                t.setNombre(rs.getString("nombre"));
                t.setAlias(rs.getString("alias"));
                return new Object[] { rs.getLong("id_banco"), t };
            }
        );

        Map<Long, List<Tercero>> clientesPorBanco = new HashMap<>();
        for (Object[] fila : filas) {
            clientesPorBanco.computeIfAbsent((Long) fila[0], k -> new ArrayList<>()).add((Tercero) fila[1]);
        }

        for (Banco banco : bancos) {
            banco.setClientes(clientesPorBanco.getOrDefault(banco.getId_banco(), new ArrayList<>()));
        }

        return bancos;
    }

    // ── BÚSQUEDA ─────────────────────────────────────────────────────

    public Long findCuentaPropia(CuentaPropia cuentapropia) {
        return jdbcTemplate.query(
            "SELECT id_cuenta FROM cuentas WHERE nombre = ? AND id_banco IS ?",
            (rs, rowNum) -> rs.getLong("id_cuenta"),
            cuentapropia.getNombre(), cuentapropia.getId_banco()
        ).stream().findFirst().orElse(null);
    }

    public CuentaPropia findById(Long idCuenta) {
        return jdbcTemplate.query(
            "SELECT c.id_cuenta, c.nombre, c.saldo, b.nombre AS banco FROM cuentas c LEFT JOIN bancos b ON b.id_banco = c.id_banco WHERE c.id_cuenta = ?",
            cuentaPropiaMapper, idCuenta
        ).stream().findFirst().orElse(null);
    }

    public BigDecimal getSaldoTotalCuentas() {
        BigDecimal total = jdbcTemplate.queryForObject(
            "SELECT COALESCE(SUM(saldo), 0) FROM cuentas",
            BigDecimal.class
        );
        return total;
    }

    public Long findBancoByNombre(String nombre) {
        return jdbcTemplate.query(
            "SELECT id_banco FROM bancos WHERE nombre = ?",
            (rs, rowNum) -> rs.getLong("id_banco"),
            nombre
        ).stream().findFirst().orElse(null);
    }

    public Long findBancoCliPro(BancoCliPro bancoclipro) {
        return jdbcTemplate.query(
            "SELECT id_banco_clipro FROM bancos_clientprov WHERE id_banco = ? and alias = ?",
            (rs, rowNum) -> rs.getLong("id_banco_clipro"),
            bancoclipro.getId_banco(), bancoclipro.getAlias()
        ).stream().findFirst().orElse(null);
    }

    // ── ALTA ─────────────────────────────────────────────────────────

    public void insertCuentaPropia(CuentaPropia cuentapropia) {
        jdbcTemplate.update("INSERT INTO cuentas (nombre, saldo, id_banco) VALUES (?, ?, ?)",
            cuentapropia.getNombre(), cuentapropia.getSaldo(), cuentapropia.getId_banco()
        );
    }

    public void insertTransaccionInterna(CuentaPropia cuentapropia) {
        jdbcTemplate.update("INSERT INTO transacciones_internas (fecha, id_cuenta_origen, id_cuenta_destino, monto, id_usuario) VALUES (?, ?, ?, ?, ?)",
            cuentapropia.getFecha(), cuentapropia.getId_cuenta_origen(), cuentapropia.getId_cuenta_destino(),
            cuentapropia.getMonto(), cuentapropia.getId_usuario()
        );
    }

    public void insertBanco(String nombre) {
        jdbcTemplate.update("INSERT INTO bancos (nombre) VALUES (?)", nombre);
    }

    public void insertBancoClipro(BancoCliPro bancoclipro) {
    jdbcTemplate.update("INSERT INTO bancos_clientprov (id_banco, id_clipro, alias) VALUES (?, ?, ?)",
        bancoclipro.getId_banco(), bancoclipro.getId_clipro(), bancoclipro.getAlias());
    }

    // ── SALDO ────────────────────────────────────────────────────────
    public void updateSaldoCuentaPropia(CuentaPropia cuentaPropia) {
    jdbcTemplate.update(
        "UPDATE cuentas SET saldo = ? WHERE id_cuenta = ?",
        cuentaPropia.getSaldo(), cuentaPropia.getId_cuenta());
    }
}
