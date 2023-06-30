import {Injectable} from '@angular/core';
import {Chart} from 'chart.js';
import {TranslateService} from '@ngx-translate/core';

@Injectable({providedIn: 'root'})
export class ChartService {

  constructor(private translateService: TranslateService) {
  }
  public buildBarChart(id: string, labels: string[], data: number[], theme: string): Chart<'bar'> {
    let greatestValue = 0;
    for (const value of data) {
      if (value > greatestValue) {
        greatestValue = value;
      }
    }
    const stepSize = greatestValue / 5 > 1 ? Math.round(greatestValue / 5) : 1;
    return new Chart(id, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: data.map((_, index) => {
            if (theme === 'dark') {
              return this.getDarkColor(index);
            }
            return this.getLightColor(index);
          }),
          borderWidth: 0,
          borderRadius: 10
        }]
      },
      options: {
        plugins: {
          legend: {
            display: false
          },
          datalabels: {
            backgroundColor: theme === 'dark' ? 'rgb(15 23 42)' : 'rgb(226 232 240)',
            borderRadius: 3,
            padding: {
              left: 8,
              right: 8
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false,
            }
          },
          y: {
            grid: {
              display: false
            },
            ticks: {
              stepSize
            }
          }
        }
      }
    });
  }

  public buildPieChart(id: string, labels: string[], data: number[], theme: string): Chart<'pie'> {
    return new Chart(id, {
      type: 'pie',
      data: {
        labels: labels.map(l => this.translateService.instant(l)),
        datasets: [{
          data,
          backgroundColor: data.map((_, index) => {
            if (theme === 'dark') {
              return this.getDarkColor(index);
            }
            return this.getLightColor(index);
          }),
          borderWidth: 0
        }]
      },
      options: {
        plugins: {
          legend: {
            display: true
          },
          datalabels: {
            backgroundColor: theme === 'dark' ? 'rgb(15 23 42)' : 'rgb(226 232 240)',
            borderRadius: 3,
            padding: {
              left: 8,
              right: 8
            }
          }
        }
      }
    });
  }

  private getDarkColor(idx: number) {
    return [
      'rgb(0, 52, 107)', // RGB(0, 52, 107)
      'rgb(26, 119, 173)', // RGB(26, 119, 173)
      'rgb(51, 84, 135)', // RGB(51, 84, 135)
      'rgb(76, 149, 197)', // RGB(76, 149, 197)
      'rgb(101, 106, 158)', // RGB(101, 106, 158)
      'rgb(126, 171, 218)', // RGB(126, 171, 218)
      'rgb(151, 136, 181)', // RGB(151, 136, 181)
      'rgb(176, 201, 229)' // RGB(176, 201, 229)
    ][idx % 8];
  }

  private getLightColor(idx: number) {
    return [
      'rgb(127, 154, 180)',   // RGB(127, 154, 180)
      'rgb(153, 174, 198)',   // RGB(153, 174, 198)
      'rgb(177, 193, 212)',   // RGB(177, 193, 212)
      'rgb(201, 213, 226)',   // RGB(201, 213, 226)
      'rgb(143, 150, 168)',   // RGB(143, 150, 168)
      'rgb(168, 185, 204)',   // RGB(168, 185, 204)
      'rgb(193, 200, 216)',   // RGB(193, 200, 216)
      'rgb(218, 225, 232)'    // RGB(218, 225, 232)
    ][idx % 8];
  }
}
