(function() {
    if (window.__cliproFormsInit) return;
    window.__cliproFormsInit = true;

    function initCliprosForms() {
        document.addEventListener('submit', async e => {
            const form = e.target;
            if (form.id !== 'form_new_clipro' && form.id !== 'form_edit_clipro') return;

            e.preventDefault();

            const clipro = {
                nombre: form.querySelector('#name').value + ' ' + form.querySelector('#lastname').value,
                dni_cuit: form.querySelector('#dni').value,
                telefono: form.querySelector('#phone_number').value,
                email: form.querySelector('#email').value,
                localidad: form.querySelector('#localidad').value,
                tipo: form.querySelector('#type').value
            };

            if (form.id === 'form_edit_clipro') {
                clipro.id = Number(form.dataset.id);
            }

            try {
                if (form.id === 'form_new_clipro') {
                    const res = await window.CliproService.newClipro(clipro);
                    if (!res.ok) {
                        showAlert(res.mensaje, 'error', 3000, 'center', true);
                    } else {
                        showAlert('¡Cliente/Proveedor ingresado exitosamente!', 'success', 2000, 'top', false);
                        form.reset();
                        abrirModal('./Views/forms/clientprov/clipro_list.html');
                    }
                } else {
                    const res = await window.CliproService.editClipro(clipro);
                    if (!res.ok) {
                        showAlert(res.mensaje, 'error', 3000, 'center', true);
                    } else {
                        showAlert('¡Cliente/Proveedor editado exitosamente!', 'success', 2000, 'top', false);
                        form.reset();
                        abrirModal('./Views/forms/clientprov/clipro_list.html');
                    }
                }
            } catch (err) {
                showAlert('Error al realizar la acción', 'error', 3000, 'center', true);
                console.error('Error al ingresar o editar al cliente/proveedor:', err);
            }
        });
    }

    function initDeleteClipro() {
        document.addEventListener('click', async e => {
            const btnDelete = e.target.closest('#btn-delete-clipro');
            if (!btnDelete) return;

            const form = btnDelete.closest('form');
            const id = form.dataset.id;

            try {
                const ok = await showConfirm('¿Esta seguro?');
                if (ok) {
                    await window.CliproService.deleteClipro(id);
                    showAlert('¡Cliente/Proveedor eliminado exitosamente!', 'success', 2000, 'top', false);
                    abrirModal('./Views/forms/clientprov/clipro_list.html');
                }
            } catch (err) {
                showAlert('No se pudo eliminar el cliente/proveedor', 'error', 3000, 'center', true);
                console.error('Error al eliminar cliente/proveedor:', err);
            }
        });
    }

    initCliprosForms();
    initDeleteClipro();
})();