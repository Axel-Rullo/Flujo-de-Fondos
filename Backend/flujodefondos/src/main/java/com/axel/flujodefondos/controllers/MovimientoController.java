package com.axel.flujodefondos.controllers;

import com.axel.flujodefondos.entities.Movimiento;
import com.axel.flujodefondos.services.MovimientoService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class MovimientoController {

}