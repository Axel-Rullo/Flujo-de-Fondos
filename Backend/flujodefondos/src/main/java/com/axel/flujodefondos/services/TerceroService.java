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

    public List<Tercero> listAllActive() {
        return terceroRepository.findAllActive();
    }

    public List<Tercero> listAllInactive() {
        return terceroRepository.findAllInactive();
    }

    // ── ALTA ─────────────────────────────────────────────────────────

    public boolean createTercero(Tercero tercero) {
        if (tercero.getDni_cuit() != null && !tercero.getDni_cuit().isEmpty() && terceroRepository.existsByDni(tercero.getDni_cuit())) {
            return false;
        }
        terceroRepository.insert(tercero);
        return true;
    }

    public void reactiveTercero(Long id) {
        terceroRepository.reactivateTercero(id);
    }

    // ── EDICIÓN ──────────────────────────────────────────────────────

    public void updateTercero(Tercero tercero) {
        terceroRepository.update(tercero);
    }

    // ── BAJA ─────────────────────────────────────────────────────────

    public void deleteTercero(Long id) {
        terceroRepository.delete(id);
    }
}