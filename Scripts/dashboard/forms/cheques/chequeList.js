(function() {
    async function renderChequeList() {
        const container = document.querySelector('.cheques-container');
        if (!container) return;

        const element = container.querySelector('div[id]');
        if (!element) return;

        try {
            if (element.id === 'tabla-cheques-propios'){
            const cheques = await window.ChequeService.listChequesPropios();
            window.ChequeTemplates.crearTablaChequesPropios(cheques)
            } else if (element.id === 'tabla-cheques-terceros') {
                const cheques = await window.ChequeService.listChequesTerceros();
                window.ChequeTemplates.crearTablaChequesTerceros(cheques)
            }
        } catch (err) {
            showAlert("Error al cargar la lista de Cheques", "error", 3000, 'center', true);
            console.error('Error al cargar lista de cheques:', err);
        }
    }

    renderChequeList();
})();