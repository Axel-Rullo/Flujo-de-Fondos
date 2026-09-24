/* ── BIENVENIDA ───────────────────────────────────────────────── */

// Fecha local de hoy como texto (para comparar con la guardada en localStorage)
function fechaHoy() {
    const d = new Date();
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
}

window.mostrarBienvenida = function() {
    const titlebar = document.getElementById('titlebar');
    const bienvenida = document.querySelector('.bienvenida');
    const saludo = document.querySelector('.saludo');
    const extra = document.querySelector('.bienvenida .extra');
    const hoy = fechaHoy();
    // El Comentado es el de abajo (pero invertido)
    const primeraVez = localStorage.getItem('resumenDiario') !== hoy;
    // const primeraVez = true;

    saludo.textContent = '¡¡Bienvenido ' + window.currentUser.nombre + '!!';
    extra.hidden = !primeraVez;
    titlebar.classList.add('tb-espera'); // Oculta el contenido hasta que termine la bienvenida
    
    bienvenida.classList.remove('oculto');
    void bienvenida.offsetWidth; 
    bienvenida.classList.add('visible');

    const dashboardListo = new Promise(resolve => {
        window.addEventListener('ruta:lista', function onListo(e) {
            if (e.detail === 'dashboard') {
                window.removeEventListener('ruta:lista', onListo);
                resolve();
            }
        });
    });

    // Las veces siguientes del día la bienvenida dura menos
    const minimo = new Promise(resolve => setTimeout(resolve, primeraVez ? 4000 : 2500));
    const maximo = new Promise(resolve => setTimeout(resolve, primeraVez ? 8000 : 5000));

    Promise.race([Promise.all([dashboardListo, minimo]), maximo]).then(async () => {
        
        // Resumen diario obligatorio: solo la primera vez del día
        let modalCerrado;
        if (primeraVez && window.abrirModal) {
            const cerrado = new Promise(resolve => window.addEventListener('modal:cerrado', resolve, { once: true }));
            if (await window.abrirModal('Views/forms/cheques/resumen_cheque.html', true)) modalCerrado = cerrado;
        }

        bienvenida.classList.remove('visible'); // Esto dispara el fade-out de vuelta a opacity 0

        // Entrada animada del titlebar (solo si la sesión sigue en el dashboard)
        titlebar.classList.remove('tb-espera');
        if (location.hash === '#dashboard') {
            titlebar.classList.add('tb-entra');
            setTimeout(() => titlebar.classList.remove('tb-entra'), 1000);
        }

        await new Promise(resolve => {
            const onEnd = (e) => {
                if (e.propertyName !== 'opacity') return;
                bienvenida.removeEventListener('transitionend', onEnd);
                bienvenida.classList.add('oculto');
                resolve();
            };
            bienvenida.addEventListener('transitionend', onEnd);
        });

        if (modalCerrado) {
            await modalCerrado;
            // El Comentado es el de abajo
            localStorage.setItem('resumenDiario', hoy);
        }
    });
};