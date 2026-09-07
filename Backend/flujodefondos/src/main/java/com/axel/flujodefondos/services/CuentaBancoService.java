package com.axel.flujodefondos.services;

import com.axel.flujodefondos.entities.CuentaBanco;
import com.axel.flujodefondos.repositories.CuentaBancoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CuentaBancoService {

    private final CuentaBancoRepository cuentaBancoRepository;

    public List<CuentaBanco> findAllCuentas() {
        return cuentaBancoRepository.findAllCuentas();
    }

    public List<CuentaBanco> findAllBancos() {
        return cuentaBancoRepository.findAllBancos();
    }

    public void insertCuenta(String nombre) {
        if (cuentaBancoRepository.findCuentaByNombre(nombre) != null) {
            throw new RuntimeException("La cuenta ya existe");
        }
        cuentaBancoRepository.insertCuenta(nombre);
    }

    public void insertBanco(String nombre) {
        if (cuentaBancoRepository.findBancoByNombre(nombre) != null) {
            throw new RuntimeException("El banco ya existe");
        }
        cuentaBancoRepository.insertBanco(nombre);
    }
}