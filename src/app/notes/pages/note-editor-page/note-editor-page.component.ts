import {Component, NgZone} from '@angular/core';
import {Note} from '../../models/note';
import {ActivatedRoute} from '@angular/router';
import {NoteService} from '../../services/note-service';
import {NotificationService} from '../../../core/services/electron/notification.service';
import {ElectronService} from '../../../core/services';

@Component({
  selector: 'app-note-editor-page',
  templateUrl: './note-editor-page.component.html',
  styleUrls: ['./note-editor-page.component.scss']
})
export class NoteEditorPageComponent {

  note?: Note;
  noteCopy?: Note;
  showNoteDialog = false;
  isSaved = true;
  showSearch = false;

  constructor(private activateRoute: ActivatedRoute, private noteService: NoteService,
              private zone: NgZone, private notificationService: NotificationService,
              private electronService: ElectronService) {
    this.electronService.ipcRenderer.on('new', () => {
      this.zone.run(() => {
        this.note = undefined;
        this.noteCopy = undefined;
        this.showNoteDialog = true;
      });
    });
    this.electronService.ipcRenderer.on('find', () => {
      this.zone.run(() => {
        this.showSearch = true;
      });
    });
    this.activateRoute.queryParamMap.subscribe((params) => {
      if (params.has('new')) {
        this.note = undefined;
        this.noteCopy = undefined;
        this.showNoteDialog = true;
      } else if (params.has('uuid')) {
        const uuid = params.get('uuid');
        if (uuid) {
          this.loadNote(uuid, params.has('edit'));
        }
      } else if (params.has('find')) {
        this.showSearch = true;
      }
    });
  }

  createNewNote() {
    this.note = undefined;
    this.showNoteDialog = true;
  }

  selectNote(note: Note) {
    this.isSaved = true;
    this.note = note;
    this.noteCopy = {...note};
  }

  saveNote(note: Note) {
    this.noteService.upsertNote(note).then((result) => {
      if (result) {
        this.showNoteDialog = false;
        this.note = note;
        this.noteCopy = {...note};
        this.notificationService.showNotification(note.title, 'Note saved successfully');
      } else {
        this.notificationService.showNotification('Error', `Error saving note: ${note.title}`);
      }
    });
  }

  loadNote(uuid: string, edit: boolean) {
    this.noteService.getNote(uuid).then((note) => {
      if (note != null) {
        this.note = note;
        this.noteCopy = {...note};
        this.showNoteDialog = edit;
      } else {
        this.notificationService.showNotification('Error', 'Error loading note');
      }
    });
  }

  deleteNode(note: Note) {
    this.noteService.deleteNote(note).then((result) => {
      if (result) {
        this.note = undefined;
        this.notificationService.showNotification(note.title, 'Note deleted successfully');
      } else {
        this.notificationService.showNotification('Error', `Error deleting note: ${note.title}`);
      }
    });
  }
}
