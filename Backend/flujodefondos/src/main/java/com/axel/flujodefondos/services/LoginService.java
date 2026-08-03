package com.axel.flujodefondos.services;

import com.axel.flujodefondos.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LoginService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public boolean login(String user, String password) {
        return userRepository.findByUsuario(user)
                .map(u -> passwordEncoder.matches(password, u.getPassword()))
                .orElse(false);
    }
}