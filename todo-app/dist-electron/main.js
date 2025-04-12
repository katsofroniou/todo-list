import { app, BrowserWindow, ipcMain } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
const storePath = path.join(app.getPath("userData"), "todos.json");
const store = {
  get() {
    try {
      return JSON.parse(fs.readFileSync(storePath, "utf8"));
    } catch (error) {
      return [];
    }
  },
  set(todos) {
    fs.writeFileSync(storePath, JSON.stringify(todos));
  }
};
createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let latestTodos = [];
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    width: 1200,
    height: 800,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      webSecurity: true
    }
  });
  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [
          "default-src 'self';script-src 'self' 'unsafe-inline' 'unsafe-eval';style-src 'self' 'unsafe-inline';img-src 'self' data: https:;connect-src 'self' ws: wss:;worker-src 'self' blob:;"
        ]
      }
    });
  });
  ipcMain.on("window-minimize", () => {
    if (win) win.minimize();
  });
  ipcMain.on("window-maximize", () => {
    if (!win) return;
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });
  ipcMain.on("window-close", () => {
    if (win) win.close();
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  win.on("close", () => {
    if (latestTodos.length > 0) {
      store.set(latestTodos);
    }
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(process.env.APP_ROOT, "dist", "index.html"));
  }
  if (process.env.VITE_DEV_SERVER_URL) {
    win.webContents.openDevTools();
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
ipcMain.handle("todos:set", (_, todos) => {
  store.set(todos);
  return true;
});
ipcMain.handle("todos:get", () => {
  return store.get();
});
ipcMain.handle("todos:update-latest", (_, todos) => {
  latestTodos = todos;
  return true;
});
app.on("before-quit", () => {
  if (latestTodos.length > 0) {
    store.set(latestTodos);
  }
});
ipcMain.on("update-todos", (_event, todos) => {
  latestTodos = todos;
  if (win) {
    win.webContents.send("todos-updated", todos);
  }
});
app.whenReady().then(createWindow);
export {
  VITE_DEV_SERVER_URL
};
