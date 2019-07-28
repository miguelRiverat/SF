import { Injectable } from '@angular/core';
import { of as observableOf,  Observable } from 'rxjs';
import { ProfitBarAnimationChartData } from '../data/profit-bar-animation-chart';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ProfitBarAnimationChartService extends ProfitBarAnimationChartData {

  private data: any;
  public url = 'https://us-central1-prime-principle-243417.cloudfunctions.net/querys';

  constructor(private http : HttpClient) {
    super();
  }

  getDataForFirstLine(): number[] {
    return this.createEmptyArray(100)
      .map((_, index) => {
        const oneFifth = index / 5;

        return (Math.sin(oneFifth) * (oneFifth - 10) + index / 6) * 5;
      });
  }

  getDataForSecondLine(): number[] {
    return this.createEmptyArray(100)
      .map((_, index) => {
        const oneFifth = index / 5;

        return (Math.cos(oneFifth) * (oneFifth - 10) + index / 6) * 5;
      });
  }

  createEmptyArray(nPoints: number) {
    return Array.from(Array(nPoints));
  }

  getChartData(): Observable<{ firstLine: number[]; secondLine: number[]; }> {
    return observableOf(this.data);
  }
}
