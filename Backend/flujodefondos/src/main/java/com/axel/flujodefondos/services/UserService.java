// UserService.java
package com.axel.flujodefondos.services;

import com.axel.flujodefondos.entities.User;
import com.axel.flujodefondos.repositories.UserRepository;
import com.axel.flujodefondos.repositories.SucursalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final SucursalRepository sucursalRepository;
    private final PasswordEncoder passwordEncoder;
    private final FileStorageService fileStorageService;

    private void processSucursal(User user) {
        if (user.getSucursalNombre() != null && !user.getSucursalNombre().isBlank()) {
            String nombre = user.getSucursalNombre().trim();
            Long sucursalId = sucursalRepository.findIdByNombre(nombre);
            if (sucursalId == null) {
                sucursalId = sucursalRepository.insert(nombre);
            }
            user.setId_sucursal(String.valueOf(sucursalId));
        } else {
            user.setId_sucursal(null);
        }
    }

    // ── LISTADOS ──────────────────────────────────────────────────────

    public List<User> listAllActive() {
        return userRepository.findAllActive();
    }

    public List<User> listAllInactive() {
        return userRepository.findAllInactive();
    }

    // ── ALTA ─────────────────────────────────────────────────────────

    public boolean createUser(User user) {
        if (userRepository.existsByDni(user.getDni())) {
            return false;
        }
        processSucursal(user);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.insertUser(user);
        return true;
    }

    public void reactiveUser(Long id) {
        userRepository.reactivateUser(id);
    }

    // ── EDICIÓN ──────────────────────────────────────────────────────

    public void updateUser(User user) {
        processSucursal(user);
        if (user.getPassword() != null && !user.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        } else {
            user.setPassword(null);
        }
        userRepository.updateUser(user);
    }

    // ── BAJA ─────────────────────────────────────────────────────────

    public void deleteUser(Long id) {
        userRepository.deleteUser(id);
    }

    // ── FOTO ─────────────────────────────────────────────────────────

    public String savePhoto(MultipartFile photo, String oldPhotoUrl) {
        return fileStorageService.store(photo, "profiles", oldPhotoUrl);
    }
}