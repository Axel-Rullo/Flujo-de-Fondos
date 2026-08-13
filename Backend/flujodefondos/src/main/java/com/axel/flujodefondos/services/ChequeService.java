package com.axel.flujodefondos.services;

import com.axel.flujodefondos.entities.ChequePropio;
import com.axel.flujodefondos.entities.ChequeTercero;
import com.axel.flujodefondos.repositories.ChequeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChequeService {
    
    private final ChequeRepository chequeRepository;

    // ── ALTA ─────────────────────────────────────────────────────────

    public void createChequePropio(ChequePropio chequePropio) {
        chequeRepository.insertChequepro(chequePropio);
    }

    public void createChequeTercero(ChequeTercero chequeTercero) {
        chequeRepository.insertChequeter(chequeTercero);
    }
}