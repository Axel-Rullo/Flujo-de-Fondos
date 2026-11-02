//////////////////////////////////////////////
// 📐 AJUSTE DE COLUMNAS
//////////////////////////////////////////////

function ajustarColumnas(container) {
    const grupos = container.querySelectorAll('.form-group');
    container.classList.toggle('multiple-columns', grupos.length >= 6);
}

// ---------------------------------------------------------------------
// Bloquear días puntuales en campos date (todos los años)
// ---------------------------------------------------------------------
const DIAS_BLOQUEADOS = ['11-23', '12-08', '12-25']; // MM-DD

document.addEventListener('change', e => {
    if (e.target.id !== 'fecha_pago' && e.target.id !== 'fecha_destino') return;

    if (DIAS_BLOQUEADOS.includes(e.target.value.slice(5))) {
        e.target.value = '';
        showAlert('Ese día no está habilitado', 'warning', 3000, 'center', true);
    }
});

//////////////////////////////////////////////
// 🪪 DNI / CUIT
//////////////////////////////////////////////

// DNI: solo dígitos (máx. 8) | CUIT: 11 dígitos con formato XX-XXXXXXXX-X
function formatearDocumento(valor, tipo) {
    const digitos = valor.replace(/\D/g, "").slice(0, tipo === "CUIT" ? 11 : 8);
    if (tipo !== "CUIT") return digitos;

    return digitos.slice(0, 2) +
        (digitos.length > 2 ? "-" + digitos.slice(2, 10) : "") +
        (digitos.length > 10 ? "-" + digitos.slice(10) : "");
}

// Devuelve el mensaje de error, o null si el largo es válido
function validarDocumento(valor, tipo) {
    const largo = valor.replace(/\D/g, "").length;

    if (tipo === "CUIT") {
        return largo === 11 ? null : "El CUIT debe tener 11 dígitos";
    }
    return largo >= 7 && largo <= 8 ? null : "El DNI debe tener entre 7 y 8 dígitos";
}

function aplicarDocumento(input) {
    const tipo = input.form.querySelector("[data-documento-tipo]").value;
    const digitosAntes = input.value.slice(0, input.selectionStart).replace(/\D/g, "").length;

    input.value = formatearDocumento(input.value, tipo);
    input.placeholder = tipo + "...";

    // Reposicionar el cursor después del mismo dígito que tenía antes de formatear
    let count = 0;
    let newPos = 0;
    while (newPos < input.value.length && count < digitosAntes) {
        if (/\d/.test(input.value[newPos])) count++;
        newPos++;
    }
    input.setSelectionRange(newPos, newPos);
}

// Uso: input con data-documento + select (DNI/CUIT) con data-documento-tipo, dentro del mismo form
document.addEventListener('input', e => {
    if (e.target.matches('[data-documento]')) aplicarDocumento(e.target);
});

document.addEventListener('change', e => {
    if (!e.target.matches('[data-documento-tipo]')) return;
    const input = e.target.form.querySelector('[data-documento]');
    if (input) aplicarDocumento(input);
});

//////////////////////////////////////////////
// 📐 CHEQUES
//////////////////////////////////////////////

document.addEventListener('change', e => {
    if (e.target.id !== 'tipo' && e.target.id !== 'uso' && e.target.id !== 'type_cuenta' && e.target.id !== 'clasificacion') return;
    const form = e.target.closest('form');
    if (e.target.id === 'tipo') {
        form.querySelector('#fecha_pago').disabled = e.target.value !== 'D';
    } else if (e.target.id === 'uso') {
        toggleTomSelect(form.querySelector('#id_cuenta_propia_imputar'), e.target.value === 'D');
        toggleTomSelect(form.querySelector('#id_clipro_imputar'), e.target.value === 'E');
        toggleTomSelect(form.querySelector('#id_concepto_imputar'), e.target.value === 'E');
    } else if (e.target.id === 'clasificacion') {
        toggleTomSelect(form.querySelector('#sub_clasificacion'), e.target.value === '1');
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
        const selects = container.querySelectorAll('#branch');
        if (!selects.length) return;

        const sucursales = await apiGet('/sucursal/list');

        selects.forEach(select => {
            if (select.tomselect) return;

            new TomSelect(select, {
                dropdownParent: 'body',
                options: sucursales.map(s => ({
                    value: s.nombre,
                    text: s.nombre,
                    id_sucursal: s.id_sucursal
                })),
                labelField: 'text',
                searchField: 'text',
                sortField: {
                    field: 'text',
                    direction: 'asc'
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
        });
    } catch (err) {
        showAlert("Error al cargar las sucursales", "error", 3000, 'center', true);
        console.error('Error loading sucursales:', err);
    }
}

async function loadConceptos(container) {
    try {
        const selects = container.querySelectorAll('#id_concepto_emision, #id_concepto_imputar, #id_concepto');
        if (!selects.length) return;

        const conceptos = await apiGet('/concepto/list');

        selects.forEach(select => {
            if (select.tomselect) return;

            new TomSelect(select, {
                create: false,
                dropdownParent: 'body',
                options: conceptos.map(c => ({
                    value: c.id,
                    text: c.nombre + ' (' + (
                        c.clasificacion === '1'
                            ? 'O'
                            : c.clasificacion === '2'
                                ? 'F'
                                : 'I'
                    ) + ')',
                    id: c.id
                })),
                labelField: 'text',
                searchField: 'text',
                sortField: {
                    field: 'text',
                    direction: 'asc'
                },
                render: {
                    option: function(data, escape) {
                        return `<div class="option">
                            <span>${escape(data.text)}</span>
                        </div>`;
                    }
                }
            });
        });
    } catch (err) {
        showAlert("Error al cargar los conceptos", "error", 3000, 'center', true);
        console.error('Error loading conceptos:', err);
    }
}

async function loadTerceros(container) {
    try {
        const selects = container.querySelectorAll('#id_clipro_emision, #id_clipro_imputar, #id_clipro');
        if (!selects.length) return;

        const terceros = await apiGet('/tercero/list/names');

        selects.forEach(select => {
            if (select.tomselect) return;

            new TomSelect(select, {
                create: false,
                dropdownParent: 'body',
                options: terceros.map(t => ({
                    value: t.id_clipro,
                    text: t.razon_social + ' (' + t.tipo + ')',
                    id: t.id_clipro
                })),
                labelField: 'text',
                searchField: 'text',
                sortField: {
                    field: 'text',
                    direction: 'asc'
                },
                render: {
                    option: function(data, escape) {
                        return `<div class="option">
                            <span>${escape(data.text)}</span>
                        </div>`;
                    }
                }
            });
        });
    } catch (err) {
        showAlert("Error al cargar los terceros", "error", 3000, 'center', true);
        console.error('Error loading terceros:', err);
    }
}

async function loadCuentasPropias(container) {
    try {
        const selects = container.querySelectorAll('#id_cuenta_propia_emision, #id_cuenta_propia_imputar, #cuenta_origen, #cuenta_destino');
        if (!selects.length) return;

        const cuentas = await apiGet('/cuentas/list');

        selects.forEach(select => {
            if (select.tomselect) return;

            new TomSelect(select, {
                create: false,
                dropdownParent: 'body',
                options: cuentas.map(c => ({
                    value: c.id_cuenta,
                    text: c.nombre + ' (' + (c.banco ? c.banco : 'Caja') + ')',
                    id: c.id_cuenta
                })),
                labelField: 'text',
                searchField: 'text',
                sortField: {
                    field: 'text',
                    direction: 'asc'
                },
                render: {
                    option: function(data, escape) {
                        return `<div class="option">
                            <span>${escape(data.text)}</span>
                        </div>`;
                    }
                }
            });
        });
    } catch (err) {
        showAlert("Error al cargar las cuentas propias", "error", 3000, 'center', true);
        console.error('Error al cargar las cuentas propias:', err);
    }
}

async function loadCuentasTerceros(container) {
    try {
        const selects = container.querySelectorAll('#id_banco_emision, #id_banco');
        if (!selects.length) return;

        const bancos = await apiGet('/bancos/list/names');

        selects.forEach(select => {
            if (select.tomselect) return;

            new TomSelect(select, {
                create: false,
                dropdownParent: 'body',
                options: bancos.map(b => ({
                    value: b.id_banco,
                    text: b.nombre,
                    id: b.id_banco
                })),
                labelField: 'text',
                searchField: 'text',
                sortField: {
                    field: 'text',
                    direction: 'asc'
                },
                render: {
                    option: function(data, escape) {
                        return `<div class="option">
                            <span>${escape(data.text)}</span>
                        </div>`;
                    }
                }
            });
        });
    } catch (err) {
        showAlert("Error al cargar las cuentas de terceros", "error", 3000, 'center', true);
        console.error('Error al cargar las cuentas de terceros:', err);
    }
}

async function loadFechaHoy (container) {
    try {
        const campos = container.querySelectorAll('#fecha_emision, #fecha_destino, #año, #mes_año');
        campos.forEach(campo => {
            campo.value = campo.id === 'año' ? getAñoLocal() : campo.id === 'mes_año' ? getMesAñoLocal() : getFechaLocal();
        });
    } catch (err) {
        showAlert("Error al calcular la fecha actual", "error", 3000, 'center', true);
        console.error('Error al calcular la fecha actual:', err);
    }
}

window.formLoaders = [loadSucursales, loadConceptos, loadTerceros, loadCuentasPropias, loadCuentasTerceros, loadFechaHoy];
