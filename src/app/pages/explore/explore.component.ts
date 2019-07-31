import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EChartOption } from 'echarts';

@Component({
  selector: 'ngx-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss']
})
export class ExploreComponent {
  options : any ;

  @Output() periodChange = new EventEmitter<string>();
  @Output() typeChange = new EventEmitter<string>();

  @Input() periodIn: string = 'year';
  @Input() typeIn: string = 'cantidad';

  public productsUrl = 'https://us-central1-prime-principle-243417.cloudfunctions.net/products'
  public deatil = form => `https://us-central1-prime-principle-243417.cloudfunctions.net/generic-query?type=explore&form=${form}`

  public predictionModel : {
    producto: string,
    presentacion: string,
    genero:  string,
    molecula: string,
    prediction: string
  }[]

  public showLine = false
  public chartOption: EChartOption = {
    tooltip: {
        trigger: 'axis',
        position: function (pt) {
            return [pt[0], '10%'];
        }
    },
    title: {
        left: 'center',
        text: 'Historico',
    },
    toolbox: {
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: []
    },
    yAxis: {
        type: 'value',
        boundaryGap: [0, '100%']
    },
    dataZoom: [{
        type: 'inside',
        start: 0,
        end: 10
    }, {
        start: 0,
        end: 10,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
        }
    }],
    series: [
        {
            name:'Unidades',
            type:'line',
            smooth:true,
            symbol: 'none',
            sampling: 'average',
            itemStyle: {
                color: 'rgb(153, 204, 255)'
            },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgb(230, 242, 255)'
                }, {
                    offset: 1,
                    color: 'rgb(153, 204, 255)'
                }])
            },
            data: []
        }
    ]
};


  /*public chartOption: EChartOption = {
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
}*/

  public loadingOpts = {
    text: 'loading',
    color: '#ffffff',
    textColor: '#000',
    maskColor: 'rgba(255, 255, 255, 0.8)',
    zlevel: 0
  }

  public modelDetail :{
    corporacion: String,
    producto: String,
    presentacion: String,
    year: Number,
    month: Number,
    mthprecio: Number,
    mthunidade: Number
  }[];


  constructor(private http: HttpClient) {
    this.listProducts()
  }

  getDetail (form) {
    this.showLine = false
    return this.http
    .get(this.deatil(encodeURI(form)))
    .subscribe(data => {
        this.modelDetail = data['rows']
        data['rows'].forEach(element => {
          this.chartOption['series'][0]['data'].push(`${element.mthunidades}`) 
          this.chartOption['xAxis']['data'].push(`${element.year}-${element.month}-01`)
        })
        this.showLine = true
    })
  }

  listProducts () {
    return this.http
      .get(this.productsUrl)
      .subscribe(data => {
        this.predictionModel = data['results'].reduce((acum, elem) => {
          return acum.concat(elem.forms.map(form => ({
            producto: elem.producto,
            presentacion: form.name,
            genero:  form.genero,
            molecula: form.molecula,
            prediction: ''
          })))
        },[])
      })
  }
}
