import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

try {
  // Expose IPC renderer
  contextBridge.exposeInMainWorld('ipcRenderer', {
    on: (channel: string, func: (...args: unknown[]) => void) => {
      return ipcRenderer.on(channel, (_event: IpcRendererEvent, ...args: unknown[]) => func(...args));
    },
    send: (channel: string, ...args: unknown[]) => {
      ipcRenderer.send(channel, ...args);
    },
    invoke: (channel: string, ...args: unknown[]) => {
      return ipcRenderer.invoke(channel, ...args);
    },
    removeAllListeners: (channel: string) => {
      ipcRenderer.removeAllListeners(channel);
    }
  });

  // Expose window control API
  contextBridge.exposeInMainWorld('electronAPI', {
    windowMinimize: () => {
      ipcRenderer.send('window-minimize');
    },
    windowMaximize: () => {
      ipcRenderer.send('window-maximize');
    },
    windowClose: () => {
      ipcRenderer.send('window-close');
    }
  });

} catch (error) {
  console.error('Error in preload script:', error);
}