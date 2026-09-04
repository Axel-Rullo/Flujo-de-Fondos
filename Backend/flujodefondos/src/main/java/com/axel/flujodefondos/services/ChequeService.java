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

    // ── LISTADOS ──────────────────────────────────────────────────────

    public List<Cheque> listAllPropios() {
        return chequeRepository.findAllPropios();
    }

    public List<Cheque> listAllTerceros() {
        return chequeRepository.findAllTerceros();
    }

    // ── IMPUTACIÓN ───────────────────────────────────────────────────

    public void imputarChequePropio(Cheque cheque) {
        chequeRepository.imputarChequePropio(cheque);
    }

    public void imputarChequeTercero(Cheque cheque) {
        chequeRepository.imputarChequeTercero(cheque);
    }
}