import {Injectable} from '@angular/core';
import {ElectronService} from '../../core/services';
import {Collection, SortDirection} from 'mongodb';
import {Note} from '../models/note';
import {TagService} from './tag-service';
import {Observable, Subject} from 'rxjs';
import {Task} from '../models/task';

@Injectable({providedIn: 'root'})
export class NoteService {

  private notesChangeSubject: Subject<void> = new Subject();
  private collection: Collection;

  constructor(private electronService: ElectronService, private tagService: TagService) {
    this.collection = this.electronService.database.collection('notes');
  }

  noteChanges(): Observable<void> {
    return this.notesChangeSubject.asObservable();
  }

  async getNote(uuid: string): Promise<Note | null> {
    return this.collection.findOne<Note>({uuid});
  }
  async getMostRecentNotes(): Promise<Note[]> {
    return this.collection.find<Note>({isTemplate: false}).sort({lastModifiedDate: -1}).limit(5).toArray();
  }

  async getNotes(limit = 10, offset = 0, isTemplate = false, sort: {[key: string]: SortDirection} = {title: -1}): Promise<Note[]> {
    return this.collection.find<Note>({isTemplate}).sort(sort).limit(10).skip(offset).toArray();
  }

  async upsertNote(note: Note): Promise<boolean> {
    const existingNote = await this.collection.findOne<Note>({uuid: note.uuid});
    const tasks = !note.isTemplate ? this.extractTasks(note) : [];
    // Update note if exists
    if (existingNote != null) {
      if (!note.isTemplate) {
        // Detect removed tags
        const removedTags = existingNote.tags.filter(t => !note.tags.includes(t));
        if (removedTags.length) {
          await this.tagService.removeTags(removedTags);
        }
        // Detect new tags
        const newTags = note.tags.filter(t => !existingNote.tags.includes(t));
        // Upsert new tags tags
        await this.tagService.upsertTags(newTags);
      }
      const updateResult = await this.collection.updateOne({uuid: note.uuid}, {
        $set: {
          title: note.title,
          description: note.description,
          isTemplate: note.isTemplate,
          content: note.content,
          lastModifiedDate: Date.now(),
          tags: note.tags,
          tasks
        }});
      this.notesChangeSubject.next();
      return updateResult.modifiedCount === 1;
    }
    // Insert note if it doesn't exist
    else {
      if (!note.isTemplate) {
        // Upsert new tags tags
        await this.tagService.upsertTags(note.tags);
      }
      const insertResult = await this.collection.insertOne(
        {...note, tasks, lastModifiedDate: Date.now()});
      this.notesChangeSubject.next();
      return !!insertResult.insertedId;
    }
  }

  async deleteNote(note: Note): Promise<boolean> {
    if (note.tags.length && !note.isTemplate) {
      await this.tagService.removeTags(note.tags);
    }
    const result = await this.collection.deleteOne({uuid: note.uuid});
    this.notesChangeSubject.next();
    return result.deletedCount === 1;
  }

  async searchNoteByTitle(title: string): Promise<Note[]> {
    return this.collection.find<Note>({title: {$regex: `.*${title}.*`, $options: 'i'}}).toArray();
  }

  async searchNoteByTag(tag: string): Promise<Note[]> {
    return this.collection.find<Note>({tags: {$regex: `.*${tag}.*`, $options: 'i'}}).toArray();
  }

  async getTemplates(): Promise<Note[]> {
    return this.collection.find<Note>({isTemplate: true}).toArray();
  }

  private extractTasks(note: Note): Task[] {
    const tasks: Task[] = [];
    for (const line of note.content.split('\n')) {
      const match = line.match(/^\s*-\s+\[(\s|x|X)]\s+(.*)$/);
      if (match && match.length === 3) {
        tasks.push({name: match[2], done: match[1] === 'x'});
      }
    }
    return tasks;
  }

}
