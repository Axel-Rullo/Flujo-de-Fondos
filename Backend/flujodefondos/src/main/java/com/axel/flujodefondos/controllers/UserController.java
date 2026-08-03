// UserController.java
package com.axel.flujodefondos.controllers;

import com.axel.flujodefondos.entities.Sucursal;
import com.axel.flujodefondos.entities.User;
import com.axel.flujodefondos.repositories.SucursalRepository;
import com.axel.flujodefondos.services.UserService;

import com.axel.flujodefondos.services.FileStorageService;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
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
    private final FileStorageService fileStorageService;

    // ── LISTADO ──────────────────────────────────────────────────────

    @GetMapping("/user/list/active")
    public List<User> listAllActive() {
        return userService.listAllActive();
    }
    
    @GetMapping("/user/list/inactive")
    public List<User> listAllInactive() {
        return userService.listAllInactive();
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
    public void reactiveUser(@RequestBody Map<String, Long> body) {
        userService.reactiveUser(body.get("id"));
    }

    // ── EDICIÓN ──────────────────────────────────────────────────────

    @PostMapping("/user/edit")
    public void editUser(@RequestBody User user) {
        userService.updateUser(user);
    }

    // ── BAJA ─────────────────────────────────────────────────────────

    @PostMapping("/user/delete")
    public void deleteUser(@RequestBody Map<String, Long> body) {
        userService.deleteUser(body.get("id"));
    }

    // ── FOTO ─────────────────────────────────────────────────────────

    @PostMapping("/user/photo")
    public Map<String, String> uploadPhoto(
            @RequestParam("photo") MultipartFile photo,
            @RequestParam(value = "oldPhoto", required = false) String oldPhoto) {
        return Map.of("photo", userService.savePhoto(photo, oldPhoto));
    }

    @GetMapping("/uploads/{subfolder}/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String subfolder, @PathVariable String filename) {
        Resource resource = fileStorageService.loadAsResource(subfolder, filename);
        if (resource != null) {
            String contentType = fileStorageService.getContentType(subfolder, filename);
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);
        }
        return ResponseEntity.notFound().build();
    }

    // ── SUCURSALES ───────────────────────────────────────────────────

    @GetMapping("/sucursal/list")
    public List<Sucursal> listSucursales() {
        return sucursalRepository.findAll();
    }
}