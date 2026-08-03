package com.axel.flujodefondos.repositories;

import com.axel.flujodefondos.entities.Sucursal;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@SuppressWarnings("null")
@Repository
public class SucursalRepository {

    private final JdbcTemplate jdbcTemplate;

    public SucursalRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // ── MAPPERS ──────────────────────────────────────────────────────

    private final RowMapper<Sucursal> sucursalMapper = (rs, rowNum) -> new Sucursal(
        rs.getLong("id_sucursal"),
        rs.getString("nombre")
    );

    // ── LISTADO ──────────────────────────────────────────────────────

    public List<Sucursal> findAll() {
        return jdbcTemplate.query("SELECT id_sucursal, nombre FROM sucursales ORDER BY nombre ASC", sucursalMapper);
    }

    // ── BÚSQUEDA ─────────────────────────────────────────────────────

    public Long findIdByNombre(String nombre) {
        return jdbcTemplate.query(
            "SELECT id_sucursal FROM sucursales WHERE nombre = ?",
            (rs, rowNum) -> rs.getLong("id_sucursal"),
            nombre
        ).stream().findFirst().orElse(null);
    }

    // ── ALTA ─────────────────────────────────────────────────────────

    public Long insert(String nombre) {
        SimpleJdbcInsert insert = new SimpleJdbcInsert(jdbcTemplate)
                .withTableName("sucursales")
                .usingGeneratedKeyColumns("id_sucursal");
                
        return insert.executeAndReturnKey(Map.of("nombre", nombre)).longValue();
    }
}