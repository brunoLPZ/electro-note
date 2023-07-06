import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Note} from '../../models/note';
import {v4 as uuidv4} from 'uuid';
import {NoteService} from '../../services/note-service';

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
  isNewNote = false;
  templates: Note[] = [];
  currentTemplate?: Note;

  constructor(private noteService: NoteService) {
  }
  closeListener = (event: KeyboardEvent) => {
    this.closeOnEsc(event);
  };

  ngOnInit() {
    if (!this.note) {
      this.noteService.getTemplates().then((templates) => {
        this.templates = templates;
      });
      this.isNewNote = true;
      this.note = {uuid: uuidv4(), title: '', isTemplate: false, description: '', tags: [], content: ''};
    }
    this.formGroup = new FormGroup({
      title: new FormControl(this.note.title, [Validators.required]),
      description: new FormControl(this.note.description, [Validators.maxLength(240)]),
      tags: new FormControl(this.note.tags.join(', '), []),
      isTemplate: new FormControl(this.note.isTemplate, [Validators.required]),
      template: new FormControl()
    });
    this.formGroup.get('template')?.valueChanges.subscribe(uuid => {
      const template = this.templates.find(t => t.uuid === uuid);
      if (this.note) {
        this.note.content = template ? template.content : '';
        let tags = this.formGroup.value.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t);
        tags = tags.filter((t: string) => !this.currentTemplate?.tags.includes(t));
        if (template?.tags.length) {
          if (tags.length) {
            tags = tags.join(', ') + ', ' + template.tags.join(', ');
          } else {
            tags = template.tags.join(', ');
          }
        }
        this.formGroup.get('tags')?.setValue(tags);
      }
      this.currentTemplate = template;
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
        isTemplate: this.formGroup.value.isTemplate,
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
