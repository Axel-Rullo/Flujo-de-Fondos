function iniciarLogin() {

    const loginForm = document.getElementById('login-form');

    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const usuario  = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const data = await apiPost('/login', { usuario: usuario, password: password });

            if (data.ok) {
                window.location.hash = 'dashboard';
            } else {
                mostrarError(data.mensaje);
            }

        } catch (error) {
            mostrarError('No se pudo conectar con el servidor.');
            console.error(error);
        }
    });
}

function mostrarError(mensaje) {
    const errorP = document.getElementById('login-error');
    if (!errorP) return;

    errorP.textContent = mensaje;
    errorP.classList.add('visible');

    clearTimeout(errorP._timeout);
    errorP._timeout = setTimeout(() => {
        errorP.classList.remove('visible');
    }, 4000);
}