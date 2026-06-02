function iniciarLogin() {

    const loginForm = document.getElementById('login-form');

    if (!loginForm) return;

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        window.location.hash = 'dashboard';
    });
}