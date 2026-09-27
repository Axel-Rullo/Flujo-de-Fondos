const PALETA_ACENTOS = [
    'hsl(0, 70%, 60%)', 'hsl(14, 70%, 60%)', 'hsl(29, 70%, 60%)', 'hsl(43, 70%, 60%)', 'hsl(58, 70%, 60%)',
    'hsl(72, 70%, 60%)', 'hsl(86, 70%, 60%)', 'hsl(101, 70%, 60%)', 'hsl(115, 70%, 60%)', 'hsl(130, 70%, 60%)',
    'hsl(144, 70%, 60%)', 'hsl(158, 70%, 60%)', 'hsl(173, 70%, 60%)', 'hsl(187, 70%, 60%)', 'hsl(202, 70%, 60%)',
    'hsl(216, 70%, 60%)', 'hsl(230, 70%, 60%)', 'hsl(245, 70%, 60%)', 'hsl(259, 70%, 60%)', 'hsl(274, 70%, 60%)',
    'hsl(288, 70%, 60%)', 'hsl(302, 70%, 60%)', 'hsl(317, 70%, 60%)', 'hsl(331, 70%, 60%)', 'hsl(346, 70%, 60%)'
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