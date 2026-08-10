const icons = {
    success: '<svg width="25" height="25"><use href="#icon-success"/></svg>',
    error: '<svg width="25" height="25"><use href="#icon-error"/></svg>',
    warning: '<svg width="25" height="25"><use href="#icon-warning"/></svg>',
    info: '<svg width="25" height="25"><use href="#icon-info"/></svg>'
};

function showAlert(message, type, time = 2000, position = 'top', showShadow = false) {
    const container = document.querySelector('.alert_container');
    const overlay = document.getElementById('alert-overlay');
    const icon = document.querySelector('.alert_icon');
    const messageBox = document.querySelector('.alert_message');

    icon.className = `alert_icon ${type}`;
    container.className = `alert_container ${type} ${position}`;
    icon.innerHTML = icons[type] || icons.info;
    messageBox.textContent = message;

    overlay.classList.toggle('no-bg', !showShadow);
    overlay.classList.add('open');

    clearTimeout(container._timeout);
    container._timeout = setTimeout(() => {
        overlay.classList.remove('open');
        overlay.classList.remove('no-bg');
    }, time);
}

function showConfirm(message, type = 'warning') {
    const container = document.querySelector('.alert_container');
    const overlay = document.getElementById('alert-overlay');
    const icon = document.querySelector('.alert_icon');
    const messageBox = document.querySelector('.alert_message');
    const actions = document.querySelector('.alert_actions');

    icon.className = `alert_icon ${type}`;
    container.className = `alert_container ${type}`;
    icon.innerHTML = icons[type] || icons.info;
    messageBox.textContent = message;
    overlay.classList.add('open');
    actions.classList.add('visible');

    clearTimeout(container._timeout);

    return new Promise((resolve) => {
        actions.querySelector('.alert_btn_yes').onclick = () => {
            overlay.classList.remove('open');
            actions.classList.remove('visible');
            resolve(true);
        };
        actions.querySelector('.alert_btn_no').onclick = () => {
            overlay.classList.remove('open');
            actions.classList.remove('visible');
            resolve(false);
        };
    });
}