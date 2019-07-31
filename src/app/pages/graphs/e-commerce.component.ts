import { Component } from '@angular/core';
import { EChartOption } from 'echarts';

@Component({
  selector: 'ngx-ecommerce',
  templateUrl: './e-commerce.component.html',
})
export class ECommerceComponent {
  options: any;
  xAxisData = [];
  data1 = [];
  data2 = [];

  public chartOption: EChartOption;

  public loadingOpts = {
    text: 'loading',
    color: '#ffffff',
    textColor: '#000',
    maskColor: 'rgba(255, 255, 255, 0.8)',
    zlevel: 0
  }

  constructor() {
    for (var i = 0; i < 100; i++) {
      this.xAxisData.push('Head' + i);
      this.data1.push((Math.sin(i / 5) * (i / 5 -10) + i / 6) * 5);
      this.data2.push((Math.cos(i / 5) * (i / 5 -10) + i / 6) * 5);
    }
      this.chartOption = {
        title: {
            text: 'Ejemplo'
        },
        legend: {
            data: ['bar', 'bar2'],
            align: 'left'
        },
        toolbox: {
            y: 'bottom',
            feature: {
                magicType: {
                    type: ['stack', 'tiled']
                },
                dataView: {},
                saveAsImage: {
                    pixelRatio: 2
                }
            }
        },
        tooltip: {},
        xAxis: {
            data: this.xAxisData,
            silent: false,
            splitLine: {
                show: false
            }
        },
        yAxis: {
        },
        series: [{
            name: 'bar',
            type: 'bar',
            data: this.data1,
            animationDelay: function (idx) {
                return idx * 10;
            }
        }, {
            name: 'bar2',
            type: 'bar',
            data: this.data2,
            animationDelay: function (idx) {
                return idx * 10 + 100;
            }
        }],
        animationEasing: 'elasticOut',
        animationDelayUpdate: function (idx) {
            return idx * 5;
        }
      }
    console.log(this.options)
  }
}
