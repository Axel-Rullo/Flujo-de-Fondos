package com.axel.flujodefondos.services;

import com.axel.flujodefondos.entities.Cheque;
import com.axel.flujodefondos.entities.Movimiento;
import com.axel.flujodefondos.entities.CuentaPropia;
import com.axel.flujodefondos.repositories.ChequeRepository;
import com.axel.flujodefondos.repositories.MovimientoRepository;
import com.axel.flujodefondos.repositories.CuentaBancoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class ChequeService {

    private final ChequeRepository chequeRepository;
    private final MovimientoRepository movimientoRepository;
    private final CuentaBancoRepository cuentaBancoRepository;

    // ── ALTA ─────────────────────────────────────────────────────────

    public void createChequePropio(Cheque cheque) {
        chequeRepository.insertChequePropio(cheque);
    }

    public void createChequeTercero(Cheque cheque) {
        chequeRepository.insertChequeTercero(cheque);
    }

    // ── RESUMEN ───────────────────────────────────────────────────────

    public List<Cheque> findAllTotales() {
        return chequeRepository.findAllTotales();
    }

    // ── RESUMEN PRÓXIMOS 7 DÍAS (DESDE MAÑANA) ───────

    public List<Map<String, Object>> resumenProximosDias() {
        String desde = LocalDate.now().plusDays(1).toString();
        String hasta = LocalDate.now().plusDays(7).toString();
        return chequeRepository.resumenProximosDias(desde, hasta);
    }


    // ── LISTADOS ──────────────────────────────────────────────────────

    public List<Cheque> listAllPropios(String estado, String busqueda, int limit, int offset) {
        return chequeRepository.findAllPropios(estado, busqueda, limit, offset);
    }

    public List<Cheque> listAllTerceros(String estado, String busqueda, int limit, int offset) {
        return chequeRepository.findAllTerceros(estado, busqueda, limit, offset);
    }

    // ── HISTORIAL ────────────────────────────────────────────────────

    public List<Cheque> listBajasPropios(String estado, String busqueda, int limit, int offset) {
        return chequeRepository.findAllBajasPropios(estado, busqueda, limit, offset);
    }

    public List<Cheque> listBajasTerceros(String estado, String busqueda, int limit, int offset) {
        return chequeRepository.findAllBajasTerceros(estado, busqueda, limit, offset);
    }

    // ── DETALLE ──────────────────────────────────────────────────────

    public Cheque getCheque(Long id) {
        return chequeRepository.findById(id);
    }

    // ── IMPUTACIÓN ───────────────────────────────────────────────────

    @Transactional
    public void imputarChequePropio(Cheque cheque) {
        if (chequeRepository.imputarChequePropio(cheque) == 0) throw new IllegalStateException("El cheque no está pendiente");

        Cheque data = chequeRepository.findImputacionById(cheque.getId_cheque());
        CuentaPropia origen = cuentaBancoRepository.findById(Long.valueOf(data.getId_cuenta_propia_emision()));
        if (origen.getSaldo().compareTo(data.getImporte()) < 0) throw new IllegalStateException("El saldo de la cuenta seleccionada es menor al del monto requerido");

        origen.setSaldo(origen.getSaldo().subtract(data.getImporte()));
        cuentaBancoRepository.updateSaldoCuentaPropia(origen);

        insertMovimientos(cheque, true);
    }

    @Transactional
    public void imputarChequeTercero(Cheque cheque) {
        if (chequeRepository.imputarChequeTercero(cheque) == 0) throw new IllegalStateException("El cheque no está pendiente");

        if ("D".equals(cheque.getUso())) {
            Cheque data = chequeRepository.findImputacionById(cheque.getId_cheque());
            CuentaPropia destino = cuentaBancoRepository.findById(Long.valueOf(cheque.getId_cuenta_propia_imputar()));

            destino.setSaldo(destino.getSaldo().add(data.getImporte()));
            cuentaBancoRepository.updateSaldoCuentaPropia(destino);
        }

        insertMovimientos(cheque, false);
    }

    // ── MOVIMIENTOS ──────────────────────────────────────────────────

    private void insertMovimientos(Cheque cheque, boolean propio) {
        Cheque original = chequeRepository.findImputacionById(cheque.getId_cheque());
        boolean endoso = "E".equals(cheque.getUso());

        Movimiento movimiento = new Movimiento();

        // Datos comunes
        movimiento.setFecha(cheque.getFecha_destino());
        movimiento.setId_usuario(cheque.getId_usuario());
        movimiento.setId_sucursal(chequeRepository.findSucursalByUsuario(cheque.getId_usuario()));
        movimiento.setObservaciones((propio ? "Cheque Propio" : "Cheque de Terceros") + " N° " + original.getNumero());
        movimiento.setOperacion(propio ? "Cheque Propio" : "Cheque de Terceros" + (endoso ? " Endosado" : " Depositado" + " " + cheque.getNumero()));
        movimiento.setId_concepto(original.getId_concepto_emision());

        // Cheque propio: salida de la cuenta del cheque
        if (propio) {
            movimiento.setId_cuenta(original.getId_cuenta_propia_emision());
            movimiento.setEgreso(original.getImporte());
        }

        // Cheque de terceros: entrada (depósito en cuenta propia o endoso sin cuenta)
        if (!propio) {
            movimiento.setIngreso(original.getImporte());
            if (endoso) movimiento.setCh_endosado("Cheque Endosado");
            else movimiento.setId_cuenta(cheque.getId_cuenta_propia_imputar());
        }

        movimientoRepository.insert(movimiento);

        // Endoso: segundo movimiento, la salida con el concepto elegido al imputar
        if (endoso) {
            movimiento.setIngreso(null);
            movimiento.setEgreso(original.getImporte());
            movimiento.setId_concepto(cheque.getId_concepto_imputar());
            movimientoRepository.insert(movimiento);
        }
    }

    // ── RECHAZO ──────────────────────────────────────────────────────

    public void rechazarCheque(Cheque cheque) {
        chequeRepository.rechazarCheque(cheque);
    }

    // ── ANULACION ────────────────────────────────────────────────────

    public void anularCheque(Cheque cheque) {
        chequeRepository.anularCheque(cheque);
    }
}