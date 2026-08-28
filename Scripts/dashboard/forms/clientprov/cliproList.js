// cliproList.js
(function() {
    let currentClipros = [];

    async function renderCliproList() {
        const container = document.querySelector('.entity-container');
        if (!container) return;

        try {
            const clipros = await window.CliproService.getClipros();
            clipros.forEach(clipro => clipro.color = window.CliproTemplates.getRandomColor());
            currentClipros = clipros;
            window.CliproTemplates.renderCliprosList(currentClipros, container);
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
            window.CliproTemplates.renderCliprosList(filtrados, container);
        });
    }

    function initActions(container) {
        container.addEventListener('click', e => {
            const btnView = e.target.closest('.btn-view-entity');
            if (btnView) {
                const clipro = currentClipros.find(c => c.id == btnView.dataset.id);
                abrirModal('./Views/forms/clientprov/clipro.html').then(modalContainer => {
                    window.CliproTemplates.fillUserModal(clipro, modalContainer);
                });
            }

            const btnEdit = e.target.closest('.btn-edit-entity');
            if (btnEdit) {
                const clipro = currentClipros.find(c => c.id == btnEdit.dataset.id);
                abrirModal('./Views/forms/clientprov/edit_clipro.html').then(modalContainer => {
                    window.CliproTemplates.fillEditForm(clipro, modalContainer);
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

        renderCliproList();
        initSearch(container);
        initActions(container);
    }

    initCliproList();
})();