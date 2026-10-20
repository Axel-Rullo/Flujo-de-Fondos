function iniciarViewPassword() {

    const passwordInput  = document.getElementById('password');
    const togglePassword = document.getElementById('toggle-password');

    if (!passwordInput || !togglePassword) return;

    passwordInput.addEventListener('input', () => {
        togglePassword.style.display = passwordInput.value.length > 0 ? 'flex' : 'none';
        if (!passwordInput.value.length) passwordInput.type = 'password';
    });

    togglePassword.addEventListener('click', () => {
        passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
    });
}

iniciarViewPassword();