package com.axel.flujodefondos.repositories;

import com.axel.flujodefondos.entities.Movimiento;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@SuppressWarnings("null")
@Repository
public class MovimientoRepository {

    private final JdbcTemplate jdbcTemplate;

    public MovimientoRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Movimiento> movimientoMapper = (rs, rowNum) -> new Movimiento(
        rs.getLong("id_movimiento"),
        rs.getString("nombre"),
        rs.getString("id_banco")
    );

    public List<Movimiento> findAll() {
        return jdbcTemplate.query("SELECT id_movimiento, nombre, id_banco FROM movimientos ORDER BY nombre ASC", movimientoMapper);
    }

    public Long insert(Movimiento movimiento) {
        SimpleJdbcInsert insert = new SimpleJdbcInsert(jdbcTemplate)
                .withTableName("movimientos")
                .usingGeneratedKeyColumns("id_movimiento");
        
        Map<String, Object> params = new HashMap<>();
        params.put("nombre", movimiento.getNombre());
        params.put("id_banco", movimiento.getId_banco() != null ? Long.parseLong(movimiento.getId_banco()) : null);
                
        return insert.executeAndReturnKey(params).longValue();
    }
}