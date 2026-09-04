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

    @PostMapping("/cheques/propios/new")
    public ResponseEntity<Map<String, Object>> newChequePropio(@RequestBody Cheque cheque) {
        chequeService.createChequePropio(cheque);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    @PostMapping("/cheques/terceros/new")
    public ResponseEntity<Map<String, Object>> newChequeTercero(@RequestBody Cheque cheque) {
        chequeService.createChequeTercero(cheque);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    // ── LISTADO ──────────────────────────────────────────────────────

    @GetMapping("/cheques/propios/list")
    public List<Cheque> listAllPropios() {
        return chequeService.listAllPropios();
    }

    @GetMapping("/cheques/terceros/list")
    public List<Cheque> listAllTerceros() {
        return chequeService.listAllTerceros();
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
}