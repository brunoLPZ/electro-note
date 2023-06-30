import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { NgHeroiconsModule } from '@dimaslz/ng-heroicons';
import {RouterModule} from '@angular/router';
import {DialogComponent} from './components/dialog/dialog.component';

@NgModule({
  declarations: [HeaderComponent, DialogComponent],
    imports: [CommonModule, TranslateModule, FormsModule, NgHeroiconsModule, RouterModule],
  exports: [TranslateModule, FormsModule, HeaderComponent, NgHeroiconsModule, DialogComponent]
})
export class SharedModule {}
