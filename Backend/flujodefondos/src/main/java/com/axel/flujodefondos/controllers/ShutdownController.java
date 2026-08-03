package com.axel.flujodefondos.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ShutdownController {

    @PostMapping("/shutdown")
    public ResponseEntity<Map<String, Object>> shutdown() {
        new Thread(() -> {
            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            System.exit(0);
        }).start();

        return ResponseEntity.ok(Map.of("ok", true, "mensaje", "Apagando servidor..."));
    }
}
