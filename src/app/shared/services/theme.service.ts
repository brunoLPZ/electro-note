import {Observable, Subject} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class ThemeService {

  currentTheme: 'dark' | 'light' = 'dark';
  private themeSubject: Subject<'dark' | 'light'> = new Subject<'dark' | 'light'>();

  themeChanges(): Observable<'dark' | 'light'> {
    return this.themeSubject.asObservable();
  }

  changeTheme(theme: 'dark' | 'light') {
    this.currentTheme = theme;
    this.themeSubject.next(theme);
  }
}
