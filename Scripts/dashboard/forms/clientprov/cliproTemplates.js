window.CliproTemplates = {
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
    getAvatar: function(clipro, size = 40) {
        const parts = clipro.nombre.trim().split(/\s+/);
        let iniciales = '';
        if (parts.length > 0 && parts[0].length > 0) {
            iniciales += parts[0][0].toUpperCase();
        }
        if (parts.length > 1 && parts[parts.length - 1].length > 0) {
            iniciales += parts[parts.length - 1][0].toUpperCase();
        }

        return `
            <div class="avatar-list">
                <div class="avatar-initials" style="background-color: ${clipro.color}; width: ${size}px; height: ${size}px;">
                    ${iniciales}
                </div>
            </div>
        `;
    },

    renderCliprosList: function(clipros, container, estado) {
        const html = clipros.map(clipro => {
            const botonAction = estado == 'N' ?
            `<button class="btn-reactive-entity" data-id="${clipro.id}" title="Activar">
                <svg width="20" height="20"><use href="#icon-reactive" xlink:href="#icon-reactive"/></svg>
            </button>`
            :
            `<button class="btn-edit-entity" data-id="${clipro.id}" title="Editar">
                <svg width="20" height="20"><use href="#icon-edit" xlink:href="#icon-edit"/></svg>
            </button>`
            ;

            return `
            <div class="entity-row">
                ${this.getAvatar(clipro)}
                <div class="entity-info">
                    <span class="name-list">${clipro.nombre}</span>
                </div>
                <span class="range-list">
                    ${clipro.tipo === "C" ? "Cliente" : "Proveedor"}
                </span>
                <button class="btn-view-entity" data-id="${clipro.id}" title="Ver">
                    <svg width="20" height="20"><use href="#icon-view" xlink:href="#icon-view"/></svg>
                </button>
                ${botonAction}
            </div>
        `;
        }).join('');

        container.innerHTML = html;
    },

    fillCliproModal: function(clipro, container) {
        container.querySelector('.name').textContent = clipro.nombre;
        container.querySelector('.range').textContent = clipro.tipo === "C" ? "Cliente" : "Proveedor";
        container.querySelector('.clipro_dni .value').textContent = clipro.dni_cuit;
        container.querySelector('.phone .value').textContent = clipro.telefono;
        container.querySelector('.clipro_email .value').textContent = clipro.email;
        container.querySelector('.clipro_localidad .value').textContent = clipro.localidad || 'Sin localidad';

        container.querySelector('.clipro_photo').innerHTML = this.getAvatar(clipro, 193);
    },

    fillEditForm: function(clipro, container) {
        const form = container.querySelector('#form_edit_clipro');

        form.dataset.id = clipro.id;

        const nombre = (clipro.nombre || '').split(' ')[0] || '';
        const apellido = (clipro.nombre || '').split(' ').slice(1).join(' ') || '';
        form.querySelector('#name').value = nombre;
        form.querySelector('#lastname').value = apellido;
        form.querySelector('#dni').value = clipro.dni_cuit;
        form.querySelector('#phone_number').value = clipro.telefono;
        form.querySelector('#email').value = clipro.email;
        form.querySelector('#localidad').value = clipro.localidad;
        form.querySelector('#type').value = clipro.tipo;
    }
};