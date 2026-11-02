package com.axel.flujodefondos.services;

import com.axel.flujodefondos.entities.Tercero;
import com.axel.flujodefondos.repositories.TerceroRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TerceroService {

    private final TerceroRepository terceroRepository;

    // ── LISTADOS ──────────────────────────────────────────────────────

    public List<Tercero> findAllTercerosNames() {
        return terceroRepository.findAllTercerosNames();
    }

    public List<Tercero> listTerceros(String estado, String search, int limit, int offset) {
        return terceroRepository.findAll(estado, search, limit, offset);
    }

    // ── VALIDACIÓN ───────────────────────────────────────────────────

    // Devuelve el mensaje de error, o null si el DNI/CUIT no está repetido
    private String validateDni(Tercero tercero, long idExcluir) {
        if (terceroRepository.existsByDni(tercero.getDni_cuit(), idExcluir)) return "El DNI/CUIT ingresado ya existe";
        return null;
    }

    // ── ALTA ─────────────────────────────────────────────────────────

    public String createTercero(Tercero tercero) {
        String error = validateDni(tercero, 0);
        if (error == null) terceroRepository.insert(tercero);
        return error;
    }

    public void reactiveTercero(Long id) {
        terceroRepository.reactivateTercero(id);
    }

    // ── EDICIÓN ──────────────────────────────────────────────────────

    public String updateTercero(Tercero tercero) {
        String error = validateDni(tercero, tercero.getId_clipro());
        if (error == null) terceroRepository.update(tercero);
        return error;
    }

    // ── BAJA ─────────────────────────────────────────────────────────

    public void deleteTercero(Long id) {
        terceroRepository.delete(id);
    }
}
