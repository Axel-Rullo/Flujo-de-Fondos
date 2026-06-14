package com.axel.flujodefondos.services;

import com.axel.flujodefondos.entities.User;
import com.axel.flujodefondos.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LoginService {

    @Autowired
    private UserRepository userRepository;

    public boolean validar(String usuario, String password) {
        Optional<User> userOpt = userRepository.findByUsuario(usuario);
        if (userOpt.isPresent()) {
            return userOpt.get().getPassword().equals(password);
        }
        return false;
    }
}
