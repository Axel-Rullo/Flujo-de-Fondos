package com.axel.flujodefondos.services;

import com.axel.flujodefondos.entities.Movimiento;
import com.axel.flujodefondos.repositories.MovimientoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MovimientoService {
    
    private final MovimientoRepository movimientoRepository;

    public List<Movimiento> listAll() {
        return movimientoRepository.findAll();
    }

    public Long createMovimiento(Movimiento movimiento) {
        return movimientoRepository.insert(movimiento);
    }
}
