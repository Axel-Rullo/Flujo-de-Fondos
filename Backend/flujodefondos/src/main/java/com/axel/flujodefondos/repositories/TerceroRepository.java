package com.axel.flujodefondos.repositories;

import com.axel.flujodefondos.entities.Tercero;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@SuppressWarnings("null")
@Repository
public class TerceroRepository {

    private final JdbcTemplate jdbcTemplate;

    public TerceroRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // ── MAPPERS ──────────────────────────────────────────────────────

    private final RowMapper<Tercero> terceroMapper = (rs, rowNum) -> new Tercero(
        rs.getLong("id_clipro"),
        rs.getString("nombre"),
        rs.getString("dni_cuit"),
        rs.getString("telefono"),
        rs.getString("email"),
        rs.getString("localidad"),
        rs.getString("tipo")
    );

    // ── TERCERO ───────────────────────────────────────────────────────
    
    public Optional<Tercero> findById(Long id) {
        return jdbcTemplate.query(
                "SELECT id_clipro, nombre, dni_cuit, telefono, email, localidad, tipo FROM clientes_proveedores WHERE id_clipro = ?",
                terceroMapper,
                id
        ).stream().findFirst();
    }

    // ── LISTADO DE TERCEROS ───────────────────────────────────────────

    public List<Tercero> findAllActive() {
        return jdbcTemplate.query(
                "SELECT id_clipro, nombre, dni_cuit, telefono, email, localidad, tipo FROM clientes_proveedores WHERE estado='E' ORDER BY nombre ASC",
                terceroMapper
        );
    }

    public List<Tercero> findAllInactive() {
        return jdbcTemplate.query(
                "SELECT id_clipro, nombre, dni_cuit, telefono, email, localidad, tipo FROM clientes_proveedores WHERE estado='N' ORDER BY nombre ASC",
                terceroMapper
        );
    }

    // ── ALTA ─────────────────────────────────────────────────────────

    public void insert(Tercero tercero) {
        jdbcTemplate.update(
                "INSERT INTO clientes_proveedores (nombre, dni_cuit, telefono, email, localidad, tipo) VALUES (?, ?, ?, ?, ?, ?)",
                tercero.getNombre(), tercero.getDni_cuit(), tercero.getTelefono(),
                tercero.getEmail(), tercero.getLocalidad(), tercero.getTipo()
        );
    }

    // ── EDICIÓN ──────────────────────────────────────────────────────

    public void update(Tercero tercero) {
        jdbcTemplate.update(
                "UPDATE clientes_proveedores SET nombre = ?, dni_cuit = ?, telefono = ?, email = ?, localidad = ?, tipo = ? WHERE id_clipro = ?",
                tercero.getNombre(), tercero.getDni_cuit(), tercero.getTelefono(),
                tercero.getEmail(), tercero.getLocalidad(), tercero.getTipo(),
                tercero.getId()
        );
    }

    // ── VERIFICAR DUPLICADO ──────────────────────────────────────────

    public boolean existsByDni(String dniCuit) {
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM clientes_proveedores WHERE dni_cuit = ?",
                Integer.class,
                dniCuit
        );
        return count != null && count > 0;
    }

    // ── REACTIVACIÓN ────────────────────────────────────────────────

    public int reactivateTercero(Long id) {
        return jdbcTemplate.update(
                "UPDATE clientes_proveedores SET estado = 'E' WHERE id_clipro = ?", id);
    }

    // ── BAJA ─────────────────────────────────────────────────────────

    public void delete(Long id) {
        jdbcTemplate.update("UPDATE clientes_proveedores SET estado = 'N' WHERE id_clipro = ?", id);
    }
}