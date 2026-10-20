(function() {
    async function renderConceptoList() {
        const container = document.querySelector('.conceptos-container');
        if (!container) return;


        try {
            const conceptos = await window.ConceptoService.listConceptos();
            window.ConceptoTemplates.crearTablaConceptos(conceptos);
        } catch (err) {
            showAlert("Error al cargar la lista de Conceptos", "error", 3000, 'center', true);
            console.error('Error al cargar lista de conceptos:', err);
        }
    }

    renderConceptoList();
})();