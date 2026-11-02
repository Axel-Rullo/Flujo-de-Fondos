package com.axel.flujodefondos.controllers;

import com.axel.flujodefondos.entities.Tercero;
import com.axel.flujodefondos.services.TerceroService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tercero")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class TerceroController {

    private final TerceroService terceroService;

    // ── LISTADO ──────────────────────────────────────────────────────

    @GetMapping("/list/names")
    public List<Tercero> findAllTercerosNames() {
        return terceroService.findAllTercerosNames();
    }

    @GetMapping("/list")
    public List<Tercero> listTerceros(
            @RequestParam(defaultValue = "E") String estado,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "50") int limit,
            @RequestParam(defaultValue = "0") int offset) {
        return terceroService.listTerceros(estado, search, limit, offset);
    }

    // ── ALTA ─────────────────────────────────────────────────────────

    @PostMapping("/new")
    public ResponseEntity<Map<String, Object>> newTercero(@RequestBody Tercero tercero) {
        return toResponse(terceroService.createTercero(tercero));
    }

    // ── REACTIVACION ─────────────────────────────────────────────────

    @PostMapping("/reactive")
    public ResponseEntity<Map<String, Object>> reactiveTercero(@RequestBody Map<String, Long> body) {
        terceroService.reactiveTercero(body.get("id"));
        return ResponseEntity.ok(Map.of("ok", true));
    }

    // ── EDICIÓN ──────────────────────────────────────────────────────

    @PostMapping("/edit")
    public ResponseEntity<Map<String, Object>> editTercero(@RequestBody Tercero tercero) {
        return toResponse(terceroService.updateTercero(tercero));
    }

    // ── BAJA ─────────────────────────────────────────────────────────

    @PostMapping("/delete")
    public ResponseEntity<Map<String, Object>> deleteTercero(@RequestBody Map<String, Long> body) {
        terceroService.deleteTercero(body.get("id"));
        return ResponseEntity.ok(Map.of("ok", true));
    }

    // ── RESPUESTA ────────────────────────────────────────────────────

    private ResponseEntity<Map<String, Object>> toResponse(String error) {
        if (error != null) {
            return ResponseEntity.ok(Map.of("ok", false, "mensaje", error));
        }
        return ResponseEntity.ok(Map.of("ok", true));
    }
}
