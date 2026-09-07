package com.axel.flujodefondos.services;

import com.axel.flujodefondos.entities.Concepto;
import com.axel.flujodefondos.repositories.ConceptoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ConceptoService {

    private final ConceptoRepository conceptoRepository;

    // ── LISTADO ──────────────────────────────────────────────────────

    public List<Concepto> findAll() {
        return conceptoRepository.findAll();
    }

    // ── ALTA ─────────────────────────────────────────────────────────

    public void insert(Concepto concepto) {
    if (conceptoRepository.findConceptoByNombre(concepto.getNombre()) != null) {
        throw new RuntimeException("La cuenta ya existe");
    }
    Integer count = conceptoRepository.countByClasificacion(concepto.getClasificacion());
    concepto.setCodigo(concepto.getClasificacion() + "." + (count + 1));
    conceptoRepository.insert(concepto);
    }

    // ── MODIFICACIÓN ─────────────────────────────────────────────────

    public void update(Concepto concepto) {
        conceptoRepository.update(concepto);
    }
}