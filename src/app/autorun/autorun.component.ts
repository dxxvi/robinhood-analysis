import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-autorun',
  templateUrl: './autorun.component.html',
  styleUrls: ['./autorun.component.css']
})
export class AutorunComponent implements OnInit {
  @Input() symbol: string;
  @Output() close: EventEmitter<string> = new EventEmitter();

  model: { d: number[], s: number[], p: number[] } = {
    d: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    s: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    p: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  };

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    this.deleteInvalidNumbers();
    const N = 19;
    for (let i = 1; i < this.model.s.length; i++) {
      if (this.model.s[i] === 0) {
        break;
      }
      let cost = 0;
      let n = 0;
      for (let j = 0; j <= i; j++) {
        cost += (N + this.model.p[j]) * this.model.s[j];
        n += this.model.s[j];
        this.model.d[i] = parseInt('' + (cost / n - N - this.model.p[i]) * 100 + 0.9999, 10) / 100;
      }
    }
  }

  private deleteInvalidNumbers() {
    for (let i = 1; i < this.model.s.length; i++) {
      if (this.model.s[i] < this.model.s[i - 1]) {
        for (let j = i; j < this.model.s.length; j++) {
          this.model.s[j] = 0;
        }
        break;
      }
    }
    for (let i = 1; i < this.model.p.length; i++) {
      if (this.model.p[i] >= this.model.p[i - 1]) {
        for (let j = i; j < this.model.p.length; j++) {
          this.model.p[j] = 0;
        }
        break;
      }
    }
    for (let i = 1; i < this.model.p.length; i++) {
      if (this.model.p[i] === 0) {
        this.model.s[i] = 0;
      }
      if (this.model.s[i] === 0) {
        this.model.p[i] = 0;
      }
    }
  }
}
