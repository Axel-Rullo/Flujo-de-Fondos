//////////////////////////////////////////////
// 📦 IMPORTS
//////////////////////////////////////////////

const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('node:path');
const fs = require('node:fs');
const http = require('node:http');
const { spawn } = require('child_process');

Menu.setApplicationMenu(null);

//////////////////////////////////////////////
// 🧠 ESTADO DE VENTANA
//////////////////////////////////////////////

let win;

const stateFilePath = path.join(app.getPath('userData'), 'window-state.json');

const STATE_DEFAULT = {
    width:       1280,
    height:      800,
    x:           undefined,
    y:           undefined,
    isMaximized: false
};

function loadState() {
    try {
        if (fs.existsSync(stateFilePath))
            return JSON.parse(fs.readFileSync(stateFilePath, 'utf8'));
    } catch (e) {
        console.error('No se pudo cargar el estado de la ventana:', e);
    }
    return { ...STATE_DEFAULT };
}

let windowState = loadState();

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
        console.error('No se pudo guardar el estado de la ventana:', e);
    }
}

//////////////////////////////////////////////
// ☕ BACKEND JAVA
//////////////////////////////////////////////

let javaServer;

function startJavaBackend() {
    if (app.isPackaged) {
        // Producción: JAR precompilado (arranque rápido)
        const jarPath = path.join(process.resourcesPath, 'Backend', 'flujodefondos.jar');
        javaServer = spawn('java', ['-jar', jarPath], {
            cwd: path.dirname(jarPath)
        });
    } else {
        // Desarrollo: Maven Wrapper (permite hot-reload)
        const backendDir = path.join(__dirname, 'Backend', 'flujodefondos');
        javaServer = spawn('mvnw.cmd', ['spring-boot:run'], {
            cwd:   backendDir,
            shell: true
        });
    }

    javaServer.stdout.on('data',  (data) => console.log('JAVA: ' + data));
    javaServer.stderr.on('data',  (data) => console.error('JAVA ERROR: ' + data));
    javaServer.on('close', (code) => console.log('Servidor Java cerrado con codigo ' + code));
}

function waitForBackend(url = 'http://localhost:8080', timeout = 1000000) {
    return new Promise((resolve, reject) => {
        const start = Date.now();

        function check() {
            const req = http.get(url, () => resolve());

            req.on('error', () => {
                if (Date.now() - start > timeout)
                    reject(new Error('Backend no respondió a tiempo'));
                else
                    setTimeout(check, 300);
            });

            req.setTimeout(2000, () => req.destroy());
        }

        check();
    });
}

//////////////////////////////////////////////
// 🪟 VENTANA PRINCIPAL
//////////////////////////////////////////////

function createWindow() {
    win = new BrowserWindow({
        frame:           false,
        x:               windowState.x,
        y:               windowState.y,
        width:           windowState.width,
        height:          windowState.height,
        minWidth:        800,
        minHeight:       500,
        icon:            path.join(__dirname, 'Icons/logo.ico'),
        backgroundColor: '#111C2E',

        webPreferences: {
            preload:          path.join(__dirname, 'preload.js'),
            nodeIntegration:  false,
            contextIsolation: true,
            sandbox:          false
        }
    });

    if (windowState.isMaximized) win.maximize();

    win.loadFile(path.join(__dirname, 'index.html'));

    win.on('maximize',   () => win.webContents.send('window-state', 'maximized'));
    win.on('unmaximize', () => win.webContents.send('window-state', 'restored'));
    win.on('resize',     saveState);
    win.on('move',       saveState);
    win.on('close',      saveState);
}

//////////////////////////////////////////////
// 🔧 IPC
//////////////////////////////////////////////

ipcMain.on('window-minimize', () => win?.minimize());

ipcMain.on('window-maximize', () =>
    win?.isMaximized() ? win.unmaximize() : win.maximize()
);

ipcMain.on('window-close', () => win?.close());

ipcMain.handle('window-is-maximized', () => win?.isMaximized() ?? false);

//////////////////////////////////////////////
// 🚀 AUTO UPDATE
//////////////////////////////////////////////

function setupAutoUpdater() {
    autoUpdater.checkForUpdatesAndNotify();

    autoUpdater.on('update-available',  () => console.log('🔄 Actualización disponible'));
    autoUpdater.on('update-downloaded', () => console.log('✅ Actualización descargada'));
    autoUpdater.on('error', (err)       => console.error('❌ Error en auto-update:', err));
}

//////////////////////////////////////////////
// ▶️ INICIO
//////////////////////////////////////////////

app.whenReady().then(async () => {
    startJavaBackend();
    createWindow();
    setupAutoUpdater();

    async function sendToRenderer(channel) {
        if (win.webContents.isLoading())
            await new Promise(r => win.webContents.once('did-finish-load', r));
        win.webContents.send(channel);
    }

    try {
        await waitForBackend();
        await sendToRenderer('backend-ready');
    } catch (err) {
        console.error('❌ No se pudo iniciar el backend:', err.message);
        await sendToRenderer('backend-error');
    }

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

//////////////////////////////////////////////
// ❌ CERRAR APP
//////////////////////////////////////////////

app.on('window-all-closed', () => {
    if (javaServer && !javaServer.killed) {
        if (process.platform === 'win32')
            require('child_process').spawn('taskkill', ['/pid', javaServer.pid, '/f', '/t']);
        else
            javaServer.kill();
    }

    if (process.platform !== 'darwin') app.quit();
});