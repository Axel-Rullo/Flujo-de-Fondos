(function() {

    // ── CONFIGURACIÓN ────────────────────────────────────────────────

    const icons = { E: 'icon-entitys', N: 'icon-entity-x' };
    const VIEWS = 'views/forms/clients/';
    const PAGE_SIZE = 50;
    const MAX_TERCEROS = 500;

    let currentTerceros = [];
    let currentEstado = 'E';
    let currentSearch = '';
    let loading = false;
    let finished = false;
    let version = 0;

    // ── CARGA DE LA LISTA ────────────────────────────────────────────

    // reset = true arranca de cero (cambia estado o búsqueda); false pide la siguiente tanda
    async function loadTerceros(reset = false) {
        const container = document.querySelector('.entity-container');
        if (!container) return;

        if (reset) {
            version++;
            currentTerceros = [];
            finished = false;
            container.scrollTop = 0;
        } else if (loading || finished) {
            return;
        }

        const myVersion = version;
        const limit = Math.min(PAGE_SIZE, MAX_TERCEROS - currentTerceros.length);
        loading = true;

        try {
            const terceros = await window.TerceroService.getTerceros(currentEstado, currentSearch, limit, currentTerceros.length);
            if (myVersion !== version) return;

            currentTerceros = currentTerceros.concat(terceros);
            finished = terceros.length < limit || currentTerceros.length >= MAX_TERCEROS;
            window.TerceroTemplates.renderTercerosList(terceros, container, currentEstado, reset);
        } catch (err) {
            if (myVersion !== version) return;
            showAlert("Error al cargar la lista de Clientes/Proveedores", "error", 3000, 'center', true);
            console.error('Error al cargar lista de clientes/proveedores:', err);
        } finally {
            if (myVersion === version) loading = false;
        }
    }

    // ── FILTRO DE ESTADO ─────────────────────────────────────────────

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

        ts.on('change', (value) => {
            currentEstado = value;
            loadTerceros(true);
            ts.blur();
        });
    }

    // ── BUSCADOR ─────────────────────────────────────────────────────

    function initSearch() {
        const input = document.querySelector('.search-input');
        if (!input) return;

        let timer;
        input.addEventListener('input', () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                currentSearch = input.value.trim();
                loadTerceros(true);
            }, 300);
        });
    }

    // ── SCROLL INFINITO ──────────────────────────────────────────────

    function initScroll(container) {
        container.addEventListener('scroll', () => {
            if (container.scrollTop + container.clientHeight >= container.scrollHeight * 0.75) {
                loadTerceros();
            }
        });
    }

    // ── ACCIONES ─────────────────────────────────────────────────────

    function initActions(container) {
        container.addEventListener('click', e => {
            const btnView = e.target.closest('.btn-view-entity');
            if (btnView) {
                const tercero = currentTerceros.find(c => c.id_clipro == btnView.dataset.id);
                abrirModal(VIEWS + 'tercero.html').then(modalContainer => {
                    window.TerceroTemplates.fillTerceroModal(tercero, modalContainer);
                });
            }

            const btnEdit = e.target.closest('.btn-edit-entity');
            if (btnEdit) {
                const tercero = currentTerceros.find(c => c.id_clipro == btnEdit.dataset.id);
                abrirModal(VIEWS + 'edit_tercero.html').then(modalContainer => {
                    window.TerceroTemplates.fillEditForm(tercero, modalContainer);
                });
            }

            const btnReactive = e.target.closest('.btn-reactive-entity');
            if (btnReactive) {
                window.TerceroService.reactivateTercero(btnReactive.dataset.id).then(() => {
                    showAlert('¡Cliente/Proveedor reactivado exitosamente!', 'success', 2000, 'top', false);
                    loadTerceros(true);
                }).catch(err => {
                    showAlert('No se pudo reactivar el cliente/proveedor', 'error', 3000, 'center', true);
                    console.error('Error al reactivar cliente/proveedor:', err);
                });
            }
        });
    }

    // ── INICIO ───────────────────────────────────────────────────────

    function initTerceroList() {
        const container = document.querySelector('.entity-container');
        if (!container) return;

        loadTerceros(true);
        initStatusSelect();
        initSearch();
        initScroll(container);
        initActions(container);
    }

    initTerceroList();
})();
