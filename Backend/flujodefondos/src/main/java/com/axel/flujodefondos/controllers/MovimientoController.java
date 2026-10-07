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

    @GetMapping("/movimientos/list")
    public List<Movimiento> findAllMovimientos(@RequestParam int limit, @RequestParam int offset) {
        return movimientoService.findAllMovimientos(limit, offset);
    }

    @GetMapping("/operaciones/list")
    public List<Movimiento> findAllOperaciones(@RequestParam int limit, @RequestParam int offset) {
        return movimientoService.findAllOperaciones(limit, offset);
    }

    @PostMapping("/movimientos/new")
    public ResponseEntity<Map<String, Object>> newMovimiento(@RequestBody Movimiento movimiento) {
        movimientoService.createMovimiento(movimiento);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    @GetMapping("/movimientos/saldo_inicial")
    public ResponseEntity<Map<String, Object>> inicializarSaldosDelMes() {
        movimientoService.inicializarSaldosDelMes();
        return ResponseEntity.ok(Map.of("ok", true));
    }

    @PostMapping("/movimientos/reportes/anual")
        public List<Map<String, Object>> ReporteAnual(@RequestBody Map<String, Integer> body) {
            return movimientoService.ReporteAnual(body.get("anio"));
    }

    @PostMapping("/movimientos/reportes/mensual")
        public List<Map<String, Object>> ReporteMensual(@RequestBody Map<String, Integer> body) {
            return movimientoService.ReporteMensual(body.get("mes"), body.get("anio"));
    }
}