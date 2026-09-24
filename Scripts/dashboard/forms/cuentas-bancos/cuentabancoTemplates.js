window.CuentaBancoTemplates = {

    mostrarCuentasPropias: async function(cuentas, container) {
        const cantidad = document.querySelector("#cantidad-propias");
        cantidad.textContent = '( ' + cuentas.length + ' )';
        const html = cuentas.map(cuenta => {
            return `
            <div class="group_cuenta_propia">
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
            const html = bancos.map(banco => {
                return `
                <div class="grupo_banco">
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