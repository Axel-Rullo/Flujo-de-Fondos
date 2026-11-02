package com.axel.flujodefondos.controllers;

import com.axel.flujodefondos.entities.Concepto;
import com.axel.flujodefondos.services.ConceptoService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/concepto")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ConceptoController {

    private final ConceptoService conceptoService;

    @GetMapping("/list")
    public List<Concepto> findAll() {
        return conceptoService.findAll();
    }

    @PostMapping("/new")
    public ResponseEntity<Map<String, Object>> newConcepto(@RequestBody Concepto concepto) {
        try {
            conceptoService.insert(concepto);
            return ResponseEntity.ok(Map.of("ok", true));
        } catch (RuntimeException e) {
            return ResponseEntity.ok(Map.of("ok", false, "mensaje", e.getMessage()));
        }
    }

    @PostMapping("/edit")
    public ResponseEntity<Map<String, Object>> editConcepto(@RequestBody Concepto concepto) {
        conceptoService.update(concepto);
        return ResponseEntity.ok(Map.of("ok", true));
    }
}