(function() {
    // ── PAGINACIÓN ──
    const TAMANIO_PAGINA = 50;
    const MAXIMO_REGISTROS = 2000;
    const UMBRAL_SCROLL = 0.70;

    let tabla = null;
    let cantidadCargada = 0;
    let hayMas = true;
    let cargando = false;

    // ── CONSULTA SEGÚN LA PANTALLA ──
    function fetchRegistros(desde) {
        const servicio = window.movimientoService;
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

    renderMovimientoList();
})();