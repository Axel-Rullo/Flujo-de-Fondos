package com.axel.flujodefondos.repositories;

import com.axel.flujodefondos.entities.Concepto;
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

    private final RowMapper<Concepto> conceptoMapper = (rs, rowNum) -> new Concepto(
        rs.getLong("id_concepto"),
        rs.getString("cod_concepto"),
        rs.getString("concepto"),
        rs.getString("clasificacion")
    );

    public List<Concepto> findAll() {
        return jdbcTemplate.query("SELECT id_concepto, cod_concepto, concepto, clasificacion FROM conceptos ORDER BY clasificacion, cod_concepto",
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

    public void insert(Concepto concepto) {
        jdbcTemplate.update(
                "INSERT INTO conceptos (cod_concepto, concepto, clasificacion) VALUES (?, ?, ?)",
                concepto.getCodigo(), concepto.getNombre(), concepto.getClasificacion()
        );
    }

    public void update(Concepto concepto) {
        jdbcTemplate.update(
                "UPDATE conceptos SET concepto = ?, clasificacion = ? WHERE id_concepto = ?",
                concepto.getNombre(), concepto.getClasificacion(), concepto.getId()
        );
    }
}