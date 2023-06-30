import {Component, OnInit} from '@angular/core';
import { Chart } from 'chart.js';
import {ThemeService} from '../../../shared/services/theme.service';
import {NoteService} from '../../services/note-service';
import {TaskService} from '../../services/task-service';
import {ChartService} from '../../services/chart-service';

@Component({
  selector: 'app-task-stats',
  templateUrl: './task-stats.component.html',
  styleUrls: ['./task-stats.component.scss']
})
export class TaskStatsComponent implements OnInit {
  chart?: Chart<'pie'>;
  showMock = false;

  constructor(private noteService: NoteService, private taskService: TaskService,
              private themeService: ThemeService, private chartService: ChartService) {
    this.themeService.themeChanges().subscribe(theme => {
      this.createChart(theme);
    });
    this.noteService.noteChanges().subscribe(() => {
      this.createChart(this.themeService.currentTheme);
    });
  }

  ngOnInit() {
    this.createChart(this.themeService.currentTheme);
  }

  private createChart(theme: 'dark' | 'light'){
    Chart.defaults.color = theme === 'dark' ? 'rgb(226, 232, 240)' : 'rgb(30, 41, 59)';
    this.chart?.destroy();
    this.chart = undefined;
    this.taskService.getTaskStats().then(stats => {
      if (stats.data.length) {
        this.showMock = false;
        this.chart = this.chartService.buildPieChart('task-stats-chart', stats.labels, stats.data, theme);
      } else {
        this.showMock = true;
        this.chart = this.chartService.buildPieChart('task-stats-chart',
          ['NOTES.HOME.PAGE.TASKS_CHART.COMPLETED_LABEL', 'NOTES.HOME.PAGE.TASKS_CHART.PENDING_LABEL'],
          [14, 20], theme);
      }
    });
  }

  private getDarkColor(idx: number, opacity = 1) {
    return [
      `rgb(32, 77, 132, ${opacity})`,
      `rgb(57, 142, 196, ${opacity})`,
      `rgb(82, 107, 160, ${opacity})`,
      `rgb(107, 172, 224, ${opacity})`,
      `rgb(132, 137, 188, ${opacity})`,
      `rgb(157, 202, 252, ${opacity})`,
      `rgb(182, 167, 216, ${opacity})`,
      `rgb(207, 232, 255, ${opacity})`,
    ][idx];
  }

  private getLightColor(idx: number, opacity = 1) {
    return [
      `rgb(197, 207, 216, ${opacity})`,
      `rgb(160, 175, 189, ${opacity})`,
      `rgb(123, 143, 162, ${opacity})`,
      `rgb(87, 112, 136, ${opacity})`,
      `rgb(66, 88, 113, ${opacity})`,
      `rgb(45, 63, 90, ${opacity})`,
      `rgb(23, 38, 67, ${opacity})`,
      `rgb(0, 14, 45, ${opacity})`,
    ][idx];
  }

}
