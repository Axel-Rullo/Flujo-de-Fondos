(function() {
    const iconos = { C: 'icono-cheque-cobrado', R: 'icono-cheque-rechazado', A: 'icono-cheque-anulado' };
    const titulos = {
        P: 'CARTERA DE CHEQUES',
        T: 'HISTORIAL DE CHEQUES',
        C: 'HISTORIAL DE CHEQUES COBRADOS',
        R: 'HISTORIAL DE CHEQUES RECHAZADOS',
        A: 'HISTORIAL DE CHEQUES ANULADOS'
    };

    // ── PAGINACIÓN Y BÚSQUEDA ──
    const TAMANIO_PAGINA = 50;
    const MAXIMO_CHEQUES = 5000;
    const UMBRAL_SCROLL = 0.70;
    const DEMORA_BUSQUEDA = 400;

    let tabla = null;
    let estado = 'P'; // P = Cartera. En el historial: T (Todos), C, R o A
    let cantidadCargada = 0;
    let hayMas = true;
    let cargando = false;
    let idConsulta = 0;
    let textoBusqueda = '';

    // ── FILTRO DE ESTADO (SOLO HISTORIAL) ──
    function iconoEstado(valor) {
        if (valor === 'T') return '<svg width="22" height="22" viewBox="0 0 24 24"><use href="#icon-cheque" xlink:href="#icon-cheque"/></svg>';
        return `<svg width="28" height="28"><use href="#${iconos[valor]}" xlink:href="#${iconos[valor]}"/></svg>`;
    }

    function initFiltro() {
        const selectEstado = document.querySelector('#type-cheque');
        if (!selectEstado) return;

        const tsEstado = new TomSelect(selectEstado, {
            wrapperClass: 'ts-wrapper clase_cheque',
            dropdownParent: 'body',
            dropdownClass: 'ts-dropdown status-dropdown-cheque',
            controlInput: null,
            render: {
                option: (datos) => `<div class="status-icon-${datos.value}" title="${datos.title}">${iconoEstado(datos.value)}</div>`,
                item: (datos) => `<div class="status-icon-${datos.value}" title="${datos.title}">${iconoEstado(datos.value)}</div>`
            }
        });
        tsEstado.setValue('T', true);

        tsEstado.on('change', () => { resetCheques(); tsEstado.blur(); });
    }

    // ── CARGA DE CHEQUES ──

    // Vuelve a la primera página (cambio de estado o de búsqueda)
    function resetCheques() {
        estado = document.querySelector('#type-cheque')?.value || 'P';
        document.querySelector('.lista_cheques').textContent = titulos[estado];

        tabla = null;
        cantidadCargada = 0;
        hayMas = true;
        cargando = false;
        idConsulta++;

        loadCheques();
    }

    // Trae la página siguiente; si todavía no hay tabla, la crea con la primera
    async function loadCheques() {
        if (cargando || !hayMas) return;

        const consultaActual = idConsulta;
        cargando = true;

        try {
            const cheques = estado === 'P'
                ? await window.ChequeService.listCartera(textoBusqueda, TAMANIO_PAGINA, cantidadCargada)
                : await window.ChequeService.listHistorial(estado, textoBusqueda, TAMANIO_PAGINA, cantidadCargada);
            if (consultaActual !== idConsulta) return;

            if (tabla) {
                await tabla.addData(cheques);
            } else {
                const plantillas = window.ChequeTemplates;
                const tablaNueva = await (estado === 'P' ? plantillas.crearTablaCartera(cheques) : plantillas.crearTablaHistorial(cheques));
                if (consultaActual !== idConsulta) return;

                tabla = tablaNueva;
                tabla.on('tableBuilt', initScroll);
            }

            cantidadCargada += cheques.length;
            hayMas = cheques.length === TAMANIO_PAGINA && cantidadCargada < MAXIMO_CHEQUES;

            if (cheques.length === TAMANIO_PAGINA && !hayMas) {
                showAlert('Se alcanzó el límite de ' + MAXIMO_CHEQUES + ' cheques.\nUsá el buscador para acotar los resultados.', 'info', 4000, 'top', false);
            }
        } catch (err) {
            hayMas = false;
            showAlert('Error al cargar los Cheques', 'error', 3000, 'center', true);
            console.error('Error al cargar cheques:', err);
        } finally {
            if (consultaActual === idConsulta) cargando = false;
        }

        if (consultaActual === idConsulta) checkScroll();
    }

    // ── SCROLL INFINITO ──

    // Si se pasó del umbral, pide la página siguiente (también rellena la tabla si quedó corta)
    function checkScroll() {
        const contenido = tabla && tabla.element.querySelector('.tabulator-tableholder');
        if (!contenido) return;

        if ((contenido.scrollTop + contenido.clientHeight) / contenido.scrollHeight >= UMBRAL_SCROLL) loadCheques();
    }

    // El scroll es de la propia tabla: el listener se crea con cada tabla nueva
    function initScroll() {
        tabla.element.querySelector('.tabulator-tableholder').addEventListener('scroll', checkScroll);
        checkScroll();
    }

    // ── BUSCADOR ──
    function initSearch() {
        const buscador = document.querySelector('#buscador-cheque');
        if (!buscador) return;

        let temporizador;
        buscador.addEventListener('input', () => {
            clearTimeout(temporizador);
            temporizador = setTimeout(() => {
                textoBusqueda = buscador.value.trim();
                resetCheques();
            }, DEMORA_BUSQUEDA);
        });
    }

    initSearch();
    initFiltro();
    resetCheques();
})();
