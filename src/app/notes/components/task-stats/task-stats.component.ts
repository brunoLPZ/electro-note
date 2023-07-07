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
        this.chart = this.chartService.buildPieChart('task-stats-chart', stats.labels, stats.data, theme);
      }
    });
  }

}
