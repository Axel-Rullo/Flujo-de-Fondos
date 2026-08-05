package com.axel.flujodefondos.services;

import com.axel.flujodefondos.entities.User;
import com.axel.flujodefondos.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LoginService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public Optional<User> login(String user, String password) {
        return userRepository.findByUsuario(user)
                .filter(u -> passwordEncoder.matches(password, u.getPassword()))
                .flatMap(u -> userRepository.findById(String.valueOf(u.getId())));
    }
}