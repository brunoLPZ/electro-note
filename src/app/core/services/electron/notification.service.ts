import {Injectable} from '@angular/core';
import {ElectronService} from './electron.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private electronService: ElectronService) {
  }

  showNotification(title: string, body: string) {
    this.electronService.ipcRenderer.send('notification', {title, body});
  }
}
