package com.axel.flujodefondos.controllers;

import com.axel.flujodefondos.entities.Movimiento;
import com.axel.flujodefondos.services.MovimientoService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class MovimientoController {
    
    private final MovimientoService movimientoService;

    @GetMapping("/movimiento/list")
    public List<Movimiento> listAll() {
        return movimientoService.listAll();
    }

    @PostMapping("/movimiento/new")
    public ResponseEntity<Map<String, Object>> newMovimiento(@RequestBody Movimiento movimiento) {
        movimientoService.createMovimiento(movimiento);
        return ResponseEntity.ok(Map.of("ok", true));
    }
}