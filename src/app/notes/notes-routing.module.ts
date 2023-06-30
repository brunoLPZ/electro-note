import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {NoteHomePageComponent} from './pages/note-home-page/note-home-page.component';
import {NoteEditorPageComponent} from './pages/note-editor-page/note-editor-page.component';

const routes: Routes = [
  {path: '', component: NoteHomePageComponent},
  {path: 'editor', component: NoteEditorPageComponent}
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotesRoutingModule {}
