//////////////////////////////////////////////
// 📐 AJUSTE DE COLUMNAS
//////////////////////////////////////////////

function ajustarColumnas(container) {
    const grupos = container.querySelectorAll('.form-group');
    container.classList.toggle('multiple-columns', grupos.length > 6);
}

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

window.formLoaders = [loadSucursales];