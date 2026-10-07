package com.axel.flujodefondos.services;

import com.axel.flujodefondos.entities.Movimiento;
import com.axel.flujodefondos.entities.CuentaPropia;
import com.axel.flujodefondos.repositories.MovimientoRepository;
import com.axel.flujodefondos.repositories.CuentaBancoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

import java.util.List;
import java.util.Map;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class MovimientoService {

    private final MovimientoRepository movimientoRepository;
    private final CuentaBancoRepository cuentabancoRepository;

    public List<Movimiento> findAllMovimientos(int limit, int offset) {
        return movimientoRepository.findAllMovimientos(limit, offset);
    }

    public List<Movimiento> findAllOperaciones(int limit, int offset) {
        return movimientoRepository.findAllOperaciones(limit, offset);
    }

    @Transactional
    public void createMovimiento(Movimiento movimiento) {
        BigDecimal ingreso = movimiento.getIngreso() != null ? movimiento.getIngreso() : BigDecimal.ZERO;
        BigDecimal egreso = movimiento.getEgreso() != null ? movimiento.getEgreso() : BigDecimal.ZERO;

        // Un cheque endosado no impacta en el saldo de ninguna cuenta propia
        if (!esEndosado(movimiento.getCh_endosado())) {
            if (movimiento.getId_cuenta() == null || movimiento.getId_cuenta().isBlank()) {
                throw new IllegalArgumentException("El movimiento no tiene cuenta asignada");
            }

            CuentaPropia cuenta = cuentabancoRepository.findById(Long.valueOf(movimiento.getId_cuenta()));
            if (cuenta == null) {
                throw new IllegalArgumentException("No existe la cuenta con id " + movimiento.getId_cuenta());
            }

            BigDecimal saldoActual = cuenta.getSaldo() != null ? cuenta.getSaldo() : BigDecimal.ZERO;
            cuenta.setSaldo(saldoActual.add(ingreso).subtract(egreso));
            cuentabancoRepository.updateSaldoCuentaPropia(cuenta);
        }

        movimiento.setSaldo(cuentabancoRepository.getSaldoTotalCuentas());
        movimientoRepository.insert(movimiento);
    }

    private boolean esEndosado(String chEndosado) {
        if (chEndosado == null) return false;
        String v = chEndosado.trim();
        return v.equalsIgnoreCase("true") || v.equals("1");
    }

    @Transactional
    public void inicializarSaldosDelMes() {
        String primerDiaDelMes = LocalDate.now().withDayOfMonth(1).toString();

        String ultimaFecha = movimientoRepository.findFechaUltimoMovimiento();
        boolean yaHayMovimientoEsteMes = ultimaFecha != null
            && ultimaFecha.substring(0, 7).equals(primerDiaDelMes.substring(0, 7));

        if (yaHayMovimientoEsteMes) return;

        List<CuentaPropia> cuentas = cuentabancoRepository.findAllCuentasPropias();
        BigDecimal saldoAcumulado = BigDecimal.ZERO;

        for (CuentaPropia cuenta : cuentas) {
            BigDecimal saldoCuenta = cuenta.getSaldo() != null ? cuenta.getSaldo() : BigDecimal.ZERO;
            saldoAcumulado = saldoAcumulado.add(saldoCuenta);

            Movimiento mov = new Movimiento();
            mov.setFecha(primerDiaDelMes);
            mov.setId_cuenta(String.valueOf(cuenta.getId_cuenta()));
            mov.setId_concepto(null);
            mov.setIngreso(saldoCuenta);
            mov.setObservaciones("Saldo inicial del mes");
            mov.setOperacion(null);
            mov.setCh_endosado(null);
            mov.setId_usuario(null);
            mov.setId_sucursal(null);
            mov.setSaldo(saldoAcumulado);

            movimientoRepository.insert(mov);
        }
    }

    public List<Map<String, Object>> ReporteAnual(int anio) {
        return movimientoRepository.ReporteAnual(anio);
    }

    public List<Map<String, Object>> ReporteMensual(int mes, int anio) {
        return movimientoRepository.ReporteMensual(mes, anio);
    }
}