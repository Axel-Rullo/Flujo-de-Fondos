function iniciarLogin() {

    const loginForm = document.getElementById('login-form');

    if (!loginForm) return;

    const inputUser = document.getElementById('username');
    const inputPass = document.getElementById('password');

    inputUser?.focus();

    inputUser?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            inputPass?.focus();
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const usuario  = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const btns_admin = document.querySelectorAll('.admin-only');
        const block_login = document.querySelector('.tb-btn.bt-block-login');

        try {
            const data = await apiPost('/login', { usuario, password });

            if (data.ok) {
                window.currentUser = data.usuario;
                showAlert('Inicio de sesión exitoso', "success", 2000, 'top', false);
                if (currentUser.rango === 'Admin') {
                    btns_admin.forEach(btn => btn.classList.add("admin"));
                }
                window.location.hash = 'dashboard';
                block_login.classList.add('visible');
            } else {
                showAlert(data.mensaje, "error", 3000, 'center', true);
                loginForm.reset();
                inputUser?.focus();
            }

        } catch (error) {
            showAlert('No se pudo conectar con el servidor', "error", 3000, 'center', true);
        }
    });
}

iniciarLogin();