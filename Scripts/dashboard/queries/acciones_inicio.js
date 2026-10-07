(function () {
    async function saldoInicialMovimientos() {
    try {
        await window.movimientoService.newMovimientoInicial();
    } catch (e) {
        console.error('Saldo inicial:', e);
    }
}

    saldoInicialMovimientos();
})();