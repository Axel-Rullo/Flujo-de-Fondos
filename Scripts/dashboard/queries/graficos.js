(function () {

    // ── SALDO TOTAL DE LAS CUENTAS ───────

    async function mostrarTotales() {
        const cuentas_saldo_total = document.querySelector('.total_saldos_cuentas');

        const saldoTotal = await window.CuentaBancoService.cuentas_saldo_total();

        cuentas_saldo_total.textContent = formatearImporte(saldoTotal);
    }

    // ── SALDO POR CUENTA (barras por porcentaje) ──

    async function renderSaldoPorCuenta() {
        const contenedor = document.getElementById('cuentas-lista');

        const cuentas = await window.CuentaBancoService.listCuentas();
        const maxSaldo = Math.max(...cuentas.map(c => c.saldo));

        contenedor.innerHTML = cuentas
            .slice()
            .sort((a, b) => b.saldo - a.saldo)
            .map(c => {
                const banco = c.banco ? c.banco : 'Caja';
                const ancho = maxSaldo > 0 ? (c.saldo / maxSaldo) * 100 : 0;

                return `
                    <div class="cuenta-row">
                        <span class="nombre">
                            <span class="nombre-cuenta">${c.nombre}</span>
                            <span class="nombre-banco">${banco}</span>
                        </span>
                        <div class="barra-wrap"><div class="barra" style="width:${ancho}%"></div></div>
                        <span class="valor">$ ${formatearImporte(c.saldo)}</span>
                    </div>
                `;
            })
            .join('');
    }

    // ── CHEQUES: EMITIDOS VS A COBRAR ─────

    function renderCheques() {
        const emitidos = { corrientes: 2000000, diferidos: 3000000 };
        const aCobrar = { corrientes: 4000000, diferidos: 1000000 };

        renderChequeFila('cheque-bars-corrientes', emitidos.corrientes, aCobrar.corrientes);
        renderChequeFila('cheque-bars-diferidos', emitidos.diferidos, aCobrar.diferidos);

        const totalCorrientes = emitidos.corrientes + aCobrar.corrientes;
        const totalDiferidos = emitidos.diferidos + aCobrar.diferidos;
        const totalGeneral = totalCorrientes + totalDiferidos;

        document.querySelector('.total_corrientes').textContent = formatearImporte(totalCorrientes);
        document.querySelector('.total_diferidos').textContent = formatearImporte(totalDiferidos);
        document.querySelector('.total_general').textContent = formatearImporte(totalGeneral);
    }

    function renderChequeFila(idContenedor, valorEmitidos, valorACobrar) {
        const anchoACobrar = valorEmitidos > 0 ? (valorACobrar / valorEmitidos) * 100 : 0;
        const anchoEmitidos = valorACobrar > 0 ? (valorEmitidos / valorACobrar) * 100 : 0;

        document.getElementById(idContenedor).innerHTML = `
            <div class="side left"><div class="bar emitidos" style="width:${anchoEmitidos}%">${formatearImporte(valorEmitidos)}</div></div>
            <div class="cheque-center">vs</div>
            <div class="side right"><div class="bar acobrar" style="width:${anchoACobrar}%">${formatearImporte(valorACobrar)}</div></div>
        `;
    }

    mostrarTotales();
    renderSaldoPorCuenta();
    renderCheques();
})();