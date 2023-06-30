import {Injectable} from '@angular/core';
import {ElectronService} from '../../core/services';
import {Collection} from 'mongodb';
import {v4 as uuidv4} from 'uuid';
import {Tag} from '../models/tag';

@Injectable({providedIn: 'root'})
export class TagService {

  private collection: Collection;

  constructor(private electronService: ElectronService) {
    this.collection = this.electronService.database.collection('tags');
  }

  async upsertTags(tags: string[]): Promise<void> {
    for (const tag of tags) {
      await this.collection.updateOne({name: tag}, {
        $inc: {usages: 1},
        $setOnInsert: {uuid: uuidv4(), name: tag}
      }, {upsert: true});
    }
  }

  async removeTags(tags: string[]): Promise<void> {
    await this.collection.updateMany({name: {$in: tags}}, {
      $inc: {usages: -1}
    });
  }

  async getTagStats(): Promise<{labels: string[]; data: number[]}> {
    const mostUsedTags = await this.collection.find<Tag>({usages: {$gt: 0}}).sort({usages: -1}).limit(10).toArray();
    const labels: string[] = [];
    const data: number[] = [];
    mostUsedTags.forEach(tag => {
      labels.push(tag.name);
      data.push(tag.usages);
    });
    return {
      labels,
      data
    };
  }

}
