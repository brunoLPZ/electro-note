import { NgModule } from '@angular/core';
import { NotesRoutingModule } from './notes-routing.module';
import { NoteHomePageComponent } from './pages/note-home-page/note-home-page.component';
import { NoteCardComponent } from './components/note-card/note-card.component';
import { SharedModule } from '../shared/shared.module';
import { CommonModule, DatePipe } from '@angular/common';
import {NoteQuickActionsComponent} from './components/note-quick-actions/note-quick-actions.component';
import {EditorComponent} from './components/editor/editor.component';
import {MarkdownModule, MarkedOptions, MarkedRenderer} from 'ngx-markdown';
import {NoteEditorPageComponent} from './pages/note-editor-page/note-editor-page.component';
import {LinkDialogComponent} from './components/editor/link-dialog/link-dialog.component';
import {ReactiveFormsModule} from '@angular/forms';
import {NoteListComponent} from './components/note-list/note-list.component';
import {StatusBarComponent} from './components/editor/status-bar/status-bar.component';
import {NoteDialogComponent} from './components/note-dialog/note-dialog.component';
import {TagStatsComponent} from './components/tag-stats/tag-stats.component';
import {ImageDialogComponent} from './components/editor/image-dialog/image-dialog.component';
import {CodeDialogComponent} from './components/editor/code-dialog/code-dialog.component';
import {TaskStatsComponent} from './components/task-stats/task-stats.component';
import {Chart, registerables} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {SearchDialogComponent} from './components/search-dialog/search-dialog.component';
Chart.register(...registerables, ChartDataLabels);
export function markedOptionsFactory(): MarkedOptions {
  const renderer = new MarkedRenderer();

  renderer.link = (href, title, text) => '<a href="' + href + '" target="_blank">' + text + '</a>';
  renderer.checkbox = (checked) => {
    if (checked) {
      return '<div class="checkbox checked"></div>';
    }
    return '<div class="checkbox unchecked"></div>';
  };
  return {
    renderer
  };
}

@NgModule({
  declarations: [
    NoteHomePageComponent,
    NoteCardComponent,
    NoteQuickActionsComponent,
    NoteEditorPageComponent,
    EditorComponent,
    LinkDialogComponent,
    NoteListComponent,
    StatusBarComponent,
    NoteDialogComponent,
    TagStatsComponent,
    ImageDialogComponent,
    CodeDialogComponent,
    TaskStatsComponent,
    SearchDialogComponent
  ],
  imports: [NotesRoutingModule, SharedModule, DatePipe, CommonModule, MarkdownModule.forRoot({
    markedOptions: {
      provide: MarkedOptions,
      useFactory: markedOptionsFactory,
    },
  }), ReactiveFormsModule],
  providers: []
})
export class NotesModule {}
