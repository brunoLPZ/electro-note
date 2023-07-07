import {Component, OnInit} from '@angular/core';
import {NoteService} from '../../services/note-service';
import {Note} from '../../models/note';
import {TaskService} from '../../services/task-service';
import {TagService} from '../../services/tag-service';

@Component({
  selector: 'app-note-home-page',
  templateUrl: './note-home-page.component.html',
  styleUrls: ['./note-home-page.component.scss']
})
export class NoteHomePageComponent implements OnInit {

  notes: Note[] = [];
  showTagStats = false;
  showTaskStats = false;

  constructor(private noteService: NoteService, private tagService: TagService, private taskService: TaskService) {
    this.noteService.noteChanges().subscribe(() => {
      this.loadMostRecentNotes();
      this.checkForStats();
    });
  }

  ngOnInit() {
    this.loadMostRecentNotes();
    this.checkForStats();
  }

  private loadMostRecentNotes() {
    this.noteService.getMostRecentNotes().then(notes => {
      this.notes = notes;
    });
  }

  private checkForStats() {
    this.tagService.getTagStats().then(stats => this.showTagStats = stats.data.length > 0);
    this.taskService.getTaskStats().then(stats => this.showTaskStats = stats.data.length > 0);
  }
}
