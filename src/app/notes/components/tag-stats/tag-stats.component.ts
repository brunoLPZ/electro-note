import {Component, OnInit} from '@angular/core';
import { Chart } from 'chart.js';
import {TagService} from '../../services/tag-service';
import {ThemeService} from '../../../shared/services/theme.service';
import {NoteService} from '../../services/note-service';
import {ChartService} from '../../services/chart-service';

@Component({
  selector: 'app-tag-stats',
  templateUrl: './tag-stats.component.html',
  styleUrls: ['./tag-stats.component.scss']
})
export class TagStatsComponent implements OnInit {
  chart?: Chart<'bar'>;

  constructor(private noteService: NoteService, private tagService: TagService,
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
    this.tagService.getTagStats().then(stats => {
      if (stats.data.length) {
        this.chart = this.chartService.buildBarChart('tag-stats-chart', stats.labels, stats.data, theme);
      }
    });
  }



}
