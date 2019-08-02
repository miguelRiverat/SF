import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EChartOption } from 'echarts';

@Component({
  selector: 'ngx-visual',
  templateUrl: './visual.component.html',
  styleUrls: ['./visual.component.scss']
})
export class VisualComponent {

  @Output() corpsUnidadOut = new EventEmitter<string>();
  @Output() corpsPesosOut = new EventEmitter<string>();
  @Output() corpsPrecioOut = new EventEmitter<string>();

  @Input() corpsUnidadIn = 'SANFER CORP.';
  @Input() corpsPesosIn = 'SANFER CORP.';
  @Input() corpsPrecioIn = 'SANFER CORP.';


  public chartOption: EChartOption;
  public options: EChartOption;
  public optionsKpi: EChartOption;
  public showOptions = false

  public modelPredict: {  
    corporacion : String,
    laboratorio	: String,
    moleculan1	: String,
    presentacion	: String,
    producto	: String,
    mthunidades	: String,
    mthpesos	: String,
    mthprecio	: String,
    fechaventa: String
  }[]


  public listData = []
  public loadingOpts = {
    text: 'loading',
    color: '#ffffff',
    textColor: '#000',
    maskColor: 'rgba(255, 255, 255, 0.8)',
    zlevel: 0
  }
  public colors = ['#da0d68','#975e6d','#e0719c','#f99e1c','#ef5a78','#f7f1bd','#da1d23','#dd4c51','#3e0317','#e62969','#6569b0','#ef2d36','#c94a44','#b53b54','#a5446f','#dd4c51','#f2684b','#e73451','#e65656','#f89a1c','#aeb92c','#4eb849','#f68a5c','#baa635','#f7a128','#f26355','#e2631e','#fde404','#7eb138','#ebb40f','#e1c315','#9ea718','#94a76f','#d0b24f','#8eb646','#faef07','#c1ba07','#b09733','#8f1c53','#b34039','#ba9232','#8b6439','#187a2f','#a2b029','#718933','#3aa255','#a2bb2b','#62aa3c','#03a653','#038549','#28b44b','#a3a830','#7ac141','#5e9a80','#0aa3b5','#9db2b7','#8b8c90','#beb276','#fefef4','#744e03','#a3a36f','#c9b583','#978847','#9d977f','#cc7b6a','#db646a','#76c0cb','#80a89d','#def2fd','#7a9bae','#039fb8','#5e777b','#120c0c','#c94930','#caa465','#dfbd7e','#be8663','#b9a449','#899893','#a1743b','#894810','#ddaf61','#b7906f','#eb9d5f','#ad213e','#794752','#cc3d41','#b14d57','#c78936','#8c292c','#e5762e','#a16c5a','#a87b64','#c78869','#d4ad12','#9d5433','#c89f83','#bb764c','#692a19','#470604','#e65832','#d45a59','#310d0f','#ae341f','#d78823','#da5c1f','#f89a80','#f37674','#e75b68','#d0545f']
  public months = ['', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  public corpUrl = `https://us-central1-prime-principle-243417.cloudfunctions.net/generic-query?type=corp`
  public corpsUnidad = [];
  public corpsPesos = [];
  public corpsPrecio = [];


  constructor(private http: HttpClient) {
    this.getCorps()
    this.getData()
    this.getMonths()
  }

  getCorps () {
    return this.http
    .get(this.corpUrl)
    .subscribe(data => {
        let corps = data['rows'].map(element => element.corporacion)
        this.corpsPesos = corps
        this.corpsUnidad = corps
        this.corpsPrecio = corps
    })
  }

  getMonths () {
    this.http
    .get('https://us-central1-prime-principle-243417.cloudfunctions.net/querys?type=month')
    .subscribe(
        data => {
          this.listData = data['rows'].reduce((acum, current, index) => {
            let year = acum.findIndex(elem => elem.title == current['year'])
            let percentBefore = data['rows'][index + 1 ] 
              ? data['rows'][index + 1 ] : {year: 'last', month:'last', unidades: '0', pesos: '0'}
            
            let percent = (((Number(current.unidades) / Number(percentBefore.unidades)) * 100) - 100).toFixed(2)
            if ( year == -1 ) {
              acum.push({
                title: current.year,
                months: [{ 
                  month: this.months[Number(current.month)],
                  delta: percent,
                  down: (Number(percent) < 0),
                  unidades: current.unidades,
                  pesos: current.pesos,
                }]
              })
              if (index === 0) { acum[index].active = true }
            } else {
              acum[year].months.push({ 
                month: this.months[Number(current.month)],
                delta: percent,
                down: (Number(percent) < 0),
                unidades: current.unidades,
                pesos: current.pesos,
              })
            }
            return acum
          },[])
          console.log(this.listData)
          this.getKpiData()
    },
    error => {
        console.log('sec error', error) 
    },
    () => {
        console.log('sec on finish')
    })
  }

  getKpiData () {
    this.optionsKpi = {"grid":{"left":0,"top":0,"right":0,"bottom":80},"tooltip":{"trigger":"axis","axisPointer":{"type":"line","lineStyle":{"color":"#1a2138","width":"0"}},"textStyle":{"color":"#1a2138","fontSize":20,"fontWeight":"normal"},"position":"top","backgroundColor":"#ffffff","borderColor":"#f7f9fc","borderWidth":1,"formatter":"{c0} Unidades","extraCssText":"border-radius: 10px; padding: 8px 24px;"},"xAxis":{"type":"category","boundaryGap":true,"offset":25,"data":["1","2","3","4","5","6","7","8","9","10","11","12", ""],"axisTick":{"show":true},"axisLabel":{"color":"#8f9bb3","fontSize":18},"axisLine":{"lineStyle":{"color":"#edf1f7","width":"2"}}},"yAxis":{"boundaryGap":[0,"5%"],"axisLine":{"show":true},"axisLabel":{"show":true},"axisTick":{"show":true},"splitLine":{"show":true,"lineStyle":{"color":"#edf1f7","width":"1"}}},"series":[{"type":"line","smooth":true,"symbolSize":20,"itemStyle":{"normal":{"opacity":0},"emphasis":{"color":"#ffffff","borderColor":"#3366ff","borderWidth":2,"opacity":1}},"lineStyle":{"normal":{"width":"4","type":"solid","color":{"x":0,"y":0,"x2":0,"y2":1,"type":"linear","global":false,"colorStops":[{"offset":0,"color":"#3366ff"},{"offset":1,"color":"#3366ff"}]},"shadowColor":"rgba(0, 0, 0, 0)","shadowBlur":6,"shadowOffsetY":12}},"areaStyle":{"normal":{"color":{"x":0,"y":0,"x2":0,"y2":1,"type":"linear","global":false,"colorStops":[{"offset":0,"color":"#f7f9fc"},{"offset":1,"color":"#f7f9fc"}]}}},"data":[]},{"type":"line","smooth":true,"symbol":"none","lineStyle":{"normal":{"width":"4","type":"solid","color":{"x":0,"y":0,"x2":0,"y2":1,"type":"linear","global":false,"colorStops":[{"offset":0,"color":"#3366ff"},{"offset":1,"color":"#3366ff"}]},"shadowColor":"rgba(0, 0, 0, 0)","shadowBlur":14,"opacity":1}},"data":[]}]}
    this.optionsKpi['series'][0] = {"type": "line","smooth": true,"symbol": "none","lineStyle": {	"normal": {"width": "4","type": "solid","color": {	"x": 0,	"y": 0,	"x2": 0,	"y2": 1,	"type": "linear",	"global": false,	"colorStops": [{"offset": 0,"color": "#3366ff"	}, {"offset": 1,"color": "#e62969"	}]},"shadowColor": "rgba(0, 0, 0, 0)","shadowBlur": 14,"opacity": 1	}},"data": []	}
    this.optionsKpi['series'][1] = {"type": "line","smooth": true,"symbol": "none","lineStyle": {	"normal": {"width": "4","type": "solid","color": {	"x": 0,	"y": 0,	"x2": 0,	"y2": 1,	"type": "linear",	"global": false,	"colorStops": [{"offset": 0,"color": "#3366ff"	}, {"offset": 1,"color": "#f99e1c"	}]},"shadowColor": "rgba(0, 0, 0, 0)","shadowBlur": 14,"opacity": 1	}},"data": []	}
    this.optionsKpi['series'][2] = {"type": "line","smooth": true,"symbol": "none","lineStyle": {	"normal": {"width": "4","type": "solid","color": {	"x": 0,	"y": 0,	"x2": 0,	"y2": 1,	"type": "linear",	"global": false,	"colorStops": [{"offset": 0,"color": "#3366ff"	}, {"offset": 1,"color": "#f7f1bd"	}]},"shadowColor": "rgba(0, 0, 0, 0)","shadowBlur": 14,"opacity": 1	}},"data": []	}
    this.optionsKpi['series'][3] = {"type": "line","smooth": true,"symbol": "none","lineStyle": {	"normal": {"width": "4","type": "solid","color": {	"x": 0,	"y": 0,	"x2": 0,	"y2": 1,	"type": "linear",	"global": false,	"colorStops": [{"offset": 0,"color": "#3366ff"	}, {"offset": 1,"color": "#da1d23"	}]},"shadowColor": "rgba(0, 0, 0, 0)","shadowBlur": 14,"opacity": 1	}},"data": []	}
    this.optionsKpi['series'][4] = {"type": "line","smooth": true,"symbol": "none","lineStyle": {	"normal": {"width": "4","type": "solid","color": {	"x": 0,	"y": 0,	"x2": 0,	"y2": 1,	"type": "linear",	"global": false,	"colorStops": [{"offset": 0,"color": "#3366ff"	}, {"offset": 1,"color": "#3e0317"	}]},"shadowColor": "rgba(0, 0, 0, 0)","shadowBlur": 14,"opacity": 1	}},"data": []	}
    this.optionsKpi['series'][5] = {"type": "line","smooth": true,"symbol": "none","lineStyle": {	"normal": {"width": "4","type": "solid","color": {	"x": 0,	"y": 0,	"x2": 0,	"y2": 1,	"type": "linear",	"global": false,	"colorStops": [{"offset": 0,"color": "#3366ff"	}, {"offset": 1,"color": "#dd4c51"	}]},"shadowColor": "rgba(0, 0, 0, 0)","shadowBlur": 14,"opacity": 1	}},"data": []	}
    this.optionsKpi['series'][6] = {"type": "line","smooth": true,"symbol": "none","lineStyle": {	"normal": {"width": "4","type": "solid","color": {	"x": 0,	"y": 0,	"x2": 0,	"y2": 1,	"type": "linear",	"global": false,	"colorStops": [{"offset": 0,"color": "#3366ff"	}, {"offset": 1,"color": "#3366ff"	}]},"shadowColor": "rgba(0, 0, 0, 0)","shadowBlur": 14,"opacity": 1	}},"data": []	}
    this.optionsKpi['series'][7] = {"type": "line","smooth": true,"symbol": "none","lineStyle": {	"normal": {"width": "4","type": "solid","color": {	"x": 0,	"y": 0,	"x2": 0,	"y2": 1,	"type": "linear",	"global": false,	"colorStops": [{"offset": 0,"color": "#3366ff"	}, {"offset": 1,"color": "#ef5a78"	}]},"shadowColor": "rgba(0, 0, 0, 0)","shadowBlur": 14,"opacity": 1	}},"data": []	}    
    this.listData.forEach((element, index) => {
      element.months.forEach(inner => {
        this.optionsKpi['series'][index].data.push(inner.unidades)  
      })
    })
  }


  getModelPredict() {
    this.http
      .get('https://us-central1-prime-principle-243417.cloudfunctions.net/generic-query?type=tableLimit&table=sanfer_medicine_prediction&offset=0')
      .subscribe(
          data => {
            this.modelPredict = data['rows']
      },
      error => {
          console.log('sec error', error) 
      },
      () => {
          console.log('sec on finish')
      })
  }

  getData() {
    this.http
      .get('https://us-central1-prime-principle-243417.cloudfunctions.net/generic-query?type=table&table=cluster_disease_unit_20190201')
      .subscribe(
          data => {
            this.getChartOptions(data)
            this.getModelPredict()
      },
      error => {
          console.log('sec error', error) 
      },
      () => {
          console.log('sec on finish')
      })
    }
  getChartOptions (data) {
    this.chartOption = {
      title: {
          text: 'Ventas por unidad agrupadas por Enfermedad',
          left: 10
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
