(function() {
    if (window.__tercerosFormsInit) return;
    window.__tercerosFormsInit = true;

    const LIST_VIEW = 'views/forms/clients/tercero_list.html';

    // ── ALTA Y EDICIÓN ───────────────────────────────────────────────

    function initTercerosForms() {
        document.addEventListener('submit', async e => {
            const form = e.target;
            const isNew = form.id === 'form_new_tercero';
            if (!isNew && form.id !== 'form_edit_tercero') return;

            e.preventDefault();

            const dni_cuit = form.querySelector('#dni').value;
            const errorDocumento = validarDocumento(dni_cuit, form.querySelector('#doc_type').value);
            if (errorDocumento) {
                showAlert(errorDocumento, 'error', 3000, 'center', true);
                return;
            }

            const tercero = {
                razon_social: form.querySelector('#razon_social').value.trim(),
                dni_cuit: dni_cuit,
                telefono: form.querySelector('#phone_number').value,
                email: form.querySelector('#email').value,
                localidad: form.querySelector('#localidad').value,
                tipo: form.querySelector('#type').value
            };

            if (!isNew) {
                tercero.id_clipro = Number(form.dataset.id);
            }

            try {
                const res = isNew
                    ? await window.TerceroService.newTercero(tercero)
                    : await window.TerceroService.editTercero(tercero);

                if (!res.ok) {
                    showAlert(res.mensaje, 'error', 3000, 'center', true);
                    return;
                }

                showAlert(isNew ? '¡Cliente/Proveedor ingresado exitosamente!' : '¡Cliente/Proveedor editado exitosamente!', 'success', 2000, 'top', false);
                abrirModal(LIST_VIEW);
            } catch (err) {
                showAlert('Error al realizar la acción', 'error', 3000, 'center', true);
                console.error('Error al ingresar o editar al cliente/proveedor:', err);
            }
        });
    }

    // ── BAJA ─────────────────────────────────────────────────────────

    function initDeleteTercero() {
        document.addEventListener('click', async e => {
            const btnDelete = e.target.closest('#btn-delete-tercero');
            if (!btnDelete) return;

            const id = btnDelete.closest('form').dataset.id;

            try {
                const ok = await showConfirm('¿Esta seguro?');
                if (ok) {
                    await window.TerceroService.deleteTercero(id);
                    showAlert('¡Cliente/Proveedor eliminado exitosamente!', 'success', 2000, 'top', false);
                    abrirModal(LIST_VIEW);
                }
            } catch (err) {
                showAlert('No se pudo eliminar el cliente/proveedor', 'error', 3000, 'center', true);
                console.error('Error al eliminar cliente/proveedor:', err);
            }
        });
    }

    initTercerosForms();
    initDeleteTercero();
})();
