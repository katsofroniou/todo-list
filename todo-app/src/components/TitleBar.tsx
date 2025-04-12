import React from 'react';
import '../styles/TitleBar.scss';

// Direct IPC implementation for window controls
const directIPC = {
  minimize: () => {
    if (window.ipcRenderer) {
      window.ipcRenderer.send('window-minimize');
    }
  },
  maximize: () => {
    if (window.ipcRenderer) {
      window.ipcRenderer.send('window-maximize');
    }
  },
  close: () => {
    if (window.ipcRenderer) {
      window.ipcRenderer.send('window-close');
    }
  }
};

const TitleBar: React.FC = () => {
  const handleMinimize = () => {
    try {
      // Try using electronAPI first
      if (window.electronAPI) {
        window.electronAPI.windowMinimize();
      } else {
        // Fall back to direct IPC
        directIPC.minimize();
      }
    } catch (error) {
      console.error('Error minimizing window:', error);
    }
  };

  const handleMaximize = () => {
    try {
      if (window.electronAPI) {
        window.electronAPI.windowMaximize();
      } else {
        directIPC.maximize();
      }
    } catch (error) {
      console.error('Error maximizing window:', error);
    }
  };

  const handleClose = () => {
    try {
      if (window.electronAPI) {
        window.electronAPI.windowClose();
      } else {
        directIPC.close();
      }
    } catch (error) {
      console.error('Error closing window:', error);
    }
  };

  return (
    <div className="title-bar">
      <div className="spacer"></div>
      <div className="app-title">
        <h1>Todo App</h1>
      </div>
      <div className="window-controls">
        <button className="window-control minimize" onClick={handleMinimize}>
          <span>_</span>
        </button>
        <button className="window-control maximize" onClick={handleMaximize}>
          <span>□</span>
        </button>
        <button className="window-control close" onClick={handleClose}>
          <span>x</span>
        </button>
      </div>
    </div>
  );
};

export default TitleBar;