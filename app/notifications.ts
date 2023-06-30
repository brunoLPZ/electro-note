import { Notification , ipcMain } from 'electron';

export const setNotifications = () => {
  ipcMain.on('notification',(event, args)=> {
    const notification =  new Notification({ title : args.title , body: args.body });
    notification.show();
  })
}
