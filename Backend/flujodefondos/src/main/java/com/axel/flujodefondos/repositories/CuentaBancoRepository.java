package com.axel.flujodefondos.repositories;

import com.axel.flujodefondos.entities.CuentaBanco;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@SuppressWarnings("null")
@Repository
public class CuentaBancoRepository {

    private final JdbcTemplate jdbcTemplate;

    public CuentaBancoRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // ── MAPPERS ──────────────────────────────────────────────────────

    private final RowMapper<CuentaBanco> CuentaBancoMapper = (rs, rowNum) -> new CuentaBanco(
        rs.getLong("id"),
        rs.getString("nombre")
    );

    // ── LISTADO ──────────────────────────────────────────────────────

    public List<CuentaBanco> findAllCuentas() {
        return jdbcTemplate.query("SELECT id_cuenta AS id, nombre FROM cuentas ORDER BY nombre ASC", CuentaBancoMapper);
    }

    public List<CuentaBanco> findAllBancos() {
        return jdbcTemplate.query("SELECT id_banco AS id, nombre FROM bancos ORDER BY nombre ASC", CuentaBancoMapper);
    }

    // ── BÚSQUEDA ─────────────────────────────────────────────────────

    public Long findCuentaByNombre(String nombre) {
        return jdbcTemplate.query(
            "SELECT id_cuenta FROM cuentas WHERE nombre = ?",
            (rs, rowNum) -> rs.getLong("id_cuenta"),
            nombre
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

    public void insertCuenta(String nombre) {
        jdbcTemplate.update("INSERT INTO cuentas (nombre) VALUES (?)", nombre);
    }

    public void insertBanco(String nombre) {
        jdbcTemplate.update("INSERT INTO bancos (nombre) VALUES (?)", nombre);
    }
}