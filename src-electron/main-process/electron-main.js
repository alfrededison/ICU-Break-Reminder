import { app, BrowserWindow, nativeTheme, Menu, Tray } from 'electron'
import path from 'path'

try {
  if (process.platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(require('path').join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) { }

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = __dirname
}

let mainWindow
let tray

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    useContentSize: true,
    autoHideMenuBar: process.env.PROD,
    webPreferences: {
      // Change from /quasar.conf.js > electron > nodeIntegration;
      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: process.env.QUASAR_NODE_INTEGRATION,
      nodeIntegrationInWorker: process.env.QUASAR_NODE_INTEGRATION,

      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      // preload: path.resolve(__dirname, 'electron-preload.js')
    }
  })

  mainWindow.loadURL(process.env.APP_URL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function createTray() {
  tray = new Tray(path.resolve(__statics, 'logo.png'))
  const showApp = function () {
    mainWindow.show()
  }
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App', click: showApp
    },
    {
      type: "separator"
    },
    {
      label: 'Quit', click: function () {
        app.quit();
      }
    }
  ])
  tray.setToolTip('ICU Break Reminder')
  tray.setContextMenu(contextMenu)
  tray.on("click", showApp)
}

app.on('ready', () => {
  createWindow()
  createTray()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

const { ipcMain } = require('electron');

ipcMain.on('alert', (event, arg) => {
  const alertWindows = new BrowserWindow({
    width: 500,
    height: 220,
    center: true,
    resizable: false,
    alwaysOnTop: true,
    autoHideMenuBar: true,
    minimizable: false,
    webPreferences: {
      nodeIntegration: process.env.QUASAR_NODE_INTEGRATION,
      nodeIntegrationInWorker: process.env.QUASAR_NODE_INTEGRATION,
    }
  });
  alertWindows.loadURL(process.env.APP_URL + arg)
});
