import {app, BrowserWindow, screen, Menu, protocol} from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import {setNotifications} from './notifications';

let win: BrowserWindow | null = null;

const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');


function createWindow(): BrowserWindow {
  const size = screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve),
      contextIsolation: false,  // false if you want to run e2e test with Spectron
    },
  });

  if (serve) {
    const debug = require('electron-debug');
    debug();

    require('electron-reloader')(module);
    win.loadURL('http://localhost:4200');
  } else {
    // Path when running electron executable
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
       // Path when running electron in local folder
      pathIndex = '../dist/index.html';
    }

    const url = new URL(path.join('file:', __dirname, pathIndex));
    win.loadURL(url.href);
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  createMenu(win);

  return win;
}

function createMenu(win: BrowserWindow) {

  const isMac = process.platform === 'darwin'

  const menuTemplate: any = [
    // { role: 'appMenu' }
    ...(isMac
      ? [{
        label: app.name,
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideOthers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      }]
      : []),
    {
      label: 'Note',
      submenu: [
        {
          label: 'New',
          accelerator: isMac ? 'Cmd+N' : 'Ctrl+N',
          click: async () => {
            await win.webContents.send('new');
          }
        },
        {
          label: 'Find',
          accelerator: isMac ? 'Cmd+F' : 'Ctrl+F',
          click: async () => {
            await win.webContents.send('find');
          }
        },
        {
          label: 'Save',
          accelerator: isMac ? 'Cmd+S' : 'Ctrl+S',
          click: async () => {
            await win.webContents.send('save');
          }
        }
      ]
    },
    // { role: 'editMenu' }
    {
      label: 'Editor',
      submenu: [
        {
          label: 'Heading',
          accelerator: isMac ? 'Cmd+Shift+H' : 'Ctrl+Shift+H',
          click: async () => {
            await win.webContents.send('heading');
          }
        },
        {
          label: 'Bold',
          accelerator: isMac ? 'Cmd+B' : 'Ctrl+B',
          click: async () => {
            await win.webContents.send('bold');
          }
        },
        {
          label: 'Italic',
          accelerator: isMac ? 'Cmd+I' : 'Ctrl+I',
          click: async () => {
            await win.webContents.send('italic');
          }
        },
        { role: 'separator' },
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    // { role: 'viewMenu' }
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    // { role: 'windowMenu' }
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac
          ? [
            { type: 'separator' },
            { role: 'front' },
            { type: 'separator' },
            { role: 'window' }
          ]
          : [
            { role: 'close' }
          ])
      ]
    }
  ]
  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate))
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => {
    protocol.registerFileProtocol('electronote', (request, callback) => {
      const pathname = decodeURI(request.url.replace('electronote:///', ''));
      callback(pathname);
    });
    setTimeout(createWindow, 400)
    setNotifications();
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
