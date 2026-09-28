const PALETA_ACENTOS = [
    'hsl(0, 90%, 75%)', 'hsl(14, 90%, 70%)', 'hsl(29, 95%, 65%)', 'hsl(43, 95%, 58%)', 'hsl(58, 90%, 52%)',
    'hsl(72, 80%, 52%)', 'hsl(86, 70%, 52%)', 'hsl(101, 65%, 54%)', 'hsl(115, 65%, 56%)', 'hsl(130, 65%, 56%)',
    'hsl(144, 65%, 55%)', 'hsl(158, 70%, 52%)', 'hsl(173, 75%, 50%)', 'hsl(187, 85%, 55%)', 'hsl(202, 90%, 62%)',
    'hsl(216, 90%, 68%)', 'hsl(230, 90%, 72%)', 'hsl(245, 90%, 76%)', 'hsl(259, 90%, 75%)', 'hsl(274, 85%, 72%)',
    'hsl(288, 80%, 70%)', 'hsl(302, 75%, 70%)', 'hsl(317, 80%, 70%)', 'hsl(331, 85%, 72%)', 'hsl(346, 90%, 74%)'
];

window.CuentaBancoTemplates = {

    mostrarCuentasPropias: async function(cuentas, container) {
        const cantidad = document.querySelector("#cantidad-propias");
        cantidad.textContent = '( ' + cuentas.length + ' )';
        const html = cuentas.map((cuenta, i) => {
            return `
            <div class="group_cuenta_propia" style="--c:${PALETA_ACENTOS[i % PALETA_ACENTOS.length]}">
                <h1 class="nombre_cuenta">${cuenta.nombre}</h1>
                <div class="valores">
                    <span>${cuenta.banco ? cuenta.banco : 'Caja'}</span><span>$ ${formatearImporte(cuenta.saldo || 0)}</span>
                </div>
            </div>
        `;
        }).join('');

        container.innerHTML = html;
    },

    mostrarBancosClipros: async function(bancos, container) {
        const cantidad = document.querySelector("#cantidad-terceros");
        cantidad.textContent = '( ' + bancos.length + ' )';
            const html = bancos.map((banco, i) => {
                return `
                <div class="grupo_banco" style="--c:${PALETA_ACENTOS[i % PALETA_ACENTOS.length]}">
                <button data-target="${banco.id_banco}" class="grupo_banco_header">
                    <div class="grupo_banco_titulo">
                        <span class="chevron"></span>
                        <h2>${banco.nombre}</h2>
                    </div>
                    <span class="cantidad_grupo">( ${banco.clientes.length} )</span>
                </button>
                <div id="${banco.id_banco}" class="grupo_banco_lista">
                    ${banco.clientes.map(cliente => `
                    <div class="fila_cliente">
                        <span class="nombre_cliente">${cliente.nombre}</span>
                        <div class="alias_wrap">
                            <span class="alias_cliente">${cliente.alias}</span>
                            <span class="divisor"></span>
                            <button class="btn_copiar" title="Copiar alias">
                                <svg><use href="#icon-copy"/></svg>
                            </button>
                        </div>
                    </div>`).join('')}
                </div>
            </div>
            `;
            }).join('');

            container.innerHTML = html;
    },
}