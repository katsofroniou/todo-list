import { contextBridge, ipcRenderer } from "electron";
try {
  contextBridge.exposeInMainWorld("ipcRenderer", {
    on: (channel, func) => {
      return ipcRenderer.on(channel, (_event, ...args) => func(...args));
    },
    send: (channel, ...args) => {
      ipcRenderer.send(channel, ...args);
    },
    invoke: (channel, ...args) => {
      return ipcRenderer.invoke(channel, ...args);
    },
    removeAllListeners: (channel) => {
      ipcRenderer.removeAllListeners(channel);
    }
  });
  contextBridge.exposeInMainWorld("electronAPI", {
    windowMinimize: () => {
      ipcRenderer.send("window-minimize");
    },
    windowMaximize: () => {
      ipcRenderer.send("window-maximize");
    },
    windowClose: () => {
      ipcRenderer.send("window-close");
    }
  });
} catch (error) {
  console.error("Error in preload script:", error);
}
