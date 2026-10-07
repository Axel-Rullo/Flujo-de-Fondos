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

    public List<CuentaPropia> findAllTransaccionesInternas() {
        return cuentaBancoRepository.findAllTransaccionesInternas();
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
        Long idCuentaNum = cuentaBancoRepository.findCuentaPropia(cuentapropia);
        if (idCuentaNum == null) {
            throw new RuntimeException("No se pudo obtener el id de la cuenta recién creada");
        }
        String idCuenta = String.valueOf(idCuentaNum); // Movimiento.id_cuenta es String
        BigDecimal saldoCuenta = cuentapropia.getSaldo() != null ? cuentapropia.getSaldo() : BigDecimal.ZERO;

        Movimiento mov = new Movimiento();
        mov.setFecha(LocalDate.now().toString());
        mov.setId_cuenta(idCuenta);
        mov.setId_concepto(null);
        mov.setIngreso(saldoCuenta);
        mov.setObservaciones("Saldo inicial de la cuenta");
        mov.setCh_endosado(null);
        mov.setId_usuario(null);
        mov.setId_sucursal(null);
        mov.setSaldo(cuentaBancoRepository.getSaldoTotalCuentas());

        movimientoRepository.insert(mov);
    }

    // ── TRANSACCIONES INTERNAS ───────────────────────────────────────
    @Transactional
    public void insertTransaccionInterna(CuentaPropia transaccion) {
        Long idOrigen = transaccion.getId_cuenta_origen();
        Long idDestino = transaccion.getId_cuenta_destino();

        if (idOrigen == null || idDestino == null) {
            throw new RuntimeException("Debe indicar la cuenta de origen y destino");
        }
        if (idOrigen.equals(idDestino)) {
            throw new RuntimeException("La cuenta de origen y destino no pueden ser la misma");
        }

        CuentaPropia origen = cuentaBancoRepository.findById(idOrigen);
        CuentaPropia destino = cuentaBancoRepository.findById(idDestino);

        if (origen == null || destino == null) {
            throw new RuntimeException("La cuenta de origen o destino no existe");
        }
        if (origen.getSaldo().compareTo(transaccion.getMonto()) < 0) {
            throw new RuntimeException("Saldo insuficiente en la cuenta de origen");
        }

        origen.setSaldo(origen.getSaldo().subtract(transaccion.getMonto()));
        destino.setSaldo(destino.getSaldo().add(transaccion.getMonto()));

        cuentaBancoRepository.updateSaldoCuentaPropia(origen);
        cuentaBancoRepository.updateSaldoCuentaPropia(destino);
        cuentaBancoRepository.insertTransaccionInterna(transaccion);
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