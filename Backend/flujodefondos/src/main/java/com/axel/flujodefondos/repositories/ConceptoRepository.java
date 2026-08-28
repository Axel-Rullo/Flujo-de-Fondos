package com.axel.flujodefondos.repositories;

import com.axel.flujodefondos.entities.Concepto;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

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
        rs.getString("id_tipo")
    );

    public List<Concepto> findAll() {
        return jdbcTemplate.query("SELECT id_concepto, cod_concepto, concepto, id_tipo FROM conceptos ORDER BY concepto ASC", conceptoMapper);
    }

    public Long insert(Concepto concepto) {
        SimpleJdbcInsert insert = new SimpleJdbcInsert(jdbcTemplate)
                .withTableName("conceptos")
                .usingGeneratedKeyColumns("id_concepto");
        
        Map<String, Object> params = new HashMap<>();
        params.put("cod_concepto", concepto.getCodigo());
        params.put("concepto", concepto.getConcepto());
        params.put("id_tipo", concepto.getId_tipo() != null ? Long.parseLong(concepto.getId_tipo()) : null);
                
        return insert.executeAndReturnKey(params).longValue();
    }
}