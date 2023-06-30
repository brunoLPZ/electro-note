import {Component, Input} from '@angular/core';
import {Note} from '../../../models/note';

@Component({
  selector: 'app-status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.scss']
})
export class StatusBarComponent {
  @Input() note!: Note;
  @Input() isSaved = true;

}
