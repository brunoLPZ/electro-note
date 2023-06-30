import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
  @Input()
  title = 'Dialog';
  @Input()
  size: 'xs' | 'md' | 'lg' | 'xl' = 'md';

}
