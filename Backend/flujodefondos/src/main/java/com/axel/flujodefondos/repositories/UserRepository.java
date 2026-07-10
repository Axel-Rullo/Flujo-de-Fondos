package com.axel.flujodefondos.repositories;

import com.axel.flujodefondos.entities.User;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class UserRepository {

    private final JdbcTemplate jdbcTemplate;

    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<User> userMapper = (rs, rowNum) -> new User(
        rs.getLong("id"),
        rs.getString("user"),
        rs.getString("pass"),
        rs.getString("nombre"),
        rs.getString("email"),
        rs.getString("telefono"),
        rs.getString("rango")
    );

    public Optional<User> findByUsuario(String usuario) {
        try {
            User user = jdbcTemplate.queryForObject(
                "SELECT * FROM usuarios WHERE user = ?",
                userMapper,
                usuario
            );
            return Optional.ofNullable(user);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }
}