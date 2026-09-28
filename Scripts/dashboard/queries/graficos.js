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

    async function renderCheques() {
        const totales = await window.ChequeService.listTotales();
        const total = (clasificacion, tipo) => totales.find(t => t.clasificacion === clasificacion && t.tipo === tipo)?.importe ?? 0;
        const emitidos = { corrientes: total('E', 'C'), diferidos: total('E', 'D') };
        const aCobrar = { corrientes: total('A', 'C'), diferidos: total('A', 'D') };

        renderChequeFila('cheque-bars-corrientes', emitidos.corrientes, aCobrar.corrientes);
        renderChequeFila('cheque-bars-diferidos', emitidos.diferidos, aCobrar.diferidos);

        const totalCorrientes = aCobrar.corrientes - emitidos.corrientes;
        const totalDiferidos = aCobrar.diferidos - emitidos.diferidos;
        const totalGeneral = totalCorrientes + totalDiferidos;

        document.querySelector('.total_corrientes').textContent = formatearImporte(totalCorrientes);
        document.querySelector('.total_diferidos').textContent = formatearImporte(totalDiferidos);
        document.querySelector('.total_general').textContent = formatearImporte(totalGeneral);
    }

    function renderChequeFila(idContenedor, valorEmitidos, valorACobrar) {
        const maximo = Math.max(valorEmitidos, valorACobrar);
        const anchoACobrar = maximo > 0 ? (valorACobrar / maximo) * 100 : 0;
        const anchoEmitidos = maximo > 0 ? (valorEmitidos / maximo) * 100 : 0;

        document.getElementById(idContenedor).innerHTML = `
            <div class="side left"><div class="bar emitidos" style="width:${anchoEmitidos}%">- $ ${formatearImporte(valorEmitidos)}</div></div>
            <div class="cheque-center">vs</div>
            <div class="side right"><div class="bar acobrar" style="width:${anchoACobrar}%">$ ${formatearImporte(valorACobrar)}</div></div>
        `;
    }

    mostrarTotales();
    renderSaldoPorCuenta();
    renderCheques();
})();