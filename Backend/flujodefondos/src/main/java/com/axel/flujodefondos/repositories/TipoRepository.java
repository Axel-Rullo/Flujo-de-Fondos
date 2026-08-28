package com.axel.flujodefondos.repositories;

import com.axel.flujodefondos.entities.Tipo;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@SuppressWarnings("null")
@Repository
public class TipoRepository {

    private final JdbcTemplate jdbcTemplate;

    public TipoRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Tipo> tipoMapper = (rs, rowNum) -> new Tipo(
        rs.getLong("id_tipo"),
        rs.getString("nombre")
    );

    public List<Tipo> findAll() {
        return jdbcTemplate.query("SELECT id_tipo, nombre FROM tipos ORDER BY nombre ASC", tipoMapper);
    }

    public Long findIdByNombre(String nombre) {
        return jdbcTemplate.query(
            "SELECT id_tipo FROM tipos WHERE nombre = ?",
            (rs, rowNum) -> rs.getLong("id_tipo"),
            nombre
        ).stream().findFirst().orElse(null);
    }

    public Long insert(String nombre) {
        SimpleJdbcInsert insert = new SimpleJdbcInsert(jdbcTemplate)
                .withTableName("tipos")
                .usingGeneratedKeyColumns("id_tipo");
                
        return insert.executeAndReturnKey(Map.of("nombre", nombre)).longValue();
    }
}
