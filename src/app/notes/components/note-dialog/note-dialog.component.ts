import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Note} from '../../models/note';
import {v4 as uuidv4} from 'uuid';

@Component({
  selector: 'app-note-dialog',
  templateUrl: './note-dialog.component.html',
  styleUrls: ['./note-dialog.component.scss']
})
export class NoteDialogComponent implements OnInit, OnDestroy {

  @Input()
  note?: Note | undefined;
  @Input()
  showDialog = false;
  @Output()
  closed: EventEmitter<void> = new EventEmitter<void>();
  @Output()
  saved: EventEmitter<Note> = new EventEmitter<Note>();
  formGroup!: FormGroup;

  closeListener = (event: KeyboardEvent) => {
    this.closeOnEsc(event);
  };

  ngOnInit() {
    if (!this.note) {
      this.note = {uuid: uuidv4(), title: '', description: '', tags: [], content: ''};
    }
    this.formGroup = new FormGroup({
      title: new FormControl(this.note.title, [Validators.required]),
      description: new FormControl(this.note.description, [Validators.maxLength(240)]),
      tags: new FormControl(this.note.tags.join(', '), [])
    });
    document.addEventListener('keydown', this.closeListener);
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this.closeListener);
  }
  saveNote() {
    if (this.note && this.formGroup.value.title) {
      this.saved.emit({
        uuid: this.note.uuid,
        title: this.formGroup.value.title,
        description: this.formGroup.value.description,
        tags: this.formGroup.value.tags ? this.formGroup.value.tags.split(',').map((t: string) => t.trim()) : [],
        content: this.note.content,
        lastModifiedDate: this.note.lastModifiedDate
      });
    }
  }
  closeOnEsc(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.closed.emit();
    }
  }
}
