package com.axel.flujodefondos.controllers;

import com.axel.flujodefondos.entities.ChequePropio;
import com.axel.flujodefondos.entities.ChequeTercero;
import com.axel.flujodefondos.services.ChequeService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ChequeController {

    private final ChequeService chequeService;

    // ── ALTA ─────────────────────────────────────────────────────────

    @PostMapping("/cheque/propio/new")
    public ResponseEntity<Map<String, Object>> newChequePropio(@RequestBody ChequePropio chequePropio) {
        chequeService.createChequePropio(chequePropio);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    @PostMapping("/cheque/tercero/new")
    public ResponseEntity<Map<String, Object>> newChequeTercero(@RequestBody ChequeTercero chequeTercero) {
        chequeService.createChequeTercero(chequeTercero);
        return ResponseEntity.ok(Map.of("ok", true));
    }
}