package com.axel.flujodefondos.repositories;

import com.axel.flujodefondos.entities.CuentaPropia;
import com.axel.flujodefondos.entities.Banco;
import com.axel.flujodefondos.entities.Tercero;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@SuppressWarnings("null")
@Repository
public class CuentaBancoRepository {

    private final JdbcTemplate jdbcTemplate;

    public CuentaBancoRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // ── MAPPERS ──────────────────────────────────────────────────────

    private final RowMapper<CuentaPropia> CuentaPropiaMapper = (rs, rowNum) -> new CuentaPropia(
        rs.getLong("id_cuenta"),
        rs.getString("nombre"),
        null,
        rs.getString("banco")
    );

    private final RowMapper<Banco> BancoMapper = (rs, rowNum) -> new Banco(
        rs.getLong("id_banco"),
        rs.getString("nombre"),
        null
    );

    // ── LISTADO ──────────────────────────────────────────────────────

    public List<CuentaPropia> findAllCuentasPropias() {
        return jdbcTemplate.query(
            "SELECT c.id_cuenta, c.nombre, b.nombre AS banco FROM cuentas c LEFT JOIN bancos b ON b.id_banco = c.id_banco ORDER BY c.nombre ASC", 
            CuentaPropiaMapper);
    }

    public List<Banco> findAllBancosConClientes() {
        // 1) todos los bancos
        List<Banco> bancos = jdbcTemplate.query(
            "SELECT id_banco, nombre FROM bancos ORDER BY nombre ASC",
            BancoMapper
        );

        // 2) todos los clientes (solo nombre + alias) con su banco
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

        // 3) le asigno a cada banco sus clientes
        for (Banco banco : bancos) {
            List<Tercero> clientes = new ArrayList<>();
            for (Object[] fila : filas) {
                if (fila[0].equals(banco.getId_banco())) {
                    clientes.add((Tercero) fila[1]);
                }
            }
            banco.setClientes(clientes);
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

    public Long findBancoByNombre(String nombre) {
        return jdbcTemplate.query(
            "SELECT id_banco FROM bancos WHERE nombre = ?",
            (rs, rowNum) -> rs.getLong("id_banco"),
            nombre
        ).stream().findFirst().orElse(null);
    }

    // ── ALTA ─────────────────────────────────────────────────────────

    public void insertCuentaPropia(CuentaPropia cuentapropia) {
        jdbcTemplate.update("INSERT INTO cuentas (nombre, id_banco) VALUES (?, ?)",
            cuentapropia.getNombre(), cuentapropia.getId_banco()
        );
    }

    public void insertBanco(String nombre) {
        jdbcTemplate.update("INSERT INTO bancos (nombre) VALUES (?)", nombre);
    }
}