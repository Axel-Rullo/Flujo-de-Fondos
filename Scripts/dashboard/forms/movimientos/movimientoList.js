(function() {
    // ── PAGINACIÓN ──
    const TAMANIO_PAGINA = 50;
    const MAXIMO_REGISTROS = 5000;
    const UMBRAL_SCROLL = 0.70;

    let tabla = null;
    let cantidadCargada = 0;
    let hayMas = true;
    let cargando = false;
    let filtroActivo = null;

    // ── CONSULTA SEGÚN LA PANTALLA ──
    function fetchRegistros(desde) {
        const servicio = window.movimientoService;
        if (filtroActivo) return servicio.filtroPeriodico(filtroActivo.desde, filtroActivo.hasta, filtroActivo.id_concepto, TAMANIO_PAGINA, desde);
        return document.querySelector('#lista_movimientos')
            ? servicio.listMovimientos(TAMANIO_PAGINA, desde)
            : servicio.listOperaciones(TAMANIO_PAGINA, desde);
    }

    function createTable(registros) {
        const plantillas = window.movimientoTemplates;
        return document.querySelector('#lista_movimientos')
            ? plantillas.crearTablaMovimientos(registros)
            : plantillas.crearTablaAuditoria(registros);
    }

    // ── PRIMERA PÁGINA ──
    async function renderMovimientoList() {
        const containerMovimientos = document.querySelector('#lista_movimientos');
        const containerAuditoria = document.querySelector('#auditoria');
        if (!containerMovimientos && !containerAuditoria) return;

        // Carga el select de conceptos del header (solo existe en Movimientos, solo la primera vez)
        const header = document.querySelector('.movimientos_container');
        if (header && !filtroActivo) {
            loadConceptos(header);
        }

        if (tabla) tabla.destroy();
        tabla = null;
        cantidadCargada = 0;
        hayMas = true;
        cargando = true;

        try {
            const registros = await fetchRegistros(0);
            tabla = await createTable(registros);
            tabla.on('tableBuilt', initScroll);
            updatePagination(registros.length);
        } catch (err) {
            showAlert("Error al cargar la lista de Movimientos/Operaciones", "error", 3000, 'center', true);
            console.error('Error al cargar la lista de movimientos/operaciones:', err);
        } finally {
            cargando = false;
        }
    }

    // ── PÁGINAS SIGUIENTES ──
    async function loadMoreRegistros() {
        if (cargando || !hayMas || !tabla) return;

        cargando = true;

        try {
            const registros = await fetchRegistros(cantidadCargada);
            await tabla.addData(registros);
            updatePagination(registros.length);
        } catch (err) {
            hayMas = false;
            showAlert('Error al cargar más Movimientos/Operaciones', 'error', 3000, 'center', true);
            console.error('Error al cargar más movimientos/operaciones:', err);
        } finally {
            cargando = false;
        }

        checkScroll();
    }

    function updatePagination(cantidad) {
        cantidadCargada += cantidad;
        hayMas = cantidad === TAMANIO_PAGINA && cantidadCargada < MAXIMO_REGISTROS;

        if (cantidad === TAMANIO_PAGINA && cantidadCargada >= MAXIMO_REGISTROS) {
            showAlert('Se alcanzó el límite de ' + MAXIMO_REGISTROS + ' registros.', 'info', 4000, 'top', false);
        }
    }

    // ── SCROLL INFINITO ──
    function checkScroll() {
        const contenido = tabla && tabla.element.querySelector('.tabulator-tableholder');
        if (!contenido) return;

        if ((contenido.scrollTop + contenido.clientHeight) / contenido.scrollHeight >= UMBRAL_SCROLL) loadMoreRegistros();
    }

    // El scroll es de la propia tabla: el listener se crea con cada tabla nueva
    function initScroll() {
        tabla.element.querySelector('.tabulator-tableholder').addEventListener('scroll', checkScroll);
        checkScroll();
    }

    // ── FILTRO ──
    function initFiltro() {
        const form = document.querySelector('#filtros_movimientos');
        if (!form) return;

        form.addEventListener('submit', e => {
            e.preventDefault();

            const desde = form.querySelector('#periodo_desde').value;
            const hasta = form.querySelector('#periodo_hasta').value;

            if (desde > hasta) {
                showAlert("La fecha 'Desde' no puede ser mayor que 'Hasta'", 'warning', 3000, 'center', true);
                return;
            }

            filtroActivo = { desde, hasta, id_concepto: Number(form.querySelector('#id_concepto').value) };

            renderMovimientoList();
        });
    }

    initFiltro();
    renderMovimientoList();
})();