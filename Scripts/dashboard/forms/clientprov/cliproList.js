(function() {
    const icons = { E: 'icon-entitys', N: 'icon-entity-x' };
    let currentClipros = [];
    let currentEstado = 'E';

    function initStatusSelect() {
        const select = document.querySelector('#clipro_status');
        if (!select) return;
        const ts = new TomSelect(select, {
            dropdownParent: 'body',
            dropdownClass: 'ts-dropdown status-dropdown',
            controlInput: null,
            render: {
                option: (data) => `<div class="status-icon-${data.value}" title="${data.title}"><svg width="22" height="22"><use href="#${icons[data.value]}" xlink:href="#${icons[data.value]}"/></svg></div>`,
                item: (data) => `<div class="status-icon-${data.value}" title="${data.title}"><svg width="22" height="22"><use href="#${icons[data.value]}" xlink:href="#${icons[data.value]}"/></svg></div>`
            }
        });
        ts.setValue('E', true); 

        ts.on('change', (value) => { renderCliproList(value); ts.blur(); });
    }

    async function renderCliproList(estado = "E") {
        const container = document.querySelector('.entity-container');
        if (!container) return;

        try {
            const clipros = await window.CliproService.getClipros(estado);
            clipros.forEach(clipro => clipro.color = window.CliproTemplates.getRandomColor());
            currentClipros = clipros;
            currentEstado = estado;
            window.CliproTemplates.renderCliprosList(currentClipros, container, estado);
        } catch (err) {
            showAlert("Error al cargar la lista de Clientes/Proveedores", "error", 3000, 'center', true);
            console.error('Error al cargar lista de clientes/proveedores:', err);
        }
    }

    function initSearch(container) {
        const input = document.querySelector('.search-input');
        if (!input) return;

        input.addEventListener('input', () => {
            const texto = input.value.trim().toLowerCase();
            const filtrados = currentClipros.filter(clipro =>
                clipro.nombre.toLowerCase().includes(texto) ||
                (clipro.dni_cuit || '').toLowerCase().includes(texto)
            );
            window.CliproTemplates.renderCliprosList(filtrados, container, currentEstado);
        });
    }

    function initActions(container) {
        container.addEventListener('click', e => {
            const btnView = e.target.closest('.btn-view-entity');
            if (btnView) {
                const clipro = currentClipros.find(c => c.id == btnView.dataset.id);
                abrirModal('./Views/forms/clientprov/clipro.html').then(modalContainer => {
                    window.CliproTemplates.fillCliproModal(clipro, modalContainer);
                });
            }

            const btnEdit = e.target.closest('.btn-edit-entity');
            if (btnEdit) {
                const clipro = currentClipros.find(c => c.id == btnEdit.dataset.id);
                abrirModal('./Views/forms/clientprov/edit_clipro.html').then(modalContainer => {
                    window.CliproTemplates.fillEditForm(clipro, modalContainer);
                });
            }

            const btnReactive = e.target.closest('.btn-reactive-entity');
            if (btnReactive) {
                const id = btnReactive.dataset.id;
                window.CliproService.reactivateClipro(id).then(() => {
                    showAlert('¡Cliente/Proveedor reactivado exitosamente!', 'success', 2000, 'top', false);
                    renderCliproList(currentEstado);
                }).catch(err => {
                    showAlert('No se pudo reactivar el cliente/proveedor', 'error', 3000, 'center', true);
                    console.error('Error al reactivar cliente/proveedor:', err);
                });
            }
        });

        const formCliproList = document.querySelector('.form-entity-list');
        if (formCliproList) {
            formCliproList.addEventListener('click', e => {
                const btnAdd = e.target.closest('.btn-add-entity');
                if (btnAdd) {
                    abrirModal('./Views/forms/clientprov/new_clipro.html');
                }
            });
        }
    }

    function initCliproList() {
        const container = document.querySelector('.entity-container');
        if (!container) return;

        renderCliproList('E');
        initStatusSelect();
        initSearch(container);
        initActions(container);
    }

    initCliproList();
})();