(function() {
    const icons = { E: 'icon-users', N: 'icon-user-x' };
    let currentUsers = [];
    let currentEstado = 'E';

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
        ts.setValue('E', true); 

        ts.on('change', (value) => { renderUserList(value); ts.blur(); });
    }

    async function renderUserList(estado = 'E') {
        const container = document.querySelector('.users-container');
        if (!container) return;

        try {
            const users = await window.UserService.getUsers(estado);
            users.forEach(user => user.color = window.UserTemplates.getRandomColor());
            currentUsers = users;
            currentEstado = estado;
            window.UserTemplates.renderUsersList(currentUsers, container, estado);
        } catch (err) {
            showAlert("Error al cargar la lista de Usuarios", "error", 3000, 'center', true);
            console.error('Error al cargar lista de usuarios:', err);
        }
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
            window.UserTemplates.renderUsersList(filtrados, container, currentEstado);
        });
    }

    function initActions(container) {
        container.addEventListener('click', e => {
            const btnView = e.target.closest('.btn-view-user');
            if (btnView) {
                const user = currentUsers.find(u => u.id == btnView.dataset.id);
                abrirModal('./Views/forms/users/user.html').then(modalContainer => {
                    window.UserTemplates.fillUserModal(user, modalContainer);
                });
            }

            const btnEdit = e.target.closest('.btn-edit-user');
            if (btnEdit) {
                const user = currentUsers.find(u => u.id == btnEdit.dataset.id);
                abrirModal('./Views/forms/users/edit_user.html').then(async modalContainer => {
                    await loadSucursales(modalContainer);
                    window.UserTemplates.fillEditForm(user, modalContainer);
                });
            }

            const btnReactive = e.target.closest('.btn-reactive-user');
            if (btnReactive) {
                const id = btnReactive.dataset.id;
                window.UserService.reactivateUser(id).then(() => {
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

    function initUsersList() {
        const container = document.querySelector('.users-container');
        if (!container) return;

        renderUserList('E');
        initStatusSelect();
        initSearch(container);
        initActions(container);
    }

    initUsersList();
})();
