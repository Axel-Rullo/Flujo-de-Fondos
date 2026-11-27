package com.axel.flujodefondos.controllers;

import org.springframework.boot.SpringApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ShutdownController {

    private final ApplicationContext context;

    @PostMapping("/shutdown")
    public ResponseEntity<Map<String, Object>> shutdown() {
        new Thread(() -> {
            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            int exitCode = SpringApplication.exit(context, () -> 0);
            System.exit(exitCode);
        }).start();

        return ResponseEntity.ok(Map.of("ok", true, "mensaje", "Apagando servidor..."));
    }
}
