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
  @Output() corpsOut = new EventEmitter<string>();

  @Input() periodIn: string = 'year';
  @Input() typeIn: string = 'cantidad';
  @Input() corpsIn = 'SANFER CORP.';

  public corps = [];
  public productDist: string[];
  public all: string[];

  public productsUrl = 'https://us-central1-prime-principle-243417.cloudfunctions.net/alerts'
  public deatil = (from, to, subs, clas, list) => `https://us-central1-prime-principle-243417.cloudfunctions.net/alerts?detail=true&from=${from}&to=${to}&subs=${subs}&clas=${clas}&list=${list}`
  public corpUrl = `https://us-central1-prime-principle-243417.cloudfunctions.net/generic-query?type=corp`

  public prodModel : {
    tendencia: string,
    corporacion: string,
    producto: string,
    presentacion: string,
    moleculan1:  string,
    claseterapeutica: string,
    fecini: String,
    fecend: String,
    tipo: string,
    fechalanzamiento: string,
    detalleid: string
  }[] = [{
    tendencia: '',
    corporacion: '',
    producto: '',
    presentacion: '',
    moleculan1:  '',
    claseterapeutica: '',
    fecini: '',
    fecend: '',
    tipo: '',
    fechalanzamiento: '',
    detalleid: ''
  }]

  public alertTen = ''
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
        text: '',
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
        end: 100
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
  public loadingOpts = {
    text: 'loading',
    color: '#ffffff',
    textColor: '#000',
    maskColor: 'rgba(255, 255, 255, 0.8)',
    zlevel: 0
  }

  public modelDetail :{
    tendencia: string,
    corporacion: string,
    producto: string,
    presentacion: string,
    moleculan1: string,
    fecini: string,
    fecend: string,
    fechalanzamiento: string   
  }[];


  constructor(private http: HttpClient) {
    this.listProducts(this.corpsIn)
    //this.getCorps()
  }

  getDetail (json) {

    let from = json['fecini']['value']
    let to = json['fecend']['value']
    let subs = json['moleculan1']
    let clas = json['claseterapeutica']
    this.alertTen = json['tendencia']

    this.showLine = false
    return this.http
    .get(this.deatil(encodeURI(from), encodeURI(to), encodeURI(subs), encodeURI(clas), false))
    .subscribe(data => {
        this.modelDetail = data['results']
        let all = []
        this.productDist = this.modelDetail
          .filter(ele => {
            if (!all.includes(ele.presentacion)) { 
              all.push(ele.presentacion) 
              return true
            }
            return false
          })
          .map(ele => ele.presentacion)
        
        return this.http
        .get(this.deatil(encodeURI(from), encodeURI(to), encodeURI(subs), encodeURI(clas), true))
        .subscribe(data => {
            console.log(data)
        })

        /*data['rows'].forEach(element => {
          this.chartOption['series'][0]['data'].push(`${element.mthunidades}`) 
          this.chartOption['xAxis']['data'].push(`${element.year}-${element.month}-01`)
        })*/
        this.showLine = true
    })
  }

  getCorps () {
    this.showLine = false
    return this.http
    .get(this.corpUrl)
    .subscribe(data => {
        this.corps = data['rows'].map(element => element.corporacion)
    })
  }

  changeLab(lab){
    this.listProducts(lab)
  }

  listProducts (lab) {
    return this.http
      .get(`${this.productsUrl}`)
      .subscribe(data => {
        this.prodModel = data['results']
      })
  }
}
