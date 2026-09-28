package com.axel.flujodefondos.services;

import com.axel.flujodefondos.entities.CuentaPropia;
import com.axel.flujodefondos.entities.Banco;
import com.axel.flujodefondos.entities.BancoCliPro;
import com.axel.flujodefondos.entities.Movimiento;
import com.axel.flujodefondos.repositories.CuentaBancoRepository;
import com.axel.flujodefondos.repositories.MovimientoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.math.BigDecimal;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class CuentaBancoService {

    private final CuentaBancoRepository cuentaBancoRepository;
    private final MovimientoRepository movimientoRepository;

    public List<CuentaPropia> findAllCuentasPropias() {
        return cuentaBancoRepository.findAllCuentasPropias();
    }

    public List<Banco> findAllBancosNames() {
        return cuentaBancoRepository.findAllBancosNames();
    }

    public List<Banco> findAllBancosCliPro() {
        return cuentaBancoRepository.findAllBancosCliPro();
    }

    public BigDecimal getSaldoTotalCuentas() {
        return cuentaBancoRepository.getSaldoTotalCuentas();
    }

    @Transactional
    public void insertCuentaPropia(CuentaPropia cuentapropia) {
        if (cuentaBancoRepository.findCuentaPropia(cuentapropia) != null) {
            throw new RuntimeException("La cuenta ya existe");
        }
        cuentaBancoRepository.insertCuentaPropia(cuentapropia);

        // ---------- Saldo inicial en movimientos ----------
        Long idCuenta = cuentaBancoRepository.findCuentaPropia(cuentapropia);
        BigDecimal saldoCuenta = cuentapropia.getSaldo() != null ? cuentapropia.getSaldo() : BigDecimal.ZERO;

        Movimiento mov = new Movimiento();
        mov.setFecha(LocalDate.now().toString());
        mov.setId_cuenta(idCuenta);
        mov.setId_concepto("1");
        mov.setIngreso(saldoCuenta);
        mov.setObservaciones("Saldo inicial de la cuenta");
        mov.setCh_endosado(false);
        mov.setId_usuario(null);
        mov.setId_sucursal(null);
        mov.setSaldo(cuentaBancoRepository.getSaldoTotalCuentas());

        movimientoRepository.insert(mov);
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