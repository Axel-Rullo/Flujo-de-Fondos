//////////////////////////////////////////////
// 📐 AJUSTE DE COLUMNAS
//////////////////////////////////////////////

function ajustarColumnas(container) {
    const grupos = container.querySelectorAll('.form-group');
    container.classList.toggle('multiple-columns', grupos.length >= 6);
}

//////////////////////////////////////////////
// 📐 CHEQUES
//////////////////////////////////////////////

document.addEventListener('change', e => {
    if (e.target.id !== 'tipo' && e.target.id !== 'uso' && e.target.id !== 'type_cuenta') return;
    const form = e.target.closest('form');
    if (e.target.id === 'tipo') {
        form.querySelector('#fecha_pago').disabled = e.target.value !== 'D';
    } else if (e.target.id === 'uso') {
        toggleTomSelect(form.querySelector('#id_cuenta_propia_imputar'), e.target.value === 'D');
        toggleTomSelect(form.querySelector('#id_clipro_imputar'), e.target.value === 'E');
        toggleTomSelect(form.querySelector('#id_concepto_imputar'), e.target.value === 'E');
    } else {
        toggleTomSelect(form.querySelector('#id_banco'), e.target.value === 'B');
    }
});

function toggleTomSelect(select, enable) {
    if (select.tomselect) {
        enable ? select.tomselect.enable() : select.tomselect.disable();
    } else {
        select.disabled = !enable;
    }
}

//////////////////////////////////////////////
// 📐 TOM SELECT
//////////////////////////////////////////////

async function loadSucursales(container) {
    try {
        const select = container.querySelector('#branch');
        if (!select || select.tomselect) return;
        const sucursales = await apiGet('/sucursal/list');
        new TomSelect(select, {
            dropdownParent: 'body',
            options: sucursales.map(s => ({ value: s.nombre, text: s.nombre, id_sucursal: s.id_sucursal })),
            labelField: 'text',
            searchField: 'text',
            sortField : {
                field: "text",
                direction: "asc"
            },
            render: {
                option: function(data, escape) {
                    return `<div class="option">
                        <span>${escape(data.text)}</span>
                        <button type="button" class="btn-delete-option" data-id="${data.id_sucursal}" title="Eliminar" onclick="event.stopPropagation();">
                            <svg width="18" height="18"><use href="#icon-trash" xlink:href="#icon-trash"/></svg>
                        </button>
                    </div>`;
                }
            }
        });
    } catch (err) {
        showAlert("Error al cargar las sucursales", "error", 3000, 'center', true);
        console.error('Error loading sucursales:', err);
    }
}

async function loadConceptos(container) {
    try {
        const select = container.querySelector('#id_concepto_emision, #id_concepto_imputar');
        if (!select || select.tomselect) return;
        const conceptos = await apiGet('/concepto/list');
        new TomSelect(select, {
            create: false,
            dropdownParent: 'body',
            options: conceptos.map(c => ({ value: c.id, text: c.nombre  + ' (' + (c.clasificacion === '1' ? 'O' : c.clasificacion === '2' ? 'F' : 'I') + ')', id: c.id })),
            labelField: 'text',
            searchField: 'text',
            sortField : {
                field: "text",
                direction: "asc"
            },
            render: {
                option: function(data, escape) {
                    return `<div class="option">
                        <span>${escape(data.text)}</span>
                    </div>`;
                }
            }
        });
    } catch (err) {
        showAlert("Error al cargar las conceptos", "error", 3000, 'center', true);
        console.error('Error loading conceptos:', err);
    }
}

async function loadTerceros(container) {
    try {
        const select = container.querySelector('#id_clipro_emision, #id_clipro_imputar, #id_clipro');
        if (!select || select.tomselect) return;
        const terceros = await apiGet('/tercero/list/names');
        new TomSelect(select, {
            create: false,
            dropdownParent: 'body',
            options: terceros.map(t => ({ value: t.id_clipro, text: t.nombre + ' (' + t.tipo + ')', id: t.id_clipro })),
            labelField: 'text',
            searchField: 'text',
            sortField : {
                field: "text",
                direction: "asc"
            },
            render: {
                option: function(data, escape) {
                    return `<div class="option">
                        <span>${escape(data.text)}</span>
                    </div>`;
                }
            }
        });
    } catch (err) {
        showAlert("Error al cargar las terceros", "error", 3000, 'center', true);
        console.error('Error loading terceros:', err);
    }
}

async function loadCuentasPropias(container) {
    try {
        const select = container.querySelector('#id_cuenta_propia_emision, #id_cuenta_propia_imputar');
        if (!select || select.tomselect) return;
        const cuentas = await apiGet('/cuentas/list');
        new TomSelect(select, {
            create: false,
            dropdownParent: 'body',
            options: cuentas.map(c => ({ value: c.id_cuenta, text: c.nombre + ' (' + (c.banco ? c.banco : 'Caja') + ')', id: c.id_cuenta })),
            labelField: 'text',
            searchField: 'text',
            sortField : {
                field: "text",
                direction: "asc"
            },
            render: {
                option: function(data, escape) {
                    return `<div class="option">
                        <span>${escape(data.text)}</span>
                    </div>`;
                }
            }
        });
    } catch (err) {
        showAlert("Error al cargar las cuentas propias", "error", 3000, 'center', true);
        console.error('Error al cargar las cuentas propias:', err);
    }
}

async function loadCuentasTerceros(container) {
    try {
        const select = container.querySelector('#id_banco_emision, #id_banco');
        if (!select || select.tomselect) return;
        const bancos = await apiGet('/bancos/list/names');
        new TomSelect(select, {
            create: false,
            dropdownParent: 'body',
            options: bancos.map(b => ({ value: b.id_banco, text: b.nombre, id: b.id_banco })),
            labelField: 'text',
            searchField: 'text',
            sortField : {
                field: "text",
                direction: "asc"
            },
            render: {
                option: function(data, escape) {
                    return `<div class="option">
                        <span>${escape(data.text)}</span>
                    </div>`;
                }
            }
        });
    } catch (err) {
        showAlert("Error al cargar las cuentas de terceros", "error", 3000, 'center', true);
        console.error('Error al cargar las cuentas de terceros:', err);
    }
}

async function loadFechaHoy (container) {
    try {
        const campos = container.querySelectorAll('#fecha_emision, #fecha_destino');
        campos.forEach(campo => campo.value = getFechaLocal());
    } catch (err) {
        showAlert("Error al calcular la fecha actual", "error", 3000, 'center', true);
        console.error('Error al calcular la fecha actual:', err);
    }
}

window.formLoaders = [loadSucursales, loadConceptos, loadTerceros, loadCuentasPropias, loadCuentasTerceros, loadFechaHoy];