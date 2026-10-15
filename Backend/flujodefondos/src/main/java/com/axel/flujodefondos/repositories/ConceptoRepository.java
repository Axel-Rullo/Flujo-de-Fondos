package com.axel.flujodefondos.repositories;

import com.axel.flujodefondos.entities.Concepto;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@SuppressWarnings("null")
@Repository
public class ConceptoRepository {

    private final JdbcTemplate jdbcTemplate;

    public ConceptoRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // ── MAPPERS ──────────────────────────────────────────────────────

    private final RowMapper<Concepto> conceptoMapper = new BeanPropertyRowMapper<>(Concepto.class);

    // ── LISTADO ──────────────────────────────────────────────────────

    public List<Concepto> findAll() {
        return jdbcTemplate.query("SELECT id_concepto AS id, cod_concepto AS codigo, concepto AS nombre, clasificacion, sub_clasificacion FROM conceptos ORDER BY clasificacion, cod_concepto",
        conceptoMapper
        );
    }

    public Integer countByClasificacion(String clasificacion) {
    return jdbcTemplate.queryForObject(
        "SELECT COUNT(*) FROM conceptos WHERE clasificacion = ?",
        Integer.class,
        clasificacion
        );
    }

    // ── BÚSQUEDA ─────────────────────────────────────────────────────

    public Long findConceptoByNombre(String nombre) {
        return jdbcTemplate.query(
            "SELECT id_concepto FROM conceptos WHERE concepto = ?",
            (rs, rowNum) -> rs.getLong("id_concepto"),
            nombre
        ).stream().findFirst().orElse(null);
    }

    // ── ALTA ─────────────────────────────────────────────────────────

    public void insert(Concepto concepto) {
        jdbcTemplate.update(
                "INSERT INTO conceptos (cod_concepto, concepto, clasificacion, sub_clasificacion) VALUES (?, ?, ?, ?)",
                concepto.getCodigo(), concepto.getNombre(), concepto.getClasificacion(), concepto.getSub_clasificacion()
        );
    }

    // ── MODIFICACIÓN ─────────────────────────────────────────────────

    public void update(Concepto concepto) {
        jdbcTemplate.update(
                "UPDATE conceptos SET concepto = ? WHERE id_concepto = ?",
                concepto.getNombre(), concepto.getId()
        );
    }
}