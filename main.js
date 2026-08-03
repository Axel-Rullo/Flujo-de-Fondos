//////////////////////////////////////////////
// 📦 IMPORTS
//////////////////////////////////////////////

const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('node:path');
const http = require('node:http');
const { spawn } = require('child_process');

Menu.setApplicationMenu(null);

let win;

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

        javaServer.stdout.on('data',  (data) => console.log('JAVA: ' + data));
        javaServer.stderr.on('data',  (data) => console.error('JAVA ERROR: ' + data));
        javaServer.on('close', (code) => console.log('Servidor Java cerrado con codigo ' + code));
    } else {
        // Desarrollo: Ejecutar el backend manualmente desde tu IDE/terminal
        console.log('Modo Desarrollo: Asegúrate de tener el backend de Spring Boot corriendo manualmente en el puerto 8080.');
    }
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

    win.webContents.on('console-message', (event, level, message) => {
        console.log(message);
    });

    win.webContents.on('before-input-event', (event, input) => {
        if (input.key === 'F5' && input.type === 'keyDown') {
            win.webContents.reload();
        }
    });

    win.maximize();

    win.loadFile(path.join(__dirname, 'index.html'));

    win.on('maximize',   () => win.webContents.send('window-state', 'maximized'));
    win.on('unmaximize', () => win.webContents.send('window-state', 'restored'));
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

let backendKilled = false;

function killBackend() {
    if (backendKilled) return;
    backendKilled = true;
    console.log('Iniciando cierre de backend...');

    // Opcional: Llamada al endpoint de shutdown del backend (comentada por ahora)
    /*
    const http = require('node:http');
    const req = http.request({
        hostname: 'localhost',
        port:     8080,
        path:     '/api/shutdown',
        method:   'POST'
    }, (res) => {
        console.log('Petición de shutdown enviada al backend');
    });
    req.on('error', (e) => console.error('Error al enviar shutdown: ' + e.message));
    req.end();
    */

    // En desarrollo, no matamos el backend para dejarlo prendido independiente de Electron
    if (!app.isPackaged) {
        console.log('Modo Desarrollo: Se deja el backend de Spring Boot encendido.');
        return;
    }

    // 1. Matar el árbol de procesos de javaServer de forma síncrona
    if (javaServer && !javaServer.killed) {
        try {
            if (process.platform === 'win32') {
                const { spawnSync } = require('child_process');
                spawnSync('taskkill', ['/pid', javaServer.pid, '/f', '/t'], { stdio: 'ignore' });
            } else {
                javaServer.kill('SIGTERM');
            }
        } catch (e) {
            console.error('Error al cerrar javaServer: ' + e.message);
        }
    }

    // 2. Liberar específicamente el puerto 8080 en caso de procesos huérfanos con comando simple
    try {
        const { execSync } = require('child_process');
        if (process.platform === 'win32') {
            execSync('powershell -Command "Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }"', { stdio: 'ignore' });
        } else {
            execSync('lsof -t -i:8080 | xargs kill -9', { stdio: 'ignore' });
        }
    } catch (e) {
        // Ignorar si no hay procesos en el puerto 8080
    }
}

app.on('window-all-closed', () => {
    killBackend();
    if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
    killBackend();
});