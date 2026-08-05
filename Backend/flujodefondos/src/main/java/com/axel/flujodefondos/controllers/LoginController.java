package com.axel.flujodefondos.controllers;

import com.axel.flujodefondos.entities.User;
import com.axel.flujodefondos.services.LoginService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class LoginController {

    private final LoginService loginService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody User user) {

        Optional<User> logueado = loginService.login(
            user.getUsuario(),
            user.getPassword()
        );

        if (logueado.isPresent()) {
            return ResponseEntity.ok(Map.of("ok", true, "usuario", logueado.get()));
        }

        return ResponseEntity.ok(Map.of("ok", false, "mensaje", "Usuario o contraseña incorrectos"));
    }
}