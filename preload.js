const { contextBridge, ipcRenderer } = require('electron');
const fs   = require('fs');
const path = require('path');

contextBridge.exposeInMainWorld('electronAPI', {
    version: process.versions.electron,

    readView: async (relativePath) => {
        const safePath = path.resolve(__dirname, relativePath);
        if (!safePath.startsWith(__dirname)) throw new Error('Access denied');
        return fs.promises.readFile(safePath, 'utf8');
    },

    minimizeWindow:      () => ipcRenderer.send('window-minimize'),
    maximizeWindow:      () => ipcRenderer.send('window-maximize'),
    closeWindow:         () => ipcRenderer.send('window-close'),
    isMaximized:         () => ipcRenderer.invoke('window-is-maximized'),

    onWindowStateChange: (callback) => {
        const handler = (_event, state) => callback(state);
        ipcRenderer.on('window-state', handler);
        return () => ipcRenderer.off('window-state', handler);
    }
});