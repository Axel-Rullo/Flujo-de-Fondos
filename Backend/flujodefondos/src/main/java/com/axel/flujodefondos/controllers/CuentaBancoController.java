package com.axel.flujodefondos.controllers;

import com.axel.flujodefondos.entities.CuentaPropia;
import com.axel.flujodefondos.entities.Banco;
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
    public List<CuentaPropia> findAllCuentasPropias() {
        return cuentaBancoService.findAllCuentasPropias();
    }

    @GetMapping("/bancos/list")
    public List<Banco> findAllBancos() {
        return cuentaBancoService.findAllBancos();
    }

    @PostMapping("/cuentas/new")
    public Map<String, Object> insertCuentaPropia(@RequestBody CuentaPropia cuentapropia) {
        try {
            cuentaBancoService.insertCuentaPropia(cuentapropia);
            return Map.of("ok", true);
        } catch (RuntimeException e) {
            return Map.of("ok", false, "mensaje", e.getMessage());
        }
    }

    @PostMapping("/bancos/new")
    public Map<String, Object> insertBanco(@RequestBody Banco banco) {
        try {
            cuentaBancoService.insertBanco(banco.getNombre());
            return Map.of("ok", true);
        } catch (RuntimeException e) {
            return Map.of("ok", false, "mensaje", e.getMessage());
        }
    }
}