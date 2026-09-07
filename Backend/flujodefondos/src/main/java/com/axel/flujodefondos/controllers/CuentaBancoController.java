package com.axel.flujodefondos.controllers;

import com.axel.flujodefondos.entities.CuentaBanco;
import com.axel.flujodefondos.services.CuentaBancoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CuentaBancoController {

    private final CuentaBancoService cuentaBancoService;

    @GetMapping("/cuentas/list")
    public List<CuentaBanco> findAllCuentas() {
        return cuentaBancoService.findAllCuentas();
    }

    @GetMapping("/bancos/list")
    public List<CuentaBanco> findAllBancos() {
        return cuentaBancoService.findAllBancos();
    }

    @PostMapping("/cuentas/new")
    public Map<String, Object> insertCuenta(@RequestBody CuentaBanco cuentabanco) {
        try {
            cuentaBancoService.insertCuenta(cuentabanco.getNombre());
            return Map.of("ok", true);
        } catch (RuntimeException e) {
            return Map.of("ok", false, "mensaje", e.getMessage());
        }
    }

    @PostMapping("/bancos/new")
    public Map<String, Object> insertBanco(@RequestBody CuentaBanco cuentabanco) {
        try {
            cuentaBancoService.insertBanco(cuentabanco.getNombre());
            return Map.of("ok", true);
        } catch (RuntimeException e) {
            return Map.of("ok", false, "mensaje", e.getMessage());
        }
    }
}