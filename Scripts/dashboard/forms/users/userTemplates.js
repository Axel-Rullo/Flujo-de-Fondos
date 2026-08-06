window.UserTemplates = {
    avatarColors: [
        "#2563EB", "#16A34A", "#DC2626", "#7C3AED", "#EA580C",
        "#0891B2", "#CA8A04", "#BE185D", "#059669", "#4F46E5",
        "#0D9488", "#9333EA", "#F43F5E", "#0284C7", "#65A30D",
        "#B45309", "#C026D3", "#1D4ED8", "#15803D", "#B91C1C",
        "#7E22CE", "#0F766E", "#D97706", "#DB2777", "#475569"
    ],
    getRandomColor: function() {
        return this.avatarColors[Math.floor(Math.random() * this.avatarColors.length)];
    },
    getAvatar: function(user) {
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
    },

    renderUsersList: function(users, container, estado) {
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
                ${this.getAvatar(user)}
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
    },

    fillUserModal: function(user, container) {
        container.querySelector('.name').textContent = user.nombre;
        container.querySelector('.user').textContent = '@' + user.usuario;
        container.querySelector('.range').textContent = user.rango;
        container.querySelector('.user_dni .value').textContent = user.dni;
        container.querySelector('.phone .value').textContent = user.telefono;
        container.querySelector('.user_email .value').textContent = user.email;
        container.querySelector('.user_branch .value').textContent = user.sucursalNombre || 'Sin sucursal';

        container.querySelector('.user_photo').innerHTML = user.photo
            ? `<img src="http://localhost:8080${user.photo}" alt="" height="193" width="193">`
            : this.getAvatar(user);
    },

    fillEditForm: function(user, container) {
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
};