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

    public List<Concepto> listAll() {
        return conceptoRepository.findAll();
    }

    public Long createConcepto(Concepto concepto) {
        return conceptoRepository.insert(concepto);
    }
}