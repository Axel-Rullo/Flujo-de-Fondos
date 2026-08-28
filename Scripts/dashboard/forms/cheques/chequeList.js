(function() {
    async function renderChequeList() {
        const container = document.querySelector('.cheques-container');
        if (!container) return;
        try {
            const cheques = await window.ChequeService.listChequesPropios();
            window.ChequeTemplates.crearTablaCheques(cheques)
        } catch (err) {
            showAlert("Error al cargar la lista de Cheques", "error", 3000, 'center', true);
            console.error('Error al cargar lista de cheques:', err);
        }
    }

    renderChequeList();
})();