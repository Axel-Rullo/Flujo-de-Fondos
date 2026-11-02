package com.axel.flujodefondos.controllers;

import com.axel.flujodefondos.entities.Cheque;
import com.axel.flujodefondos.services.ChequeService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cheques")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ChequeController {

    private final ChequeService chequeService;

    // ── ALTA ─────────────────────────────────────────────────────────

    @PostMapping("/propios/emision")
    public ResponseEntity<Map<String, Object>> newChequePropio(@RequestBody Cheque cheque) {
        chequeService.createChequePropio(cheque);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    @PostMapping("/terceros/emision")
    public ResponseEntity<Map<String, Object>> newChequeTercero(@RequestBody Cheque cheque) {
        chequeService.createChequeTercero(cheque);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    // ── RESUMEN ───────────────────────────────────────────────────────

    @GetMapping("/totales")
    public List<Cheque> findAllTotales() {
        return chequeService.findAllTotales();
    }

    // ── RESUMEN PRÓXIMOS 7 DÍAS (DESDE MAÑANA) ────────────────────────

    @GetMapping("/resumen_semanal")
    public List<Map<String, Object>> resumenProximosDias() {
        return chequeService.resumenProximosDias();
    }

    // ── AUTOMATIZADOS ────────────────────────────────────────────────

    @GetMapping("/automatizados")
    public List<Cheque> listAutomatizados() {
        return chequeService.listAutomatizados();
    }

    // ── IMPUTACIÓN AUTOMÁTICA DE CHEQUES PROPIOS ─────────────────────

    @PostMapping("/propios/imputar_vencidos")
    public ResponseEntity<Map<String, Object>> imputarChequesPropiosVencidos() {
        chequeService.imputarChequesPropiosVencidos();
        return ResponseEntity.ok(Map.of("ok", true));
    }

    // ── CARTERA ──────────────────────────────────────────────────────

    @PostMapping("/cartera")
    public List<Cheque> listCartera(@RequestBody Cheque cheque) {
        return chequeService.listCartera(cheque.getBusqueda(), cheque.getLimit(), cheque.getOffset());
    }

    // ── HISTORIAL ────────────────────────────────────────────────────

    @PostMapping("/historial")
    public List<Cheque> listHistorial(@RequestBody Cheque cheque) {
        return chequeService.listHistorial(cheque.getEstado(), cheque.getBusqueda(), cheque.getLimit(), cheque.getOffset());
    }

    // ── DETALLE ──────────────────────────────────────────────────────

    @PostMapping("/detalle")
    public Cheque getCheque(@RequestBody Cheque cheque) {
        return chequeService.getCheque(cheque.getId_cheque());
    }

    // ── IMPUTACIÓN ───────────────────────────────────────────────────

    @PostMapping("/propios/imputar")
    public ResponseEntity<Map<String, Object>> imputarChequePropio(@RequestBody Cheque cheque) {
        chequeService.imputarChequePropio(cheque);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    @PostMapping("/terceros/imputar")
    public ResponseEntity<Map<String, Object>> imputarChequeTercero(@RequestBody Cheque cheque) {
        chequeService.imputarChequeTercero(cheque);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    // ── RECHAZO ──────────────────────────────────────────────────────

    @PostMapping("/rechazar")
    public ResponseEntity<Map<String, Object>> rechazarCheque(@RequestBody Cheque cheque) {
        chequeService.rechazarCheque(cheque);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    // ── ANULACION ────────────────────────────────────────────────────

    @PostMapping("/anular")
    public ResponseEntity<Map<String, Object>> anularCheque(@RequestBody Cheque cheque) {
        chequeService.anularCheque(cheque);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    // ── ERRORES ──────────────────────────────────────────────────────

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, Object>> handleError(IllegalStateException e) {
        return ResponseEntity.ok(Map.of("ok", false, "mensaje", e.getMessage()));
    }
}
