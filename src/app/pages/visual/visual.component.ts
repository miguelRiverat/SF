import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EChartOption } from 'echarts';

@Component({
  selector: 'ngx-visual',
  templateUrl: './visual.component.html',
  styleUrls: ['./visual.component.scss']
})
export class VisualComponent {

  public chartOption: EChartOption;
  public options: EChartOption;
  public showOptions = false
  public loadingOpts = {
    text: 'loading',
    color: '#ffffff',
    textColor: '#000',
    maskColor: 'rgba(255, 255, 255, 0.8)',
    zlevel: 0
  }
  public colors = ['#da0d68','#975e6d','#e0719c','#f99e1c','#ef5a78','#f7f1bd','#da1d23','#dd4c51','#3e0317','#e62969','#6569b0','#ef2d36','#c94a44','#b53b54','#a5446f','#dd4c51','#f2684b','#e73451','#e65656','#f89a1c','#aeb92c','#4eb849','#f68a5c','#baa635','#f7a128','#f26355','#e2631e','#fde404','#7eb138','#ebb40f','#e1c315','#9ea718','#94a76f','#d0b24f','#8eb646','#faef07','#c1ba07','#b09733','#8f1c53','#b34039','#ba9232','#8b6439','#187a2f','#a2b029','#718933','#3aa255','#a2bb2b','#62aa3c','#03a653','#038549','#28b44b','#a3a830','#7ac141','#5e9a80','#0aa3b5','#9db2b7','#8b8c90','#beb276','#fefef4','#744e03','#a3a36f','#c9b583','#978847','#9d977f','#cc7b6a','#db646a','#76c0cb','#80a89d','#def2fd','#7a9bae','#039fb8','#5e777b','#120c0c','#c94930','#caa465','#dfbd7e','#be8663','#b9a449','#899893','#a1743b','#894810','#ddaf61','#b7906f','#eb9d5f','#ad213e','#794752','#cc3d41','#b14d57','#c78936','#8c292c','#e5762e','#a16c5a','#a87b64','#c78869','#d4ad12','#9d5433','#c89f83','#bb764c','#692a19','#470604','#e65832','#d45a59','#310d0f','#ae341f','#d78823','#da5c1f','#f89a80','#f37674','#e75b68','#d0545f']



  constructor(private http: HttpClient) {
    this.getData()
  }

  getData() {
    this.http
      .get('https://us-central1-prime-principle-243417.cloudfunctions.net/generic-query?type=table&table=cluster_disease_unit_20190201')
      .subscribe(
          data => {
            this.getChartOptions(data)
      },
      error => {
          console.log('sec error', error)
          
      },
      () => {
          console.log('sec on finish')
      }

      )
    }
    getChartOptions (data) {
      console.log(data)
      this.chartOption = {
        title: {
            text: '',
            left: 10
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            bottom: 90
        },
        dataZoom: [{
            type: 'inside'
        }, {
            type: 'slider'
        }],
        xAxis: {
            data: [],
            silent: false,
            splitLine: {
                show: false
            },
            splitArea: {
                show: false
            }
        },
        yAxis: {
            splitArea: {
                show: false
            }
        },
        series: [{
            type: 'bar',
            data: [],
            large: true
        }]
      }
      data['rows'].forEach(element => {
        this.chartOption['series'][0]['data'].push(`${element.venta}`) 
        this.chartOption['xAxis']['data'].push(`${element.enfermedad}`)
      })
      this.showOptions = true
    }
}
