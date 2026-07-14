//////////////////////////////////////////////
// 👥 USER LIST
//////////////////////////////////////////////

(function() {
    const avatarColors = [
        "#2563EB", "#16A34A", "#DC2626", "#7C3AED", "#EA580C",
        "#0891B2", "#CA8A04", "#BE185D", "#059669", "#4F46E5",
        "#0D9488", "#9333EA", "#F43F5E", "#0284C7", "#65A30D",
        "#B45309", "#C026D3", "#1D4ED8", "#15803D", "#B91C1C",
        "#7E22CE", "#0F766E", "#D97706", "#DB2777", "#475569"
    ];

    function getRandomColor() {
        return avatarColors[Math.floor(Math.random() * avatarColors.length)];
    }

    async function renderUserList() {
        const container = document.querySelector('.users-container');
        if (!container) return;

        try {
            const users = await apiGet('/user/list');
            users.forEach(user => user.color = getRandomColor());
            showUsers(users, container);
            initSearch(users, container);
            initActions(users, container);
        } catch (err) {
            console.error('Error al cargar lista de usuarios:', err);
            container.insertAdjacentHTML('beforeend', `<p style="color:red">Error: ${err.message}</p>`);
        }
    }

    function showUsers(users, container) {
        const html = users.map(user => `
            <div class="user-list">
                ${getAvatar(user)}
                <div class="user-info">
                    <span class="name-list">${user.nombre}</span>
                    <span class="username-list">@${user.usuario}</span>
                </div>
                <span class="range-list">${user.rango}</span>
                <button class="btn-view"  data-id="${user.id}" title="Ver">
                    <svg width="18" height="18"><use href="#icon-view"/></svg>
                </button>
                <button class="btn-edit"  data-id="${user.id}" title="Editar">
                    <svg width="18" height="18"><use href="#icon-edit"/></svg>
                </button>
            </div>
        `).join('');

        container.innerHTML = html;
    }

    function initSearch(users, container) {
        const input = document.querySelector('.search-input');
        if (!input) return;

        input.addEventListener('input', () => {
            const texto = input.value.trim().toLowerCase();
            const filtrados = users.filter(user =>
                user.nombre.toLowerCase().includes(texto) ||
                user.usuario.toLowerCase().includes(texto)
            );
            showUsers(filtrados, container);
        });
    }

    function initActions(users, container) {
        container.addEventListener('click', e => {
            const btnView = e.target.closest('.btn-view');
            if (btnView) {
                const user = users.find(u => u.id == btnView.dataset.id);
                abrirModal('./Views/forms/users/user.html').then(modalContainer => {
                    showUser(user, modalContainer);
                });
            }
        });
    }

    function showUser(user, container) {
        container.querySelector('.name').textContent = user.nombre;
        container.querySelector('.user').textContent = '@' + user.usuario;
        container.querySelector('.range').textContent = user.rango;
        container.querySelector('.user_dni .value').textContent = user.dni;
        container.querySelector('.phone .value').textContent = user.telefono;
        container.querySelector('.user_email .value').textContent = user.email;

        container.querySelector('.user_photo').innerHTML = user.foto
            ? `<img src="${user.foto}" alt="" height="96" width="96">`
            : getAvatar(user);
    }

    function getAvatar(user) {
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

    renderUserList();
})();