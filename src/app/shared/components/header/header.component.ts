import { Component } from '@angular/core';
import {ThemeService} from '../../services/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  theme = 'dark';
  constructor(private themeService: ThemeService) {
    this.themeService.themeChanges().subscribe(theme => this.theme = theme);
  }

  changeTheme() {
    this.themeService.changeTheme(this.theme === 'dark' ? 'light' : 'dark');
  }
}
