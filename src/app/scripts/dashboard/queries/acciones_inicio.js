(function () {
    async function saldoInicialMovimientos() {
        try {
            await window.movimientoService.newMovimientoInicial();
        } catch (e) {
            console.error('Saldo inicial:', e);
        }
    }

    async function imputacionAutomaticaCheques() {
        try {
            await window.ChequeService.imputacionAutomaticaChequesPropios();
        } catch (e) {
            console.error('Error al imputar automaticamente los cheques propios:', e);
        }
    }

    async function iniciar() {
        await saldoInicialMovimientos();
        await imputacionAutomaticaCheques();
    }

    iniciar();
})();