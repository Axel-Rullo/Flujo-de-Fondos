package com.axel.flujodefondos.controllers;

import com.axel.flujodefondos.entities.User;
import com.axel.flujodefondos.services.LoginService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class LoginController {

    private final LoginService loginService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody User user) {

        boolean valido = loginService.validar(
            user.getUsuario(),
            user.getPassword()
        );

        if (valido) {
            return ResponseEntity.ok(Map.of("ok", true));
        }

        return ResponseEntity.ok(Map.of("ok", false, "mensaje", "Usuario o contraseña incorrectos"));
    }
}