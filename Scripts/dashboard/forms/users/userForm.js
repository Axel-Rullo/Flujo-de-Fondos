(function() {
    if (window.__userFormsInit) return;
    window.__userFormsInit = true;

    function initUserForms() {
        document.addEventListener('submit', async e => {
            const form = e.target;
            if (form.id !== 'form_new_user' && form.id !== 'form_edit_user') return;

            e.preventDefault();

            const user = {
                nombre: form.querySelector('#name').value + ' ' + form.querySelector('#lastname').value,
                usuario: form.querySelector('#username').value,
                password: form.querySelector('#password').value,
                dni: form.querySelector('#dni').value,
                rango: form.querySelector('#range').value,
                telefono: form.querySelector('#phone_number').value,
                email: form.querySelector('#email').value,
                sucursalNombre: form.querySelector('#branch').value
            };

            if (form.id === 'form_edit_user') {
                user.id = Number(form.dataset.id);
            }

            try {
                const photo = form.querySelector('#photo').files[0];
                if (photo) {
                    const oldPhoto = form.dataset.photo;
                    const res = await window.UserService.uploadPhoto(photo, oldPhoto);
                    user.photo = res.photo;
                } else {
                    user.photo = form.dataset.photo || null;
                }
                
                if (form.id === 'form_new_user') {
                    const res = await window.UserService.newUser(user);
                    if (!res.ok) {
                        showAlert(res.mensaje, 'error', 3000, 'center', true);
                    } else {
                        showAlert('¡Usuario ingresado exitosamente!', 'success', 2000, 'top', false);
                        form.reset();
                        abrirModal('./Views/forms/users/users_list.html');
                    }
                } else {
                    const res = await window.UserService.editUser(user);
                    if (!res.ok) {
                        showAlert(res.mensaje, 'error', 3000, 'center', true);
                    } else {
                        showAlert('¡Usuario editado exitosamente!', 'success', 2000, 'top', false);
                        form.reset();
                        abrirModal('./Views/forms/users/users_list.html');
                    }
                }
            } catch (err) {
                showAlert('Error al realizar la acción', 'error', 3000, 'center', true);
                console.error('Error al ingresar/editar usuario:', err);
            }
        });
    }

    function initPhotoUpload() {
        document.addEventListener('click', e => {
            const btnPhoto = e.target.closest('#btn-photo');
            if (!btnPhoto) return;
            btnPhoto.closest('form').querySelector('#photo').click();
        });
    }

    function initDeleteUser() {
        document.addEventListener('click', async e => {
            const btnDelete = e.target.closest('#btn-delete');
            if (!btnDelete) return;

            const form = btnDelete.closest('form');
            const id = form.dataset.id;

            try {
                const ok = await showConfirm('¿Esta seguro?');
                if (ok) {
                    await window.UserService.deleteUser(id);
                    showAlert('¡Usuario eliminado exitosamente!', 'success', 2000, 'top', false);
                    abrirModal('./Views/forms/users/users_list.html');
                }
            } catch (err) {
                showAlert('No se pudo eliminar el usuario', 'error', 3000, 'center', true);
                console.error('Error al eliminar usuario:', err);
            }
        });
    }

    initUserForms();
    initPhotoUpload();
    initDeleteUser();
})();
