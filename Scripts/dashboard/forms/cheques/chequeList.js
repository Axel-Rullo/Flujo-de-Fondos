(function() {
    const iconos = { C: 'icono-cheque-cobrado', R: 'icono-cheque-rechazado', A: 'icono-cheque-anulado' };

    // ── PAGINACIÓN Y BÚSQUEDA ──
    const TAMANIO_PAGINA = 50;
    const MAXIMO_CHEQUES = 2000;
    const UMBRAL_SCROLL = 0.70;
    const DEMORA_BUSQUEDA = 400;

    let tabla = null;
    let clase = 'P';
    let estado = 'P';
    let cantidadCargada = 0;
    let hayMas = true;
    let cargando = false;
    let idConsulta = 0;
    let textoBusqueda = '';

    function selectHistorialCheques() {
        const selectEstado = document.querySelector('#type-cheque');
        if (!selectEstado) return renderChequeList();

        const tsEstado = new TomSelect(selectEstado, {
            wrapperClass: 'ts-wrapper clase_cheque',
            dropdownParent: 'body',
            dropdownClass: 'ts-dropdown status-dropdown-cheque',
            controlInput: null,
            render: {
                option: (datos) => `<div class="status-icon-${datos.value}" title="${datos.title}"><svg width="28" height="28"><use href="#${iconos[datos.value]}" xlink:href="#${iconos[datos.value]}"/></svg></div>`,
                item: (datos) => `<div class="status-icon-${datos.value}" title="${datos.title}"><svg width="28" height="28"><use href="#${iconos[datos.value]}" xlink:href="#${iconos[datos.value]}"/></svg></div>`
            }
        });
        tsEstado.setValue('C', true);

        tsEstado.on('change', () => { renderChequeList(); tsEstado.blur(); });

        const selectClase = document.querySelector('#clase-cheque');

        const tsClase = new TomSelect(selectClase, {
            wrapperClass: 'ts-wrapper clase_cheque',
            dropdownParent: 'body',
            dropdownClass: 'ts-dropdown status-dropdown-cheque',
            controlInput: null
        });
        tsClase.setValue('P', true);

        tsClase.on('change', () => { renderChequeList(); tsClase.blur(); });

        renderChequeList();
    }

    // ── CONSULTA SEGÚN LA PANTALLA ──
    function fetchCheques(desde) {
        const servicio = window.ChequeService;
        const propio = clase === 'P';

        if (estado === 'R' || estado === 'A') {
            return propio
                ? servicio.listBajasPropios(estado, textoBusqueda, TAMANIO_PAGINA, desde)
                : servicio.listBajasTerceros(estado, textoBusqueda, TAMANIO_PAGINA, desde);
        }
        return propio
            ? servicio.listChequesPropios(estado, textoBusqueda, TAMANIO_PAGINA, desde)
            : servicio.listChequesTerceros(estado, textoBusqueda, TAMANIO_PAGINA, desde);
    }

    function createTable(cheques) {
        const plantillas = window.ChequeTemplates;

        if (estado === 'R' || estado === 'A') return plantillas.crearTablaChequesRechAnul(cheques);
        return clase === 'P'
            ? plantillas.crearTablaChequesEmitidos(cheques)
            : plantillas.crearTablaChequesACobrar(cheques);
    }

    // ── PRIMERA PÁGINA ──
    async function renderChequeList() {
        const contenedor = document.querySelector('.cheques-container');
        if (!contenedor) return;

        const titulos = { C: 'HISTORIAL DE CHEQUES COBRADOS', R: 'HISTORIAL DE CHEQUES RECHAZADOS', A: 'HISTORIAL DE CHEQUES ANULADOS' };
        let titulo;

        if (contenedor.querySelector('#tabla-cheques-emitidos')) {
            clase = 'P'; estado = 'P'; titulo = 'CHEQUES EMITIDOS';
        } else if (contenedor.querySelector('#tabla-cheques-acobrar')) {
            clase = 'T'; estado = 'P'; titulo = 'CHEQUES A COBRAR';
        } else if (contenedor.querySelector('#tabla-cheques-historial')) {
            clase = document.querySelector('#clase-cheque').value;
            estado = document.querySelector('#type-cheque').value;
            titulo = titulos[estado];
        } else {
            return;
        }

        const elementoTitulo = contenedor.querySelector('.lista_cheques');
        if (elementoTitulo) elementoTitulo.textContent = titulo;

        const consultaActual = ++idConsulta;
        tabla = null;
        cantidadCargada = 0;
        hayMas = true;
        cargando = true;

        try {
            const cheques = await fetchCheques(0);
            if (consultaActual !== idConsulta) return;

            const tablaNueva = await createTable(cheques);
            if (consultaActual !== idConsulta) return;

            tabla = tablaNueva;
            tabla.on('tableBuilt', initScroll);
            updatePagination(cheques.length);
        } catch (err) {
            showAlert('Error al cargar la lista de Cheques', 'error', 3000, 'center', true);
            console.error('Error al cargar lista de cheques:', err);
        } finally {
            if (consultaActual === idConsulta) cargando = false;
        }
    }

    // ── PÁGINAS SIGUIENTES ──
    async function loadMoreCheques() {
        if (cargando || !hayMas || !tabla) return;

        const consultaActual = idConsulta;
        cargando = true;

        try {
            const cheques = await fetchCheques(cantidadCargada);
            if (consultaActual !== idConsulta) return;

            await tabla.addData(cheques);
            updatePagination(cheques.length);
        } catch (err) {
            hayMas = false;
            showAlert('Error al cargar más Cheques', 'error', 3000, 'center', true);
            console.error('Error al cargar más cheques:', err);
        } finally {
            if (consultaActual === idConsulta) cargando = false;
        }

        if (consultaActual === idConsulta) checkScroll();
    }

    function updatePagination(cantidad) {
        cantidadCargada += cantidad;
        hayMas = cantidad === TAMANIO_PAGINA && cantidadCargada < MAXIMO_CHEQUES;

        if (cantidad === TAMANIO_PAGINA && cantidadCargada >= MAXIMO_CHEQUES) {
            showAlert('Se alcanzó el límite de ' + MAXIMO_CHEQUES + ' cheques.\nUsá el buscador para acotar los resultados.', 'info', 4000, 'top', false);
        }
    }

    // ── SCROLL INFINITO ──
    function checkScroll() {
        const contenido = tabla && tabla.element.querySelector('.tabulator-tableholder');
        if (!contenido) return;

        if ((contenido.scrollTop + contenido.clientHeight) / contenido.scrollHeight >= UMBRAL_SCROLL) loadMoreCheques();
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
                renderChequeList();
            }, DEMORA_BUSQUEDA);
        });
    }

    initSearch();
    selectHistorialCheques();
})();