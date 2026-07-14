package com.axel.flujodefondos.controllers;

import com.axel.flujodefondos.entities.User;
import com.axel.flujodefondos.services.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/user/list")
    public List<User> listAllUsers() {
        return userService.listAll();
    }
}