import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'ngx-traffic-cards-header',
  styleUrls: ['./traffic-cards-header.component.scss'],
  templateUrl: './traffic-cards-header.component.html',
})
export class TrafficCardsHeaderComponent implements OnDestroy {
  private alive = true;

  @Output() periodChange = new EventEmitter<string>();
  @Output() typeChange = new EventEmitter<string>();

  @Input() period: string = 'year';
  @Input() type: string = 'cantidad';

  periods: string[] = ['month', 'year'];
  types: string[] = ['cantidad', 'pesos'];
  currentTheme: string;

  constructor(private themeService: NbThemeService) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
      });
  }

  changePeriod(period: string): void {
    this.period = period;
    this.type = this.type
    this.periodChange.emit(period);
  }

  changeType(type: string): void {
    this.type = type;
    this.period = this.period;
    this.typeChange.emit(type);
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
