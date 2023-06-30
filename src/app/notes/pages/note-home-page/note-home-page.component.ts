import {Component, OnInit} from '@angular/core';
import {NoteService} from '../../services/note-service';
import {Note} from '../../models/note';

@Component({
  selector: 'app-note-home-page',
  templateUrl: './note-home-page.component.html',
  styleUrls: ['./note-home-page.component.scss']
})
export class NoteHomePageComponent implements OnInit {

  notes: Note[] = [];
  constructor(private noteService: NoteService) {
    this.noteService.noteChanges().subscribe(() => this.loadMostRecentNotes());
  }

  ngOnInit() {
    this.loadMostRecentNotes();
  }

  private loadMostRecentNotes() {
    this.noteService.getMostRecentNotes().then(notes => {
      this.notes = notes;
    });
  }

}
