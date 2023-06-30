import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Note} from '../../models/note';
import {NoteService} from '../../services/note-service';
import {NotificationService} from '../../../core/services/electron/notification.service';

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss']
})
export class NoteCardComponent {

  @Input()
  note!: Note;
  @Output()
  closed: EventEmitter<void> = new EventEmitter<void>();

  constructor(private noteService: NoteService, private notificationService: NotificationService) {
  }

  deleteNote(event: Event) {
    event.stopPropagation();
    this.noteService.deleteNote(this.note).then((result) => {
      if (result) {
        this.notificationService.showNotification(this.note.title, 'Note deleted successfully');
      } else {
        this.notificationService.showNotification('Error', `Error deleting note: ${this.note.title}`);
      }
    });
  }
}
