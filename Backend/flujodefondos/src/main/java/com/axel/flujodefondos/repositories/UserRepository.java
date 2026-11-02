package com.axel.flujodefondos.repositories;

import com.axel.flujodefondos.entities.User;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
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

    private final BeanPropertyRowMapper<User> userMapper = new BeanPropertyRowMapper<>(User.class);

    // ── LOGIN ────────────────────────────────────────────────────────

    public Optional<User> findByUsuario(String userOption) {
        return jdbcTemplate.query(
                "SELECT id_usuario AS id, user AS usuario, pass AS password FROM usuarios WHERE user = ? OR dni = ?",
                userMapper,
                userOption, userOption
        ).stream().findFirst();
    }

    // ── USUARIO ───────────────────────────────────────────────────────
    public Optional<User> findById(String id) {
        return jdbcTemplate.query(
                "SELECT u.id_usuario AS id, u.user AS usuario, u.dni, u.nombre, u.email, u.telefono, u.rango, u.id_sucursal, u.photo, s.nombre AS sucursal_nombre FROM usuarios u JOIN sucursales s ON u.id_sucursal = s.id_sucursal WHERE u.id_usuario = ?",
                userMapper,
                id
        ).stream().findFirst();
    }

    // ── LISTADO DE USUARIOS ───────────────────────────────────────────

    public List<User> findAll(String estado, String busqueda, int limit, int offset) {
        String like = "%" + busqueda + "%";
        return jdbcTemplate.query(
                "SELECT u.id_usuario AS id, u.user AS usuario, u.dni, u.nombre, u.email, u.telefono, u.rango, u.id_sucursal, u.photo, s.nombre AS sucursal_nombre FROM usuarios u JOIN sucursales s ON u.id_sucursal = s.id_sucursal WHERE u.estado = ? AND (u.nombre LIKE ? OR u.user LIKE ? OR u.dni LIKE ?) ORDER BY u.rango, u.nombre ASC, u.id_usuario ASC LIMIT ? OFFSET ?",
                userMapper,
                estado, like, like, like, limit, offset
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
                "SELECT COUNT(*) FROM usuarios WHERE dni = ?",
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
