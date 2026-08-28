package com.axel.flujodefondos.controllers;

import com.axel.flujodefondos.entities.Tipo;
import com.axel.flujodefondos.services.TipoService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class TipoController {

    private final TipoService tipoService;

    @GetMapping("/tipo/list")
    public List<Tipo> listAll() {
        return tipoService.listAll();
    }

    @PostMapping("/tipo/new")
    public ResponseEntity<Map<String, Object>> newTipo(@RequestBody Tipo tipo) {
        tipoService.createTipo(tipo.getNombre());
        return ResponseEntity.ok(Map.of("ok", true));
    }
}
