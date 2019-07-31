import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { TrafficList, TrafficListData } from '../../../@core/data/traffic-list';
import { TrafficBarData, TrafficBar } from '../../../@core/data/traffic-bar';
import { takeWhile } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'ngx-traffic-reveal-card',
  styleUrls: ['./traffic-reveal-card.component.scss'],
  templateUrl: './traffic-reveal-card.component.html',
})
export class TrafficRevealCardComponent implements OnDestroy {

  private alive = true;
  public url = 'https://us-central1-prime-principle-243417.cloudfunctions.net/querys';
  public months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];
  public data : {
    date: string;
    value: number;
    delta: {
      up: boolean;
      value: number;
    };
    comparison: {
      prevDate: string;
      prevValue: number;
      nextDate: string;
      nextValue: number;
    };
  }[];

  @Output() periodChange = new EventEmitter<string>();
  @Output() typeChange = new EventEmitter<string>();

  @Input() periodIn: string = 'year';
  @Input() typeIn: string = 'cantidad';

  periods: string[] = ['month', 'year'];
  types: string[] = ['cantidad', 'pesos'];
  currentTheme: string;

  changePeriod(period: string): void {
    console.log(this.period)
    this.period = period;
    this.type = this.type
    this.periodChange.emit(period);
    this.getCompartiveCard()
  }

  changeType(type: string): void {
    console.log(this.type)
    this.type = type;
    this.period = this.period;
    this.typeChange.emit(type);
    this.getCompartiveCard()
  }

  trafficBarData: TrafficBar;
  trafficListData: TrafficList;
  revealed = false;
  period: string = 'year';
  type: string = 'cantidad';

  constructor(private trafficListService: TrafficListData,
              private trafficBarService: TrafficBarData, private http: HttpClient) {
    this.getTrafficBackCardData(this.period);
    this.getCompartiveCard();
  }
  toggleView() {
    this.revealed = !this.revealed;
  }
  setPeriodAngGetData(value: string): void {
    this.period = value;
    this.getTrafficBackCardData(value);
  }
  getTrafficBackCardData(period: string) {
    this.trafficBarService.getTrafficBarData(period)
      .pipe(takeWhile(() => this.alive ))
      .subscribe(trafficBarData => {
        this.trafficBarData = trafficBarData;
      });
  }
  getCompartiveCard() {
    return this.http
      .get(`${this.url}?type=${this.period}`)
        .subscribe(data => {
          let type = this.type
          let period = this.period
          if (period == 'year') {
            this.trafficListData = data['rows'].map((elem, index) => {
              let value = type == 'cantidad' ? elem.unidades : elem.pesos;
              let date = elem.year
              let lastYear = Number(date) - 1
              let last = data['rows'].find(dat => dat.year == lastYear)              
              let lastValue = last ? type === 'cantidad' ? last.unidades : last.pesos : 0;
              let lastDate = last ? last.year : lastYear
              let upValue = lastValue ? ((Number(value)/Number(lastValue))*100)-100: value ;
              let up = upValue > 0      
              return {
                date,
                value: Number(value).toFixed(2),
                delta: {
                  up,
                  value: Number(upValue).toFixed(2)
                },
                comparison: {
                  prevDate: lastDate,
                  prevValue: lastValue,
                  nextDate: date,
                  nextValue: value
                }
              }
            })
          } else {
            this.trafficListData = data['rows'].map((elem, index) => {
              let value = type == 'cantidad' ? elem.unidades : elem.pesos;
              let year = elem.year
              let month = elem.month
              let _date = new Date()
              _date.setFullYear(year)
              _date.setMonth(Number(month) -1 )
              _date.setDate(15)
              let date = `${this.months[_date.getMonth()]} ${_date.getFullYear()}`
              let _lastDate = new Date()
              _lastDate.setFullYear(_date.getFullYear())
              _lastDate.setMonth(_date.getMonth())
              _lastDate.setDate(15)
              let lastYear = _lastDate.getFullYear()
              let lastMonth = _lastDate.getMonth()
              let last = data['rows'].find(dat => dat.year == lastYear && dat.month == lastMonth)
              let lastValue = last ? type === 'cantidad' ? last.unidades : last.pesos : 0;
              let lastDate = last ? `${last.month}` : '-'
              let upValue = lastValue ? ((Number(value)/Number(lastValue))*100)-100: value ;
              let up = upValue > 0      
              return {
                date,
                value: Number(value).toFixed(2),
                delta: {
                  up,
                  value: Number(upValue).toFixed(2)
                },
                comparison: {
                  prevDate: lastDate,
                  prevValue: lastValue,
                  nextDate: month,
                  nextValue: value
                }
              }
            }) 
          }
        })
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
