"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setNotifications = void 0;
const electron_1 = require("electron");
const setNotifications = () => {
    electron_1.ipcMain.on('notification', (event, args) => {
        const notification = new electron_1.Notification({ title: args.title, body: args.body });
        notification.show();
    });
};
exports.setNotifications = setNotifications;
//# sourceMappingURL=notifications.js.map