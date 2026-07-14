package com.axel.flujodefondos.repositories;

import com.axel.flujodefondos.entities.User;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@SuppressWarnings("null")
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
        rs.getString("dni"),
        rs.getString("nombre"),
        rs.getString("email"),
        rs.getString("telefono"),
        rs.getString("rango"),
        rs.getString("id_sucursal")
    );

    public Optional<User> findByUsuario(String userOption) {
        return jdbcTemplate.query(
                "SELECT * FROM usuarios WHERE user = ?",
                userMapper,
                userOption
        ).stream().findFirst();
    }

    public List<User> findAll() {
        return jdbcTemplate.query(
                "SELECT * FROM usuarios",
                userMapper
        );
    }

    public void insertUser(User user) {
        jdbcTemplate.update(
                "INSERT INTO usuarios (user, pass, nombre, email, telefono, rango) VALUES (?, ?, ?, ?, ?, ?)",
                user.getUsuario(), user.getPassword(), user.getNombre(),
                user.getEmail(), user.getTelefono(), user.getRango()
        );
    }
}