const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'renderer.js'),
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    win.loadFile('index.html');

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);

    win.webContents.openDevTools();
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

// define reset app
function resetApp() {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow) {
        // message to renderer process to clear local storage or any data
        focusedWindow.webContents.send('reset-app');

        // untuk reload window kalau dia delayed
        setTimeout(() => {
            focusedWindow.reload();
        }, 100);
    }
}

// define the menu template
const mainMenuTemplate = [
    {label: 'File',
        submenu: [
            { label: 'Reload',
                click() {
                    BrowserWindow.getFocusedWindow().reload();
            },
            },
            {label: 'Reset',
            click() {
            resetApp();
                },
            },
            {label: 'Quit',
            click() {
            app.quit();
                },
            },
        ],
    },
    {label: 'Help',
    submenu: [
    { label: 'About Us' },
        ],
    },
];
