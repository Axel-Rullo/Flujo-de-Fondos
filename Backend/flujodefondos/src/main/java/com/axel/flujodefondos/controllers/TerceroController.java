package com.axel.flujodefondos.controllers;

import com.axel.flujodefondos.entities.Tercero;
import com.axel.flujodefondos.services.TerceroService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class TerceroController {

    private final TerceroService terceroService;

    // ── LISTADO ──────────────────────────────────────────────────────

    @GetMapping("/tercero/list/active")
    public List<Tercero> listAllActive() {
        return terceroService.listAllActive();
    }

    @GetMapping("/tercero/list/inactive")
    public List<Tercero> listAllInactive() {
        return terceroService.listAllInactive();
    }

    // ── ALTA ─────────────────────────────────────────────────────────

    @PostMapping("/tercero/new")
    public ResponseEntity<Map<String, Object>> newTercero(@RequestBody Tercero tercero) {
        if (!terceroService.createTercero(tercero)) {
            return ResponseEntity.ok(Map.of("ok", false, "mensaje", "El DNI/CUIT ingresado ya existe"));
        }
        return ResponseEntity.ok(Map.of("ok", true));
    }

    // ── REACTIVACION ─────────────────────────────────────────────────

    @PostMapping("/tercero/reactive")
    public ResponseEntity<Map<String, Object>> reactiveTercero(@RequestBody Map<String, Long> body) {
        terceroService.reactiveTercero(body.get("id"));
        return ResponseEntity.ok(Map.of("ok", true));
    }

    // ── EDICIÓN ──────────────────────────────────────────────────────

    @PostMapping("/tercero/edit")
    public ResponseEntity<Map<String, Object>> editTercero(@RequestBody Tercero tercero) {
        terceroService.updateTercero(tercero);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    // ── BAJA ─────────────────────────────────────────────────────────

    @PostMapping("/tercero/delete")
    public ResponseEntity<Map<String, Object>> deleteTercero(@RequestBody Map<String, Long> body) {
        terceroService.deleteTercero(body.get("id"));
        return ResponseEntity.ok(Map.of("ok", true));
    }
}