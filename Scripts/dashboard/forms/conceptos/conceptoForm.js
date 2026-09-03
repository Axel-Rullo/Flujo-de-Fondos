(function() {
    if (window.__conceptoFormsInit) return;
    window.__conceptoFormsInit = true;

    function initConceptoForms() {
        document.addEventListener('submit', async e => {
            const form = e.target;
            if (form.id !== 'form_new_concepto' && form.id !== 'form_edit_concepto') return;

            e.preventDefault();
            const concepto = {};
            concepto.nombre = form.querySelector('#name').value;
            
                try {
                    if (form.id === 'form_new_concepto') {
                        concepto.clasificacion = form.querySelector('#clasificacion').value
                        const res = await window.ConceptoService.newConcepto(concepto);
                        if (!res.ok) {
                            showAlert(res.mensaje, 'error', 3000, 'center', true);
                        } else {
                            showAlert('¡Concepto ingresado exitosamente!', 'success', 2000, 'top', false);
                            form.reset();
                            window.cerrarModal();
                            cargarParcial('Views/queries/cuentas.html')
                        }
                    } else {
                        concepto.id = Number(form.dataset.id);
                        const res = await window.ConceptoService.editConcepto(concepto);
                        if (!res.ok) {
                            showAlert(res.mensaje, 'error', 3000, 'center', true);
                        } else {
                            showAlert('¡Concepto editado exitosamente!', 'success', 2000, 'top', false);
                            form.reset();
                            window.cerrarModal();
                            cargarParcial('Views/queries/cuentas.html');
                        }
                    }
                } catch (err) {
                    showAlert('Error al ingresar concepto', 'error', 3000, 'center', true);
                    console.error('Error al realizar la acción:', err);
                }
        });
    }

    initConceptoForms();
})();