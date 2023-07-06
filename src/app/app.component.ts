import {Component, NgZone, OnInit} from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from './shared/services/theme.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  theme = 'dark';
  appReady = false;
  private supportedLang = ['en', 'es'];

  constructor(
    private electronService: ElectronService,
    private themeService: ThemeService,
    private translate: TranslateService,
    private router: Router,
    private zone: NgZone
  ) {
    this.electronService.connectDb().then(() => this.appReady = true);
    this.themeService.themeChanges().subscribe(theme => this.theme = theme);
    let language = navigator.language.split('-')[0];
    if (!this.supportedLang.includes(language)) {
      language = 'en';
    }
    this.translate.setDefaultLang(language);
  }

  ngOnInit() {
    this.electronService.ipcRenderer.on('new', () => {
      this.zone.run(() => this.router.navigate(['/notes', 'editor'], {
        queryParams: {
          new: true
        }
      }));
    });
    this.electronService.ipcRenderer.on('find', () => {
      this.zone.run(() => this.router.navigate(['/notes', 'editor'], {
        queryParams: {
          find: true
        }
      }));
    });
  }

}
