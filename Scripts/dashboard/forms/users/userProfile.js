(function() {
    function renderProfileButton() {
        const btn = document.querySelector('#btn-profile');
        if (!btn || !window.currentUser) return;
        
        if (!window.currentUser.photo && window.UserTemplates?.getRandomColor) {
            window.currentUser.color = window.UserTemplates.getRandomColor();
        }
        
        if (window.UserTemplates?.getAvatar) {
            btn.innerHTML = window.UserTemplates.getAvatar(window.currentUser, 26);
        }
    }

    function initProfileButton() {
        document.addEventListener('click', e => {
            const btn = e.target.closest('#btn-profile');
            if (!btn) return;
            
            abrirModal('./Views/forms/users/user.html').then(modalContainer => {
                window.UserTemplates.fillUserModal(window.currentUser, modalContainer);
                back = document.getElementById('btn-back');
                back.style.display='none';
            });
        });
    }

    if (!window.__userProfileInit) {
        window.__userProfileInit = true;
        initProfileButton();
    }

    renderProfileButton();

    window.renderProfileButton = renderProfileButton;
})();