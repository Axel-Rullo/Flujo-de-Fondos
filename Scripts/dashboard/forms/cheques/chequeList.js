(function() {
    const icons = { C: 'icono-cheque-cobrado', R: 'icono-cheque-rechazado', A: 'icono-cheque-anulado' };

    function selectHistorialCheques() {
        const select = document.querySelector('#type-cheque');
        if (!select) return renderChequeList();

        const ts = new TomSelect(select, {
            wrapperClass: 'ts-wrapper type_cheque',
            dropdownParent: 'body',
            dropdownClass: 'ts-dropdown status-dropdown-cheque',
            controlInput: null,
            render: {
                option: (data) => `<div class="status-icon-${data.value}" title="${data.title}"><svg width="28" height="28"><use href="#${icons[data.value]}" xlink:href="#${icons[data.value]}"/></svg></div>`,
                item: (data) => `<div class="status-icon-${data.value}" title="${data.title}"><svg width="28" height="28"><use href="#${icons[data.value]}" xlink:href="#${icons[data.value]}"/></svg></div>`
            }
        });
        ts.setValue('C', true);

        ts.on('change', () => { renderChequeList(); ts.blur(); });

        const selectClase = document.querySelector('#clase-cheque');

        const tsClase = new TomSelect(selectClase, {
            wrapperClass: 'ts-wrapper clase_cheque',
            dropdownParent: 'body',
            controlInput: null
        });
        tsClase.setValue('P', true);

        tsClase.on('change', () => { renderChequeList(); tsClase.blur(); });

        renderChequeList();
    }

    async function renderChequeList() {
        const container = document.querySelector('.cheques-container');
        if (!container) return;

        const title = container.querySelector('.lista_cheques');

        try {
            if (container.querySelector('#tabla-cheques-emitidos')) {
                if (title) title.textContent = 'CHEQUES EMITIDOS';
                const cheques = await window.ChequeService.listChequesPropios('P');
                await window.ChequeTemplates.crearTablaChequesEmitidos(cheques);
            } else if (container.querySelector('#tabla-cheques-acobrar')) {
                if (title) title.textContent = 'CHEQUES A COBRAR';
                const cheques = await window.ChequeService.listChequesTerceros('P');
                await window.ChequeTemplates.crearTablaChequesACobrar(cheques);
            } else if (container.querySelector('#tabla-cheques-historial')) {
                const value = document.querySelector('#type-cheque').value;
                const clase = document.querySelector('#clase-cheque').value;
                try {
                    if (value === 'C') {
                        if (title) title.textContent = 'HISTORIAL DE CHEQUES COBRADOS';
                        if (clase === 'P') {
                            const cheques = await window.ChequeService.listChequesPropios(value);
                            await window.ChequeTemplates.crearTablaChequesEmitidos(cheques);
                        } else {
                            const cheques = await window.ChequeService.listChequesTerceros(value);
                            await window.ChequeTemplates.crearTablaChequesACobrar(cheques);
                        }
                    } else if (value === 'R') {
                        if (title) title.textContent = 'HISTORIAL DE CHEQUES RECHAZADOS';
                        if (clase === 'P') {
                            const cheques = await window.ChequeService.listBajasPropios(value);
                            await window.ChequeTemplates.crearTablaChequesRechAnul(cheques);
                        } else {
                            const cheques = await window.ChequeService.listBajasTerceros(value);
                            await window.ChequeTemplates.crearTablaChequesRechAnul(cheques);
                        }
                    } else {
                        if (title) title.textContent = 'HISTORIAL DE CHEQUES ANULADOS';
                        if (clase === 'P') {
                            const cheques = await window.ChequeService.listBajasPropios(value);
                            await window.ChequeTemplates.crearTablaChequesRechAnul(cheques);
                        } else {
                            const cheques = await window.ChequeService.listBajasTerceros(value);
                            await window.ChequeTemplates.crearTablaChequesRechAnul(cheques);
                        }
                    }
                } catch (err) {
                    showAlert("Error al cargar la lista de Cheques del historial", "error", 3000, 'center', true);
                    console.error('Error al cargar lista de cheques del historial:', err);
                }
            }
        } catch (err) {
            showAlert("Error al cargar la lista de Cheques Emitidos/A Cobrar", "error", 3000, 'center', true);
            console.error('Error al cargar lista de cheques Emitidos/A Cobrar:', err);
        }
    }

    selectHistorialCheques();
})();