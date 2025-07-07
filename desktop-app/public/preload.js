const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => ipcRenderer.invoke('app-version'),
  
  // Add more secure API methods here as needed
  // For example, if you need to communicate with the main process
  // for file operations, system notifications, etc.
  
  // Example: System notifications
  showNotification: (title, body) => {
    ipcRenderer.invoke('show-notification', { title, body });
  },
  
  // Example: File operations (if needed)
  openFile: () => ipcRenderer.invoke('open-file'),
  saveFile: (data) => ipcRenderer.invoke('save-file', data),
});