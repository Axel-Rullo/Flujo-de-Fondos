function iniciarViewPassword() {

    const passwordInput  = document.getElementById('password');
    const togglePassword = document.getElementById('toggle-password');

    if (!passwordInput || !togglePassword) return;

    passwordInput.addEventListener('input', () => {
        if (passwordInput.value.length > 0) {
            togglePassword.style.display = 'flex';
        } else {
            togglePassword.style.display = 'none';
            passwordInput.type = 'password';
        }
    });

    togglePassword.addEventListener('click', () => {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
        } else {
            passwordInput.type = 'password';
        }
    });
}