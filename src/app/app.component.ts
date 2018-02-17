import { Component, ElementRef, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';

import * as Highcharts from 'highcharts';
import { Gradient } from 'highcharts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  symantec = true;
  symbols: string[] = [];
  model: { newSymbol: string } = { newSymbol: '' };
  alert = false;
  data: string;
  jsonData: string;

  private chart: any;

  private static hexToRGBA(hex: string|Gradient, opacity: number): string {
    if (typeof hex === 'string') {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return 'rgba(' + parseInt(result[1], 16) + ', ' + parseInt(result[2], 16) + ', ' + parseInt(result[3], 16) +
        ', ' + opacity + ')';
    }
    return 'rgba(255, 255, 255, 0)';
  }

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    const colorIndex = 7;
    const hc = this.el.nativeElement.querySelector('div.highchart');
    this.chart = Highcharts.chart(hc, {
      chart: { zoomType: 'x' },
      credits: { enabled: false },
      plotOptions: {
        area: {
          fillColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
            stops: [
              [0, Highcharts.getOptions().colors[colorIndex]],
              [1, AppComponent.hexToRGBA(Highcharts.getOptions().colors[colorIndex], 0)]
            ]
          },
          lineWidth: 1,
          states: { hover: { lineWidth: 1 }},
          threshold: null
        }
      },
      title: { text: null },
      xAxis: { type: 'datetime' },
      yAxis: { title: { text: null } },
      legend: { enabled: false },
      series: [{
        type: 'area',
        name: 'seriesX',
        color: Highcharts.getOptions().colors[colorIndex],
        data: []
      }]
    });

    Observable.timer(19482).subscribe(v => this.symantec = false);
  }

  drawGraph() {
/*
    if (this.data) {
      const lines = this.data.split('\n');
      const chartData = [];
      lines.forEach(s => {
        if (s.trim().length > 20) {
          const parts = s.trim().split(' ');
          const dates = parts[0].split('-');
          const times = parts[1].split(':');
          const t = Date.UTC(
            parseInt(dates[0], 10), parseInt(dates[1], 10) - 1, parseInt(dates[2], 10),
            parseInt(times[0], 10), parseInt(times[1], 10), parseInt(times[2], 10)
          );
          chartData.push([t, parseFloat(parts[2])]);
        }
      });
      this.chart.series[0].setData(chartData);
    }
*/
    if (this.jsonData) {
      const chartData: Array<Quote> = JSON.parse(this.jsonData);
      const highchartsData =
        chartData.map(q => [Date.UTC(q.year, q.month - 1, q.date, q.hour, q.minute, q.second), q.quote]);
      this.chart.series[0].setData(highchartsData);
    }
  }

  onSubmit(): void {
    if (this.symbols.find(s => s === this.model.newSymbol.toUpperCase())) {
      this.alert = true;
    } else {
      this.symbols.push(this.model.newSymbol.toUpperCase());
      this.model.newSymbol = '';
      this.alert = false;
    }
  }

  resetAlert(): void {
    this.alert = false;
  }

  closeHandler(symbol: string) {
    const i = this.symbols.findIndex(s => s === symbol);
    if (i >= 0) {
      this.symbols.splice(i, 1);
    }
  }
}

interface Quote {
  year: number;
  month: number;
  date: number;
  hour: number;
  minute: number;
  second: number;
  quote: number;
}
