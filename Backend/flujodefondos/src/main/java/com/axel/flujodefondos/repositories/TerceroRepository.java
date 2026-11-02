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

    private final RowMapper<Tercero> tercerosNamesMapper = (rs, rowNum) -> new Tercero(
        rs.getLong("id_clipro"),
        rs.getString("razon_social"),
        null,
        null,
        null,
        null,
        rs.getString("tipo"),
        null
    );

    private final RowMapper<Tercero> terceroMapper = (rs, rowNum) -> new Tercero(
        rs.getLong("id_clipro"),
        rs.getString("razon_social"),
        rs.getString("dni_cuit"),
        rs.getString("telefono"),
        rs.getString("email"),
        rs.getString("localidad"),
        rs.getString("tipo"),
        null
    );

    // ── TERCERO ───────────────────────────────────────────────────────

    public Optional<Tercero> findById(Long id) {
        return jdbcTemplate.query(
                "SELECT id_clipro, razon_social, dni_cuit, telefono, email, localidad, tipo FROM clientes_proveedores WHERE id_clipro = ?",
                terceroMapper,
                id
        ).stream().findFirst();
    }

    // ── LISTADO DE TERCEROS ───────────────────────────────────────────

    public List<Tercero> findAllTercerosNames() {
        return jdbcTemplate.query(
                "SELECT id_clipro, razon_social, tipo FROM clientes_proveedores WHERE estado='E' ORDER BY razon_social ASC",
                tercerosNamesMapper
        );
    }

    public List<Tercero> findAll(String estado, String search, int limit, int offset) {
        String like = "%" + search + "%";
        return jdbcTemplate.query(
                "SELECT id_clipro, razon_social, dni_cuit, telefono, email, localidad, tipo FROM clientes_proveedores " +
                "WHERE estado = ? AND (razon_social LIKE ? OR dni_cuit LIKE ?) " +
                "ORDER BY razon_social ASC, id_clipro ASC LIMIT ? OFFSET ?",
                terceroMapper,
                estado, like, like, limit, offset
        );
    }

    // ── ALTA ─────────────────────────────────────────────────────────

    public void insert(Tercero tercero) {
        jdbcTemplate.update(
                "INSERT INTO clientes_proveedores (razon_social, dni_cuit, telefono, email, localidad, tipo) VALUES (?, ?, ?, ?, ?, ?)",
                tercero.getRazon_social(), tercero.getDni_cuit(), tercero.getTelefono(),
                tercero.getEmail(), tercero.getLocalidad(), tercero.getTipo()
        );
    }

    // ── EDICIÓN ──────────────────────────────────────────────────────

    public void update(Tercero tercero) {
        jdbcTemplate.update(
                "UPDATE clientes_proveedores SET razon_social = ?, dni_cuit = ?, telefono = ?, email = ?, localidad = ?, tipo = ? WHERE id_clipro = ?",
                tercero.getRazon_social(), tercero.getDni_cuit(), tercero.getTelefono(),
                tercero.getEmail(), tercero.getLocalidad(), tercero.getTipo(),
                tercero.getId_clipro()
        );
    }

    // ── VERIFICAR DUPLICADO ──────────────────────────────────────────

    public boolean existsByDni(String dniCuit, long idExcluir) {
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM clientes_proveedores WHERE dni_cuit = ? AND id_clipro <> ?",
                Integer.class,
                dniCuit, idExcluir
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
