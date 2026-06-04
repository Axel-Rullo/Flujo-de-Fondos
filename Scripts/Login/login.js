function iniciarLogin() {

    const loginForm = document.getElementById('login-form');

    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const usuario  = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: usuario, pass: password })
            });

            const data = await response.json();

            if (data.ok) {
                window.location.hash = 'dashboard';
            } else {
                alert(data.mensaje);
            }

        } catch (error) {
            alert('No se pudo conectar con el servidor.');
            console.error(error);
        }
    });
}