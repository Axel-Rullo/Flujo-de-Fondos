//////////////////////////////////////////////
// 📦 IMPORTS
//////////////////////////////////////////////

const { app, BrowserWindow, Menu, ipcMain, powerMonitor, shell } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('node:path');
const fs = require('node:fs');
const http = require('node:http');
const { spawn } = require('child_process');

Menu.setApplicationMenu(null);

let win;
let yaAvisado = false;

//////////////////////////////////////////////
// 📁 RUTAS DE DATOS
//////////////////////////////////////////////

const userDataPath = app.getPath('userData');
const dbDir = path.join(userDataPath, 'database');

//////////////////////////////////////////////
// ☕ BACKEND JAVA
//////////////////////////////////////////////

let javaServer;
let javaExitInfo = null; // Guarda el motivo si Java muere antes de que waitForBackend escuche

function startJavaBackend() {
    if (app.isPackaged) {
        const jarPath = path.join(process.resourcesPath, 'Backend', 'flujodefondos.jar');
        const javaExe = path.join(process.resourcesPath, 'Backend', 'jre', 'bin', 'java.exe');

        // Validar que los archivos existan antes de intentar spawn
        if (!fs.existsSync(javaExe)) {
            javaExitInfo = 'No se encontró java.exe en: ' + javaExe;
            console.error(javaExitInfo);
            return;
        }
        if (!fs.existsSync(jarPath)) {
            javaExitInfo = 'No se encontró flujodefondos.jar en: ' + jarPath;
            console.error(javaExitInfo);
            return;
        }

        if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

        javaServer = spawn(javaExe, [
            '-jar', jarPath,
            `--app.storage.base-path=${userDataPath}`
        ], {
            cwd: userDataPath
        });

        javaServer.stdout.on('data',  (data) => console.log('JAVA: ' + data));
        javaServer.stderr.on('data',  (data) => console.error('JAVA ERROR: ' + data));

        // Guardar motivo de cierre para que waitForBackend lo detecte aunque ya haya pasado
        javaServer.on('exit',  (code) => { javaExitInfo = 'Servidor Java cerrado con código ' + code; console.log(javaExitInfo); });
        javaServer.on('error', (err)  => { javaExitInfo = err.message; console.error('Error al iniciar el proceso Java: ' + err.message); });
    } else {
        console.log('Modo Desarrollo: Asegurate de tener el backend de Spring Boot corriendo manualmente en el puerto 8080.');
    }
}

function waitForBackend(url = 'http://127.0.0.1:8080', timeout = 90000) {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        let timer = null;
        let done = false;

        function finish(fn, arg) {
            if (done) return;
            done = true;
            clearTimeout(timer);
            fn(arg);
        }

        // Si Java ya murió antes de que lleguemos acá, rechazar de una
        if (javaExitInfo) {
            return reject(new Error(javaExitInfo));
        }

        // Si no hay javaServer (archivos faltantes), rechazar
        if (!javaServer && app.isPackaged) {
            return reject(new Error(javaExitInfo || 'No se pudo iniciar el proceso Java'));
        }

        if (javaServer) {
            javaServer.once('exit',  (code) => finish(reject, new Error('Servidor Java cerrado con código ' + code)));
            javaServer.once('error', (err)  => finish(reject, new Error(err.message)));
        }

        function check() {
            if (done) return;

            const req = http.get(url, () => finish(resolve));

            req.on('error', () => {
                if (done) return;
                if (Date.now() - start > timeout) {
                    finish(reject, new Error('Backend no respondió a tiempo'));
                } else {
                    timer = setTimeout(check, 300);
                }
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
        minWidth:        950,
        minHeight:       650,
        icon:            path.join(__dirname, '..', 'app', 'assets', 'icons', 'logo.ico'),
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
            event.preventDefault();
            win.webContents.executeJavaScript("window.location.hash = 'login';")
                .then(() => {
                    win.webContents.reload();
                    win.webContents.once('did-finish-load', () => {
                        win.webContents.send('backend-ready');
                    });
                });
        }
    });

    win.maximize();

    win.loadFile(path.join(__dirname, '..', 'app', 'index.html'));

    win.on('maximize',   () => win.webContents.send('window-state', 'maximized'));
    win.on('unmaximize', () => win.webContents.send('window-state', 'restored'));

    // Abrir enlaces externos en el navegador del sistema
    win.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: "deny" };
    });
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
// 🚀 AUTO UPDATER
//////////////////////////////////////////////

function setupAutoUpdater() {
    autoUpdater.checkForUpdatesAndNotify();

    autoUpdater.on('update-available',  () => console.log('🔄 Actualización disponible'));
    autoUpdater.on('update-downloaded', () => console.log('✅ Actualización descargada'));
    autoUpdater.on('error', (err)       => console.error('❌ Error en la auto-update:', err));
}

//////////////////////////////////////////////
// ▶️ INICIO
//////////////////////////////////////////////

app.whenReady().then(async () => {
    startJavaBackend();
    createWindow();
    if (app.isPackaged) setupAutoUpdater();

    setInterval(() => {
        const idleSeconds = powerMonitor.getSystemIdleTime();
        if (idleSeconds >= 300 && !yaAvisado) {
            yaAvisado = true;
            win.webContents.send('sesion-inactiva');
        } else if (idleSeconds < 300 && yaAvisado) {
            yaAvisado = false;
        }
    }, 1000);

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
