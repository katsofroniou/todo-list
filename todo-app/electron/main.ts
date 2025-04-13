import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'
import debounce from 'lodash/debounce'

const storePath = path.join(app.getPath('userData'), 'todos.json')
const store = {
  get() {
    try {
      const todos = JSON.parse(fs.readFileSync(storePath, 'utf8'))
      return todos
    } catch (error) {
      console.log('Error loading todos:', error)
      return []
    }
  },
  set(todos: any[]) {
    fs.writeFileSync(storePath, JSON.stringify(todos))
  }
}

let win: BrowserWindow | null
let isQuitting = false;

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.APP_ROOT, 'public', 'strawberry.png'),
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      webSecurity: true
    },
  })

  // Load initial todos from store
  const initialTodos = store.get()

  // Add CSP headers with development-friendly settings
  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self';" +
          "script-src 'self' 'unsafe-inline' 'unsafe-eval';" +
          "style-src 'self' 'unsafe-inline';" +
          "img-src 'self' data: https:;" +
          "connect-src 'self' ws: wss:;" +
          "worker-src 'self' blob:;"
        ]
      }
    })
  });
  
  // Handle IPC messages for window controls
  ipcMain.on('window-minimize', () => {
    if (win) win.minimize();
  })

  ipcMain.on('window-maximize', () => {
    if (!win) return;
    
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  })

  ipcMain.on('window-close', () => {
    if (win) win.close();
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  // Save todos when window is about to close
  win.on('close', (e) => {
    if (!isQuitting) {
      e.preventDefault();
      app.quit();
    }
  })

  // Load the app
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(process.env.APP_ROOT, 'dist', 'index.html'))
  }

  // Send initial todos to renderer once window is ready
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('todos-updated', initialTodos)
  })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

const debouncedStoreSave = debounce((todos) => {
  if (todos.length > 0) {
    store.set(todos);
  }
}, 1000);

ipcMain.handle('todos:set', (_, todos) => {
  debouncedStoreSave(todos);
  return true;
})

ipcMain.handle('todos:get', () => {
  return store.get()
})

ipcMain.handle('todos:update-latest', (_, _todos) => {
  return true
})

app.on('before-quit', () => {
  isQuitting = true;
  app.exit();
})

ipcMain.on('update-todos', (_event, todos) => {
  if (win) {
    win.webContents.send('todos-updated', todos);
  }
});

app.whenReady().then(createWindow)