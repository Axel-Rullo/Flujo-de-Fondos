package com.axel.flujodefondos.services;

import com.axel.flujodefondos.entities.Cheque;
import com.axel.flujodefondos.repositories.ChequeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChequeService {

    private final ChequeRepository chequeRepository;

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


    // ── LISTADOS ──────────────────────────────────────────────────────

    public List<Cheque> listAllPropios(String estado) {
        return chequeRepository.findAllPropios(estado);
    }

    public List<Cheque> listAllTerceros(String estado) {
        return chequeRepository.findAllTerceros(estado);
    }

    // ── HISTORIAL ────────────────────────────────────────────────────

    public List<Cheque> listBajasPropios(String estado) {
        return chequeRepository.findAllBajasPropios(estado);
    }

    public List<Cheque> listBajasTerceros(String estado) {
        return chequeRepository.findAllBajasTerceros(estado);
    }

    // ── DETALLE ──────────────────────────────────────────────────────

    public Cheque getCheque(Long id) {
        return chequeRepository.findById(id);
    }

    // ── IMPUTACIÓN ───────────────────────────────────────────────────

    public void imputarChequePropio(Cheque cheque) {
        chequeRepository.imputarChequePropio(cheque);
    }

    public void imputarChequeTercero(Cheque cheque) {
        chequeRepository.imputarChequeTercero(cheque);
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