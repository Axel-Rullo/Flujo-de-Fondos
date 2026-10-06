package com.axel.flujodefondos.controllers;

import com.axel.flujodefondos.entities.CuentaPropia;
import com.axel.flujodefondos.entities.Banco;
import com.axel.flujodefondos.entities.BancoCliPro;
import com.axel.flujodefondos.services.CuentaBancoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CuentaBancoController {

    private final CuentaBancoService cuentaBancoService;

    private Map<String, Object> error(Exception e) {
        String mensaje = e.getMessage() != null ? e.getMessage() : "Error inesperado";
        return Map.of("ok", false, "mensaje", mensaje);
    }

    @GetMapping("/cuentas/list")
    public List<CuentaPropia> findAllCuentasPropias() {
        return cuentaBancoService.findAllCuentasPropias();
    }

    @GetMapping("/cuentas/list/transacciones_internas")
    public List<CuentaPropia> findAllTransaccionesInternas() {
        return cuentaBancoService.findAllTransaccionesInternas();
    }

    @GetMapping("/bancos/list/names")
    public List<Banco> findAllBancosNames() {
        return cuentaBancoService.findAllBancosNames();
    }

    @GetMapping("/bancos/list/clipros")
    public List<Banco> findAllBancosCliPro() {
        return cuentaBancoService.findAllBancosCliPro();
    }

    @GetMapping("/cuentas/saldo_total")
    public BigDecimal getSaldoTotalCuentas() {
        return cuentaBancoService.getSaldoTotalCuentas();
    }

    @PostMapping("/cuentas/new/cuentapropia")
    public Map<String, Object> insertCuentaPropia(@RequestBody CuentaPropia cuentapropia) {
        try {
            cuentaBancoService.insertCuentaPropia(cuentapropia);
            return Map.of("ok", true);
        } catch (RuntimeException e) {
            return error(e);
        }
    }

    @PostMapping("/cuentas/new/transaccion_interna")
    public Map<String, Object> insertTransaccionInterna(@RequestBody CuentaPropia cuentapropia) {
        try {
            cuentaBancoService.insertTransaccionInterna(cuentapropia);
            return Map.of("ok", true);
        } catch (RuntimeException e) {
            return error(e);
        }
    }

    @PostMapping("/bancos/new/banco")
    public Map<String, Object> insertBanco(@RequestBody Banco banco) {
        try {
            cuentaBancoService.insertBanco(banco.getNombre());
            return Map.of("ok", true);
        } catch (RuntimeException e) {
            return error(e);
        }
    }

    @PostMapping("/bancos/new/clipro")
    public Map<String, Object> insertBancoCliPro(@RequestBody BancoCliPro bancoclipro) {
        try {
            cuentaBancoService.insertBancoCliPro(bancoclipro);
            return Map.of("ok", true);
        } catch (RuntimeException e) {
            return error(e);
        }
    }
}