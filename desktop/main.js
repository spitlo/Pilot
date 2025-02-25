const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')

let isShown = true

require('electron').protocol.registerSchemesAsPrivileged([
  {
    scheme: 'js',
    privileges: {
      standard: true,
      secure: true,
    },
  },
])

function protocolHandler(request, respond) {
  try {
    let pathname = request.url.replace(/^js:\/*/, '')
    let filename = path.resolve(app.getAppPath(), pathname)
    respond({
      mimeType: 'text/javascript',
      data: require('fs').readFileSync(filename),
    })
  } catch (e) {
    console.error(e, request)
  }
}

app.on('ready', () => {
  require('electron').protocol.registerBufferProtocol('js', protocolHandler)

  const remoteMain = require('@electron/remote/main')
  remoteMain.initialize()

  app.win = new BrowserWindow({
    width: 445,
    height: 225,
    minWidth: 200,
    minHeight: 205,
    backgroundColor: '#000',
    icon:
      __dirname +
        '/' +
        {
          darwin: 'icon.icns',
          linux: 'icon.png',
          win32: 'icon.ico',
        }[process.platform] || 'icon.ico',
    resizable: true,
    frame: process.platform !== 'darwin',
    skipTaskbar: process.platform === 'darwin',
    autoHideMenuBar: process.platform === 'darwin',
    webPreferences: {
      zoomFactor: 1.0,
      nodeIntegration: true,
      contextIsolation: false,
      backgroundThrottling: false,
    },
  })

  // Added after upgrading to @electron/remote v2.
  // This is what enables Pilot to open dialogue
  // windows for saving etc., and communicate
  // with the main process (the contents of this file).
  remoteMain.enable(app.win.webContents)

  app.win.loadURL(`file://${__dirname}/sources/index.html`)
  // app.inspect()

  app.win.on('closed', () => {
    win = null
    app.quit()
  })

  app.win.on('hide', function () {
    isShown = false
  })

  app.win.on('show', function () {
    isShown = true
  })

  app.on('window-all-closed', () => {
    app.quit()
  })

  app.on('activate', () => {
    if (app.win === null) {
      createWindow()
    } else {
      app.win.show()
    }
  })
})

app.inspect = function () {
  app.win.toggleDevTools()
}

app.toggleFullscreen = function () {
  app.win.setFullScreen(!app.win.isFullScreen())
}

app.toggleVisible = function () {
  if (process.platform === 'darwin') {
    if (isShown && !app.win.isFullScreen()) {
      app.win.hide()
    } else {
      app.win.show()
    }
  } else {
    if (!app.win.isMinimized()) {
      app.win.minimize()
    } else {
      app.win.restore()
    }
  }
}

app.injectMenu = function (menu) {
  try {
    Menu.setApplicationMenu(Menu.buildFromTemplate(menu))
  } catch (err) {
    console.warn('Cannot inject menu.')
  }
}
