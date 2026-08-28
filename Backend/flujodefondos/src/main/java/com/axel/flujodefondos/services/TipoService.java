package com.axel.flujodefondos.services;

import com.axel.flujodefondos.entities.Tipo;
import com.axel.flujodefondos.repositories.TipoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TipoService {

    private final TipoRepository tipoRepository;

    public List<Tipo> listAll() {
        return tipoRepository.findAll();
    }

    public Long createTipo(String nombre) {
        return tipoRepository.insert(nombre);
    }
}
