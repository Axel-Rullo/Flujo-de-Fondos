//////////////////////////////////////////////
// 👥 USER LIST
//////////////////////////////////////////////

(function() {
    const icons = { E: 'icon-users', N: 'icon-user-x' };
    const avatarColors = [
        "#2563EB", "#16A34A", "#DC2626", "#7C3AED", "#EA580C",
        "#0891B2", "#CA8A04", "#BE185D", "#059669", "#4F46E5",
        "#0D9488", "#9333EA", "#F43F5E", "#0284C7", "#65A30D",
        "#B45309", "#C026D3", "#1D4ED8", "#15803D", "#B91C1C",
        "#7E22CE", "#0F766E", "#D97706", "#DB2777", "#475569"
    ];

    let currentUsers = [];
    let currentEstado = 'E';

    function getRandomColor() {return avatarColors[Math.floor(Math.random() * avatarColors.length)];}

    function initStatusSelect() {
        const select = document.querySelector('#user_status');
        if (!select) return;
        const ts = new TomSelect(select, {
            dropdownParent: 'body',
            dropdownClass: 'ts-dropdown status-dropdown',
            controlInput: null,
            render: {
                option: (data) => `<div class="status-icon-${data.value}" title="${data.title}"><svg width="22" height="22"><use href="#${icons[data.value]}"/></svg></div>`,
                item: (data) => `<div class="status-icon-${data.value}" title="${data.title}"><svg width="22" height="22"><use href="#${icons[data.value]}"/></svg></div>`
            }
        });
        ts.setValue('E', true); // sincroniza con la carga inicial de activos, sin disparar 'change'

        ts.on('change', (value) => {renderUserList(value); ts.blur();});
    }

    async function renderUserList(estado = 'E') {
        const container = document.querySelector('.users-container');
        if (!container) return;

        try {
            const ruta = estado == 'N' ? '/user/list/inactive' : '/user/list/active';
            const users = await apiGet(ruta);
            users.forEach(user => user.color = getRandomColor());
            currentUsers = users;
            currentEstado = estado;
            showUsers(currentUsers, container, estado);
        } catch (err) {
            showAlert("Error al cargar la lista de Usuarios", "error", 3000, 'center', true)
            console.error('Error al cargar lista de usuarios:', err);
        }
    }

    function initUsersList() {
        const container = document.querySelector('.users-container');
        if (!container) return;

        renderUserList('E');
        initStatusSelect();
        initSearch(container);
        initActions(container);
    }

    function showUsers(users, container, estado) {
        const html = users.map(user => {
            const botonAction = estado == 'N' ?
            `<button class="btn-reactive-user" data-id="${user.id}" title="Activar">
                <svg width="20" height="20"><use href="#icon-reactive"/></svg>
            </button>`
            :
            `<button class="btn-edit-user" data-id="${user.id}" title="Editar">
                <svg width="20" height="20"><use href="#icon-edit"/></svg>
            </button>`
            ;

            return `
            <div class="user-list">
                ${getAvatar(user)}
                <div class="user-info">
                    <span class="name-list">${user.nombre}</span>
                    <span class="username-list">@${user.usuario}</span>
                </div>
                <span class="range-list">${user.rango}</span>
                <button class="btn-view-user" data-id="${user.id}" title="Ver">
                    <svg width="20" height="20"><use href="#icon-view"/></svg>
                </button>
                ${botonAction}
            </div>
        `;
        }).join('');

        container.innerHTML = html;
    }

    function initSearch(container) {
        const input = document.querySelector('.search-input');
        if (!input) return;

        input.addEventListener('input', () => {
            const texto = input.value.trim().toLowerCase();
            const filtrados = currentUsers.filter(user =>
                user.nombre.toLowerCase().includes(texto) ||
                user.usuario.toLowerCase().includes(texto) ||
                user.dni.toLowerCase().includes(texto)
            );
            showUsers(filtrados, container, currentEstado);
        });
    }

    function initActions(container) {
        container.addEventListener('click', e => {
            const btnView = e.target.closest('.btn-view-user');
            if (btnView) {
                const user = currentUsers.find(u => u.id == btnView.dataset.id);
                abrirModal('./Views/forms/users/user.html').then(modalContainer => {
                    showUser(user, modalContainer);
                });
            }

            const btnEdit = e.target.closest('.btn-edit-user');
            if (btnEdit) {
                const user = currentUsers.find(u => u.id == btnEdit.dataset.id);
                abrirModal('./Views/forms/users/edit_user.html').then(async modalContainer => {
                    await loadSucursales(modalContainer);
                    fillEditForm(user, modalContainer);
                });
            }

            const btnReactive = e.target.closest('.btn-reactive-user');
            if (btnReactive) {
                const id = Number(btnReactive.dataset.id);
                apiPost('/user/reactive', { id }).then(() => {
                    showAlert('¡Usuario reactivado exitosamente!', 'success', 2000, 'top', false);
                    renderUserList(currentEstado);
                }).catch(err => {
                    showAlert('No se pudo reactivar el usuario', 'error', 3000, 'center', true);
                    console.error('Error al reactivar usuario:', err);
                });
            }
        });

        const formUserList = document.querySelector('.form-user-list');
        if (formUserList) {
            formUserList.addEventListener('click', e => {
                const btnAdd = e.target.closest('.btn-add-user');
                if (btnAdd) {
                    abrirModal('./Views/forms/users/new_user.html').then(async modalContainer => {
                        await loadSucursales(modalContainer);
                    });
                }
            });
        }
    }

    function fillEditForm(user, container) {
        const form = container.querySelector('#form_edit_user');

        form.dataset.id = user.id;
        form.dataset.photo = user.photo ?? '';

        const nombre = (user.nombre || '').split(' ')[0] || '';
        const apellido = (user.nombre || '').split(' ').slice(1).join(' ') || '';
        form.querySelector('#name').value = nombre;
        form.querySelector('#lastname').value = apellido;
        form.querySelector('#username').value = user.usuario;
        form.querySelector('#dni').value = user.dni;
        form.querySelector('#range').value = user.rango;
        form.querySelector('#phone_number').value = user.telefono;
        form.querySelector('#email').value = user.email;
        form.querySelector('#branch').tomselect.setValue(user.sucursalNombre || '');
    }

    function showUser(user, container) {
        container.querySelector('.name').textContent = user.nombre;
        container.querySelector('.user').textContent = '@' + user.usuario;
        container.querySelector('.range').textContent = user.rango;
        container.querySelector('.user_dni .value').textContent = user.dni;
        container.querySelector('.phone .value').textContent = user.telefono;
        container.querySelector('.user_email .value').textContent = user.email;
        container.querySelector('.user_branch .value').textContent = user.sucursalNombre || 'Sin sucursal';

        container.querySelector('.user_photo').innerHTML = user.photo
            ? `<img src="http://localhost:8080${user.photo}" alt="" height="193" width="193">`
            : getAvatar(user);
    }

    function getAvatar(user) {
        if (user.photo) {
            return `
                <div class="avatar-list">
                    <img src="http://localhost:8080${user.photo}" alt="" height="40" width="40">
                </div>
            `;
        }

        const parts = user.nombre.trim().split(/\s+/);
        let iniciales = '';
        if (parts.length > 0 && parts[0].length > 0) {
            iniciales += parts[0][0].toUpperCase();
        }
        if (parts.length > 1 && parts[parts.length - 1].length > 0) {
            iniciales += parts[parts.length - 1][0].toUpperCase();
        }

        return `
            <div class="avatar-list">
                <div class="avatar-initials" style="background-color: ${user.color};">
                    ${iniciales}
                </div>
            </div>
        `;
    }

    //////////////////////////////////////////////
    // 📝 FORMULARIOS DE USUARIO (nuevo / editar)
    //////////////////////////////////////////////

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
                const res = await apiPhoto('/user/photo', photo, oldPhoto);
                user.photo = res.photo;
            } else {
                user.photo = form.dataset.photo || null;
            }
            if (form.id === 'form_new_user') {
                const res = await apiPost('/user/new', user);
                if (!res.ok) {
                    showAlert(res.mensaje, 'error', 3000, 'center', true);
                } else {
                    showAlert('¡Usuario ingresado exitosamente!', 'success', 2000, 'top', false);
                    form.reset();
                    abrirModal('./Views/forms/users/users_list.html');
                }
            } else {
                await apiPost('/user/edit', user);
                showAlert('¡Usuario editado exitosamente!', 'success', 2000, 'top', false);
                form.reset();
                abrirModal('./Views/forms/users/users_list.html');
            }
            form.reset();
            abrirModal('./Views/forms/users/users_list.html')
        } catch (err) {
            showAlert('Error al realizar la acción', 'error', 3000, 'center', true);
            console.error('Error al ingresar/editar usuario:', err);
        }
    });
    }

    //////////////////////////////////////////////
    // 📷 FOTO DE PERFIL
    //////////////////////////////////////////////

    function initPhotoUpload() {
        document.addEventListener('click', e => {
            const btnPhoto = e.target.closest('#btn-photo');
            if (!btnPhoto) return;
            btnPhoto.closest('form').querySelector('#photo').click();
        });
    }

    //////////////////////////////////////////////
    // 🗑️ BORRAR USUARIO
    //////////////////////////////////////////////

    function initDeleteUser() {
        document.addEventListener('click', async e => {
            const btnDelete = e.target.closest('#btn-delete');
            if (!btnDelete) return;

            const form = btnDelete.closest('form');
            const id = form.dataset.id;

            try {
                const ok = await showConfirm('¿Esta seguro?');
                if (ok) {
                    await apiPost('/user/delete', { id: Number(id) });
                    showAlert('¡Usuario eliminado exitosamente!', 'success', 2000, 'top', false);
                    abrirModal('./Views/forms/users/users_list.html')
                }
            } catch (err) {
                showAlert('No se pudo eliminar el usuario', 'error', 3000, 'center', true);
                console.error('Error al eliminar usuario:', err);
            }
        });
    }

    initUsersList();

    // Los listeners de document son globales: si el script se re-ejecuta (partial recargado), se duplicarían
    if (!window.__userFormsInit) {
        window.__userFormsInit = true;
        initUserForms();
        initPhotoUpload();
        initDeleteUser();
    }
})();