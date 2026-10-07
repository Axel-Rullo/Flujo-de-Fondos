package com.axel.flujodefondos.controllers;

import com.axel.flujodefondos.entities.Cheque;
import com.axel.flujodefondos.services.ChequeService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ChequeController {

    private final ChequeService chequeService;

    // ── ALTA ─────────────────────────────────────────────────────────

    @PostMapping("/cheques/propios/emision")
    public ResponseEntity<Map<String, Object>> newChequePropio(@RequestBody Cheque cheque) {
        chequeService.createChequePropio(cheque);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    @PostMapping("/cheques/terceros/emision")
    public ResponseEntity<Map<String, Object>> newChequeTercero(@RequestBody Cheque cheque) {
        chequeService.createChequeTercero(cheque);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    // ── RESUMEN ───────────────────────────────────────────────────────

    @GetMapping("/cheques/totales")
    public List<Cheque> findAllTotales() {
        return chequeService.findAllTotales();
    }

    // ── RESUMEN PRÓXIMOS 7 DÍAS (DESDE MAÑANA) ────────────────────────

    @GetMapping("/cheques/resumen_semanal")
    public List<Map<String, Object>> resumenProximosDias() {
        return chequeService.resumenProximosDias();
    }

    // ── LISTADO ──────────────────────────────────────────────────────

    @PostMapping("/cheques/propios/list")
    public List<Cheque> listAllPropios(@RequestBody Cheque cheque) {
        return chequeService.listAllPropios(cheque.getEstado(), cheque.getBusqueda(), cheque.getLimit(), cheque.getOffset());
    }

    @PostMapping("/cheques/terceros/list")
    public List<Cheque> listAllTerceros(@RequestBody Cheque cheque) {
        return chequeService.listAllTerceros(cheque.getEstado(), cheque.getBusqueda(), cheque.getLimit(), cheque.getOffset());
    }

    // ── HISTORIAL ────────────────────────────────────────────────────

    @PostMapping("/cheques/propios/bajas")
    public List<Cheque> listBajasPropios(@RequestBody Cheque cheque) {
        return chequeService.listBajasPropios(cheque.getEstado(), cheque.getBusqueda(), cheque.getLimit(), cheque.getOffset());
    }

    @PostMapping("/cheques/terceros/bajas")
    public List<Cheque> listBajasTerceros(@RequestBody Cheque cheque) {
        return chequeService.listBajasTerceros(cheque.getEstado(), cheque.getBusqueda(), cheque.getLimit(), cheque.getOffset());
    }

    // ── DETALLE ──────────────────────────────────────────────────────

    @PostMapping("/cheques/detalle")
    public Cheque getCheque(@RequestBody Cheque cheque) {
        return chequeService.getCheque(cheque.getId_cheque());
    }

    // ── IMPUTACIÓN ───────────────────────────────────────────────────

    @PostMapping("/cheques/propios/imputar")
    public ResponseEntity<Map<String, Object>> imputarChequePropio(@RequestBody Cheque cheque) {
        chequeService.imputarChequePropio(cheque);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    @PostMapping("/cheques/terceros/imputar")
    public ResponseEntity<Map<String, Object>> imputarChequeTercero(@RequestBody Cheque cheque) {
        chequeService.imputarChequeTercero(cheque);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    // ── RECHAZO ──────────────────────────────────────────────────────

    @PostMapping("/cheques/rechazar")
    public ResponseEntity<Map<String, Object>> rechazarCheque(@RequestBody Cheque cheque) {
        chequeService.rechazarCheque(cheque);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    // ── ANULACION ────────────────────────────────────────────────────

    @PostMapping("/cheques/anular")
    public ResponseEntity<Map<String, Object>> anularCheque(@RequestBody Cheque cheque) {
        chequeService.anularCheque(cheque);
        return ResponseEntity.ok(Map.of("ok", true));
    }
}