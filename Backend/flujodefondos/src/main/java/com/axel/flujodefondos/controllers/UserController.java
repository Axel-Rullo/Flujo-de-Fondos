package com.axel.flujodefondos.controllers;

import com.axel.flujodefondos.entities.Sucursal;
import com.axel.flujodefondos.entities.User;
import com.axel.flujodefondos.repositories.SucursalRepository;
import com.axel.flujodefondos.services.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final SucursalRepository sucursalRepository;

    // ── LISTADO ──────────────────────────────────────────────────────

    @PostMapping("/user/list")
    public List<User> listUsers(@RequestBody Map<String, Object> body) {
        return userService.listUsers((String) body.get("estado"), (String) body.get("busqueda"), (int) body.get("limit"), (int) body.get("offset"));
    }

    // ── ALTA ─────────────────────────────────────────────────────────

    @PostMapping("/user/new")
    public ResponseEntity<Map<String, Object>> newUser(@RequestBody User user) {
        if (!userService.createUser(user)) {
            return ResponseEntity.ok(Map.of("ok", false, "mensaje", "El dni ingresado ya existe"));
        }
        return ResponseEntity.ok(Map.of("ok", true));
    }

    // ── REACTIVACION ─────────────────────────────────────────────────

    @PostMapping("/user/reactive")
    public ResponseEntity<Map<String, Object>> reactiveUser(@RequestBody Map<String, Long> body) {
        userService.reactiveUser(body.get("id"));
        return ResponseEntity.ok(Map.of("ok", true));
    }

    // ── EDICIÓN ──────────────────────────────────────────────────────

    @PostMapping("/user/edit")
    public ResponseEntity<Map<String, Object>> editUser(@RequestBody User user) {
        userService.updateUser(user);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    // ── BAJA ─────────────────────────────────────────────────────────

    @PostMapping("/user/delete")
    public ResponseEntity<Map<String, Object>> deleteUser(@RequestBody Map<String, Long> body) {
        userService.deleteUser(body.get("id"));
        return ResponseEntity.ok(Map.of("ok", true));
    }

    // ── FOTO ─────────────────────────────────────────────────────────

    @PostMapping("/user/photo")
    public Map<String, String> uploadPhoto(
            @RequestParam("photo") MultipartFile photo,
            @RequestParam(value = "oldPhoto", required = false) String oldPhoto) {
        return Map.of("photo", userService.savePhoto(photo, oldPhoto));
    }


    // ── SUCURSALES ───────────────────────────────────────────────────

    @GetMapping("/sucursal/list")
    public List<Sucursal> listSucursales() {
        return sucursalRepository.findAll();
    }
}
