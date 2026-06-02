const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('node:path');
const fs   = require('node:fs');

Menu.setApplicationMenu(null);

let win;

const stateFilePath = path.join(app.getPath('userData'), 'window-state.json');

const STATE_DEFAULT = {
    width: 1280,
    height: 800,
    x: undefined,
    y: undefined,
    isMaximized: false
};

function loadState() {
    try {
        if (fs.existsSync(stateFilePath)) {
            return JSON.parse(fs.readFileSync(stateFilePath, 'utf8'));
        }
    } catch (e) {
        console.error("No se pudo cargar el estado de la ventana:", e);
    }
    return { ...STATE_DEFAULT };
}

function saveState() {
    if (!win || win.isDestroyed()) return;

    const isMaximized = win.isMaximized();
    if (!isMaximized) {
        const { x, y, width, height } = win.getBounds();
        windowState = { ...windowState, x, y, width, height };
    }
    windowState.isMaximized = isMaximized;

    try {
        fs.writeFileSync(stateFilePath, JSON.stringify(windowState), 'utf8');
    } catch (e) {
        console.error("No se pudo guardar el estado de la ventana:", e);
    }
}

let windowState = loadState();

function createWindow() {
    win = new BrowserWindow({
        frame: false,
        x: windowState.x,
        y: windowState.y,
        width: windowState.width,
        height: windowState.height,
        minWidth: 800,
        minHeight: 500,
        icon: path.join(__dirname, 'Icons/logo.ico'),
        backgroundColor: '#111C2E',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: false
        }
    });

    if (windowState.isMaximized) win.maximize();

    win.loadFile(path.join(__dirname, 'index.html'));

    win.on('maximize',   () => win.webContents.send('window-state', 'maximized'));
    win.on('unmaximize', () => win.webContents.send('window-state', 'restored'));
    win.on('resize', saveState);
    win.on('move',   saveState);
    win.on('close',  saveState);

    // win.webContents.openDevTools(); // SOLO desarrollo
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// Controles titlebar
ipcMain.on('window-minimize', () => win?.minimize());
ipcMain.on('window-maximize', () => win?.isMaximized() ? win.unmaximize() : win.maximize());
ipcMain.on('window-close',    () => win?.close());
ipcMain.handle('window-is-maximized', () => win?.isMaximized() ?? false);