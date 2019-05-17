const {
    app,
    BrowserWindow,
    dialog
} = require('electron');

const path = require('path');
const url = require('url');

const compose = require('./src/ops/orchestration.js');
if (process.env.DEV) {
    require('electron-reload')(__dirname);
}
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

/** */
function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
        },
        width: 1200,
        height: 600,
    });

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true,
    }));

    // Open the DevTools.
    if (process.env.DEV) {
        mainWindow.webContents.openDevTools();
    }

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

    mainWindow.webContents.on('will-prevent-unload', (event) => {
        const choice = dialog.showMessageBox(mainWindow, {
            type: 'question',
            buttons: ['Yes', 'No'],
            title: '',
            message: 'Would you like to exit?',
            detail: 'Always CTRL+S',
            defaultId: 0,
            cancelId: 1
        });

        if (choice === 0) {
            event.preventDefault();
        }
    })
}

/**
 * @return {Promise}
 */
function setupDevEnvironment() {
    return compose.dropContainers().then(compose.runContainer.bind(null, 'wetty'))
        .then(compose.runContainer.bind(null, 'wetty-ssh'));
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function() {
    setupDevEnvironment().then(() => mainWindow.webContents.send('load-event', {
        dockerDone: true,
    }));
    createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', async function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    await compose.dropContainers();
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.