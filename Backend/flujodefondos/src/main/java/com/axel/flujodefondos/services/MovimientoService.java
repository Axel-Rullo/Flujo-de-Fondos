package com.axel.flujodefondos.services;

import com.axel.flujodefondos.entities.Movimiento;
import com.axel.flujodefondos.entities.CuentaPropia;
import com.axel.flujodefondos.repositories.MovimientoRepository;
import com.axel.flujodefondos.repositories.CuentaBancoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class MovimientoService {

    private final MovimientoRepository movimientoRepository;
    private final CuentaBancoRepository cuentabancoRepository;

    public List<Movimiento> listAll() {
        return movimientoRepository.findAll();
    }

    @Transactional
    public void createMovimiento(Movimiento movimiento) {
        BigDecimal ingreso = movimiento.getIngreso() != null ? movimiento.getIngreso() : BigDecimal.ZERO;
        BigDecimal egreso = movimiento.getEgreso() != null ? movimiento.getEgreso() : BigDecimal.ZERO;

        boolean esEndosado = Boolean.TRUE.equals(movimiento.getCh_endosado());

        if (!esEndosado) {
            CuentaPropia cuenta = cuentabancoRepository.findById(movimiento.getId_cuenta());
            cuenta.setSaldo(cuenta.getSaldo().add(ingreso).subtract(egreso));
            cuentabancoRepository.updateSaldoCuentaPropia(cuenta);
        }

        movimiento.setSaldo(cuentabancoRepository.getSaldoTotalCuentas());
        movimientoRepository.insert(movimiento);
    }
}