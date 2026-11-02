window.TerceroTemplates = {

    // ── AVATAR ───────────────────────────────────────────────────────

    avatarColors: [
        "#2563EB", "#16A34A", "#DC2626", "#7C3AED", "#EA580C",
        "#0891B2", "#CA8A04", "#BE185D", "#059669", "#4F46E5",
        "#0D9488", "#9333EA", "#F43F5E", "#0284C7", "#65A30D",
        "#B45309", "#C026D3", "#1D4ED8", "#15803D", "#B91C1C",
        "#7E22CE", "#0F766E", "#D97706", "#DB2777", "#475569"
    ],

    colorIndex: 0,

    getRandomColor: function() {
        const color = this.avatarColors[this.colorIndex % this.avatarColors.length];
        this.colorIndex++;
        return color;
    },

    getAvatar: function(tercero, size = 40) {
        const parts = tercero.razon_social.trim().split(/\s+/);
        let iniciales = '';
        if (parts.length > 0 && parts[0].length > 0) {
            iniciales += parts[0][0].toUpperCase();
        }
        if (parts.length > 1 && parts[parts.length - 1].length > 0) {
            iniciales += parts[parts.length - 1][0].toUpperCase();
        }

        return `
            <div class="avatar-list">
                <div class="avatar-initials" style="background-color: ${tercero.color}; width: ${size}px; height: ${size}px;">
                    ${iniciales}
                </div>
            </div>
        `;
    },

    // ── LISTA ────────────────────────────────────────────────────────

    // reemplazar = true vacía la lista; false agrega las filas al final (scroll infinito)
    renderTercerosList: function(terceros, container, estado, reemplazar = true) {
        if (reemplazar) this.colorIndex = 0;

        const html = terceros.map(tercero => {
            tercero.color = this.getRandomColor();

            const botonAction = estado === 'N' ?
            `<button class="btn-reactive-entity" data-id="${tercero.id_clipro}" title="Activar">
                <svg width="20" height="20"><use href="#icon-reactive" xlink:href="#icon-reactive"/></svg>
            </button>`
            :
            `<button class="btn-edit-entity" data-id="${tercero.id_clipro}" title="Editar">
                <svg width="20" height="20"><use href="#icon-edit" xlink:href="#icon-edit"/></svg>
            </button>`;

            return `
            <div class="entity-row">
                ${this.getAvatar(tercero)}
                <div class="entity-info">
                    <span class="name-list">${tercero.razon_social}</span>
                </div>
                <span class="range-list">
                    ${tercero.tipo === "C" ? "Cliente" : "Proveedor"}
                </span>
                <button class="btn-view-entity" data-id="${tercero.id_clipro}" title="Ver">
                    <svg width="20" height="20"><use href="#icon-view" xlink:href="#icon-view"/></svg>
                </button>
                ${botonAction}
            </div>
        `;
        }).join('');

        if (reemplazar) {
            container.innerHTML = html;
        } else {
            container.insertAdjacentHTML('beforeend', html);
        }
    },

    // ── PERFIL ───────────────────────────────────────────────────────

    fillTerceroModal: function(tercero, container) {
        container.querySelector('.name').textContent = tercero.razon_social;
        container.querySelector('.range').textContent = tercero.tipo === "C" ? "Cliente" : "Proveedor";
        container.querySelector('.clipro_dni .value').textContent = tercero.dni_cuit;
        container.querySelector('.phone .value').textContent = tercero.telefono;
        container.querySelector('.clipro_email .value').textContent = tercero.email;
        container.querySelector('.clipro_localidad .value').textContent = tercero.localidad || 'Sin localidad';

        container.querySelector('.clipro_photo').innerHTML = this.getAvatar(tercero, 193);
    },

    // ── EDICIÓN ──────────────────────────────────────────────────────

    fillEditForm: function(tercero, container) {
        const form = container.querySelector('#form_edit_tercero');

        const dni_cuit = tercero.dni_cuit || '';
        const tipoDoc = dni_cuit.replace(/\D/g, '').length === 11 ? 'CUIT' : 'DNI';

        form.dataset.id = tercero.id_clipro;

        form.querySelector('#razon_social').value = tercero.razon_social;
        form.querySelector('#doc_type').value = tipoDoc;
        form.querySelector('#dni').value = formatearDocumento(dni_cuit, tipoDoc);
        form.querySelector('#phone_number').value = tercero.telefono || '';
        form.querySelector('#email').value = tercero.email || '';
        form.querySelector('#localidad').value = tercero.localidad || '';
        form.querySelector('#type').value = tercero.tipo;
    }
};
