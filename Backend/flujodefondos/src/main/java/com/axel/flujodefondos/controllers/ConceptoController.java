package com.axel.flujodefondos.controllers;

import com.axel.flujodefondos.entities.Concepto;
import com.axel.flujodefondos.services.ConceptoService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ConceptoController {

    private final ConceptoService conceptoService;

    @GetMapping("/concepto/list")
    public List<Concepto> listAll() {
        return conceptoService.listAll();
    }

    @PostMapping("/concepto/new")
    public ResponseEntity<Map<String, Object>> newConcepto(@RequestBody Concepto concepto) {
        conceptoService.createConcepto(concepto);
        return ResponseEntity.ok(Map.of("ok", true));
    }
}