import {Component, EventEmitter, NgZone, OnInit, Output} from '@angular/core';
import {Note} from '../../models/note';
import {NoteService} from '../../services/note-service';
import {SortDirection} from 'mongodb';
import {ElectronService} from '../../../core/services';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.scss']
})
export class NoteListComponent implements OnInit {
  @Output()
  selection: EventEmitter<Note> = new EventEmitter<Note>();
  @Output()
  newNote: EventEmitter<void> = new EventEmitter<void>();

  notes: Note[] = [];
  isOpen = false;
  showMoreNotes = false;
  showSearch = false;

  sortBy: 'lastModifiedDate' | 'title' = 'lastModifiedDate';
  sortDirection: SortDirection = -1;
  private offset = 0;
  private limit = 10;

  constructor(private noteService: NoteService, private electronService: ElectronService,
              private zone: NgZone) {
    this.noteService.noteChanges().subscribe(() => {
      this.getNotes(true);
    });
  }
  ngOnInit() {
    this.getNotes(true);
    this.electronService.ipcRenderer.on('find', () => {
      this.zone.run(() => this.showSearch = true);
    });
  }

  changeSort(sort: 'lastModifiedDate' | 'title') {
    if (this.sortBy === sort) {
      this.sortDirection = this.sortDirection === 1 ? -1 : 1;
    } else {
      this.sortBy = sort;
      this.sortDirection = -1;
    }
    this.getNotes(true);
  }

  nextPage() {
    this.getNotes(false);
  }
  private getNotes(reset: boolean) {
    if (reset) {
      this.offset = 0;
    } else {
      this.offset += this.limit;
    }
    const sort: any = {};
    sort[this.sortBy] = this.sortDirection;
    this.noteService.getNotes(this.limit, this.offset, sort).then(notes => {
      this.showMoreNotes = notes.length === this.limit;
      if (reset) {
        this.notes = notes;
      } else {
        this.notes.push(...notes);
      }
    });
  }
}
