'use strict'

import { app, BrowserWindow, Menu } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  if (process.platform === 'darwin') {
    const template = [
      {
        label: 'Application',
        submenu: [
          // eslint-disable-next-line standard/object-curly-even-spacing
          { label: 'Quit', accelerator: 'Command+Q', click: function () { app.quit() }}
        ]
      },
      {
        label: 'Edit',
        submenu: [
          { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
          { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
          { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
          { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
          { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
          { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
        ]
      }
    ]
    // eslint-disable-next-line no-undef
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
  } else {
    // eslint-disable-next-line no-undef
    Menu.setApplicationMenu(null)
  }
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 750,
    useContentSize: true,
    width: 1400,
    titleBarStyle: 'hiddenInset',
    show: false,
    backgroundColor: '#cdece6'
  })

  mainWindow.loadURL(winURL)
  // mainWindow.webContents.openDevTools()

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.focus()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

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
