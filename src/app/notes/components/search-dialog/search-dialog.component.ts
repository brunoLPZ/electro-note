import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NoteService} from '../../services/note-service';
import {Note} from '../../models/note';
import {Router} from '@angular/router';


@Component({
  selector: 'app-search-dialog',
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.scss']
})
export class SearchDialogComponent implements OnInit, OnDestroy {

  @Input()
  showDialog = false;
  @Output()
  closed: EventEmitter<void> = new EventEmitter<void>();
  notes: Note[] = [];
  formGroup!: FormGroup;
  showResults = false;

  constructor(private noteService: NoteService, private router: Router) {
  }
  closeListener = (event: KeyboardEvent) => {
    this.closeOnEsc(event);
  };

  ngOnInit() {
    this.formGroup = new FormGroup({
      search: new FormControl('', [Validators.required]),
      field: new FormControl('title', [Validators.required])
    });
    this.formGroup.controls.field.valueChanges.subscribe(() => this.search());
    document.addEventListener('keydown', this.closeListener);
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this.closeListener);
  }

  search() {
    const search = this.formGroup.controls.search.value;
    const field = this.formGroup.controls.field.value;
    if (search && field) {
      if (field === 'title') {
        this.noteService.searchNoteByTitle(search).then((notes) => {
          this.showResults = true;
          this.notes = notes;
        });
      } else {
        this.noteService.searchNoteByTag(search).then((notes) => {
          this.showResults = true;
          this.notes = notes;
        });
      }
    }
  }

  closeOnEsc(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.close();
    }
  }

  clickNote(note: Note) {
    this.router.navigate(['/notes', 'editor'], {
      queryParams: {
        uuid: note.uuid
      }
    }).then(() => {
      this.formGroup.patchValue({search: '', field: 'title'});
      this.notes = [];
      this.showResults = false;
      this.closed.emit();
    });
  }

  close() {
    this.formGroup.patchValue({search: '', field: 'title'});
    this.notes = [];
    this.showResults = false;
    this.closed.emit();
  }
}
