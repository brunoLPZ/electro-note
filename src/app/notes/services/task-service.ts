import {Injectable} from '@angular/core';
import {ElectronService} from '../../core/services';
import {Collection} from 'mongodb';

@Injectable({providedIn: 'root'})
export class TaskService {

  private collection: Collection;

  constructor(private electronService: ElectronService) {
    this.collection = this.electronService.database.collection('notes');
  }

  async getTaskStats(): Promise<{labels: string[]; data: number[]}> {
    const stats = await this.collection.aggregate<{_id: boolean; count: number}>([
      {
        $match: {
          tasks: {
            $exists: true,
            $ne: [],
          },
        },
      },
      {
        $unwind: {
          path: '$tasks',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $group: {
          _id: '$tasks.done',
          count: {
            $sum: 1,
          },
        },
      },
    ]).toArray();
    const labels: string[] = [];
    const data: number[] = [];
    for (const stat of stats) {
      // eslint-disable-next-line no-underscore-dangle
      labels.push(stat._id ? 'NOTES.HOME.PAGE.TASKS_CHART.COMPLETED_LABEL' : 'NOTES.HOME.PAGE.TASKS_CHART.PENDING_LABEL');
      data.push(stat.count);
    }
    return {
      labels,
      data
    };
  }

}
