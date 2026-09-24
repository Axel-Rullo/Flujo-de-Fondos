package com.axel.flujodefondos.services;

import com.axel.flujodefondos.entities.CuentaPropia;
import com.axel.flujodefondos.entities.Banco;
import com.axel.flujodefondos.entities.BancoCliPro;
import com.axel.flujodefondos.repositories.CuentaBancoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CuentaBancoService {

    private final CuentaBancoRepository cuentaBancoRepository;

    public List<CuentaPropia> findAllCuentasPropias() {
        return cuentaBancoRepository.findAllCuentasPropias();
    }

    public List<Banco> findAllBancosNames() {
        return cuentaBancoRepository.findAllBancosNames();
    }

    public List<Banco> findAllBancosCliPro() {
        return cuentaBancoRepository.findAllBancosCliPro();
    }

    public void insertCuentaPropia(CuentaPropia cuentapropia) {
        if (cuentaBancoRepository.findCuentaPropia(cuentapropia) != null) {
            throw new RuntimeException("La cuenta ya existe");
        }
        cuentaBancoRepository.insertCuentaPropia(cuentapropia);
    }

    public void insertBanco(String nombre) {
        if (cuentaBancoRepository.findBancoByNombre(nombre) != null) {
            throw new RuntimeException("El banco ya existe");
        }
        cuentaBancoRepository.insertBanco(nombre);
    }

    public void insertBancoCliPro(BancoCliPro bancoclipro) {
        if (cuentaBancoRepository.findBancoCliPro(bancoclipro) != null) {
            throw new RuntimeException("El Alias ya fue registrado en este Banco");
        }
        cuentaBancoRepository.insertBancoClipro(bancoclipro);
    }
}