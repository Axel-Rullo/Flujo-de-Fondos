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

    @PostMapping("/movimientos/list")
    public List<Movimiento> findAllMovimientos(@RequestBody Map<String, Integer> body) {
        return movimientoService.findAllMovimientos(body.get("limit"), body.get("offset"));
    }

    @PostMapping("/operaciones/list")
    public List<Movimiento> findAllOperaciones(@RequestBody Map<String, Integer> body) {
        return movimientoService.findAllOperaciones(body.get("limit"), body.get("offset"));
    }

    @PostMapping("/movimientos/filtro")
    public List<Movimiento> filtroMovimientos(@RequestBody Map<String, Object> body) {
        return movimientoService.filtroMovimientos(
            (String) body.get("desde"), (String) body.get("hasta"),
            (Integer) body.get("id_concepto"),
            (Integer) body.get("limit"), (Integer) body.get("offset"));
    }

    @GetMapping("/movimientos/totales")
    public Map<String, Object> mostrarTotales() {
        return movimientoService.mostrarTotales();
    }

    @PostMapping("/movimientos/new")
    public ResponseEntity<Map<String, Object>> newMovimiento(@RequestBody Movimiento movimiento) {
        try {
            movimientoService.createMovimiento(movimiento);
            return ResponseEntity.ok(Map.of("ok", true));
        } catch (RuntimeException e) {
            return ResponseEntity.ok(Map.of("ok", false, "mensaje", e.getMessage()));
        }
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
    public List<Map<String, Object>> ReporteMensual(@RequestBody Map<String, String> body) {
        return movimientoService.ReporteMensual(body.get("desde"), body.get("hasta"));
    }
}