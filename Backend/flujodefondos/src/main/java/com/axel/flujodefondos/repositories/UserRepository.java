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

    // ── MAPPERS ──────────────────────────────────────────────────────

    private final RowMapper<User> loginMapper = (rs, rowNum) -> new User(
        rs.getLong("id_usuario"),
        rs.getString("user"),
        rs.getString("pass"),
        null, null, null, null, null, null, null, null, null
    );

    private final RowMapper<User> userMapper = (rs, rowNum) -> new User(
        rs.getLong("id_usuario"),
        rs.getString("user"),
        null,
        rs.getString("dni"),
        rs.getString("nombre"),
        rs.getString("email"),
        rs.getString("telefono"),
        rs.getString("rango"),
        rs.getString("id_sucursal"),
        rs.getString("photo"),
        null,
        rs.getString("sucursal_nombre")
    );

    // ── LOGIN ────────────────────────────────────────────────────────

    public Optional<User> findByUsuario(String userOption) {
        return jdbcTemplate.query(
                "SELECT id_usuario, user, pass FROM usuarios WHERE user = ? OR dni = ?",
                loginMapper,
                userOption, userOption
        ).stream().findFirst();
    }

    // ── USUARIO ───────────────────────────────────────────────────────
    public Optional<User> findById(String id) {
        return jdbcTemplate.query(
                "SELECT u.id_usuario, u.user, u.dni, u.nombre, u.email, u.telefono, u.rango, u.id_sucursal, u.photo, s.nombre AS sucursal_nombre FROM usuarios u JOIN sucursales s ON u.id_sucursal = s.id_sucursal WHERE u.id_usuario = ?",
                userMapper,
                id
        ).stream().findFirst();
    }

    // ── LISTADO DE USUARIOS ───────────────────────────────────────────

    public List<User> findAllActive() {
    return jdbcTemplate.query(
            "SELECT u.id_usuario, u.user, u.dni, u.nombre, u.email, u.telefono, u.rango, u.id_sucursal, u.photo, s.nombre AS sucursal_nombre FROM usuarios u JOIN sucursales s ON u.id_sucursal = s.id_sucursal WHERE u.estado = 'E' ORDER BY u.rango, u.nombre ASC",
            userMapper
    );
    }

    public List<User> findAllInactive() {
    return jdbcTemplate.query(
            "SELECT u.id_usuario, u.user, u.dni, u.nombre, u.email, u.telefono, u.rango, u.id_sucursal, u.photo, s.nombre AS sucursal_nombre FROM usuarios u JOIN sucursales s ON u.id_sucursal = s.id_sucursal WHERE u.estado = 'N' ORDER BY u.rango, u.nombre ASC",
            userMapper
    );
    }

    // ── ALTA ─────────────────────────────────────────────────────────

    public void insertUser(User user) {
        jdbcTemplate.update(
                "INSERT INTO usuarios (user, pass, dni, nombre, email, telefono, rango, id_sucursal, photo, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'E')",
                user.getUsuario(), user.getPassword(), user.getDni(), user.getNombre(),
                user.getEmail(), user.getTelefono(), user.getRango(), user.getId_sucursal(), user.getPhoto()
        );
    }

    // ── EDICIÓN ──────────────────────────────────────────────────────

    public void updateUser(User user) {
        jdbcTemplate.update(
                "UPDATE usuarios SET user = ?, pass = COALESCE(NULLIF(?, ''), pass), dni = ?, nombre = ?, email = ?, telefono = ?, rango = ?, id_sucursal = ?, photo = ? WHERE id_usuario = ?",
                user.getUsuario(), user.getPassword(), user.getDni(), user.getNombre(),
                user.getEmail(), user.getTelefono(), user.getRango(), user.getId_sucursal(), user.getPhoto(),
                user.getId()
        );
    }

    // ── VERIFICAR DUPLICADO ACTIVO ───────────────────────────────────

    public boolean existsByDni(String dni) {
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM usuarios WHERE dni = ? AND estado = 'E'",
                Integer.class,
                dni
        );
        return count != null && count > 0;
    }

    // ── REACTIVACIÓN ────────────────────────────────────────────────

    public int reactivateUser(Long id) {
        return jdbcTemplate.update(
                "UPDATE usuarios SET estado = 'E' WHERE id_usuario = ?", id);
    }

    // ── BAJA ─────────────────────────────────────────────────────────

    public void deleteUser(Long id) {
        jdbcTemplate.update("UPDATE usuarios SET estado = 'N' WHERE id_usuario = ?", id);
    }
}