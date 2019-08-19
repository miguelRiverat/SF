import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'ngx-generate',
  templateUrl: './generate.component.html',
  styleUrls: ['./generate.component.scss']
})
export class GenerateComponent {

  public url = 'https://us-central1-prime-principle-243417.cloudfunctions.net/products';
  dates: string[] = ['2019-04', '2019-03', '2019-02', '2019-01', '2018-12', '2018-11', '2018-10', '2018-09', '2018-08', '2018-07'];
  moleculas: string[] = ['ZORRITONE JBE 120 ML'];
  public loading_1 = false;
  public loading_2 = false;
  public loading_3 = false;
  public tableNameDise = date => `cluster_disease_unit_${date.replace(/-/g,'')}`
  public tableNameProd = date => `cluster_prod_unit_${date.replace(/-/g,'')}`
  public tableNameUnid = date => `cluster_corp_molec_${date.replace(/-/g,'')}`
  public alertType = ''

  public modelProd : {
    CENTROID_ID: string,
    corporacion: string,
    venta: Number,
  }[]
  
  public modelCorp : {
    CENTROID_ID: string,
    corporacion: string,
    venta: Number,
  }[]

  public modelDisease : {
    Grupo: string,
    enfermedad: string,
    venta: Number,
  }[]

  @Output() moleculaOut = new EventEmitter<string>();
  @Output() dateOut = new EventEmitter<string>();
  @Output() prodventaDatesOut = new EventEmitter<string>();
  @Output() enfermOut = new EventEmitter<string>();

  @Input() moleculasIn: string = 'ZORRITONE JBE 120 ML';
  @Input() datesIn: string = '2019-04';
  @Input() prodventaDatesIn: string = '2019-04';
  @Input() enfermIn: string = '2019-04';

  constructor(private http: HttpClient) {
    this.getMoleculas()
  }

  ngOnInit() {
  }

  getMoleculas() {
    this.http.get(this.url)
      .subscribe(data => {
        data['results'].map(producto => {
          producto.forms.forEach(pro => {
            this.moleculas.push(pro.name)
          })
        })
    })
  }

  changeDate (date) {
    this.datesIn = date
  }
  changeMolecula (molecula) {
    this.moleculasIn = molecula
  }

  changeDateProdVenta (date) {
    this.prodventaDatesIn = date;
  }
  
  changeEnferm (date) {
    this.enfermIn = date;
  }

  generate(type, date, molecula = undefined) {
    let url = ''
    let body = {}
    let dateN = `${date}-01`
    let getTable = `https://us-central1-prime-principle-243417.cloudfunctions.net/generic-query?type=table&table=`
    let tableType = ''
    if (type == 'agrupacion_venta_molecula') {
      url = 'https://us-central1-prime-principle-243417.cloudfunctions.net/predictions-kmeans?all=true'
      body = {
        "date" : dateN,
        "molecula": molecula
      }
      tableType = 'unit'
      getTable += this.tableNameUnid(dateN)
      this.loading_1 = true
    } else if (type == 'agrupacion_prod_venta' ) {
      url = 'https://us-central1-prime-principle-243417.cloudfunctions.net/cluster-prod-venta-general'
      body = {
        "date" : dateN
      }
      tableType = 'prod'
      getTable += this.tableNameProd(dateN)
      this.loading_2 = true
    } else if (type == 'agrupacion_prod_enfermedad' ) { 
      url = 'https://us-central1-prime-principle-243417.cloudfunctions.net/cluster-enfermedad-producto'
      body = {
        "date" : dateN
      }
      tableType = 'desea'
      getTable += this.tableNameDise(dateN)
      this.loading_3 = true
    }
    return this.http
      .post(url, body)
      .subscribe(
        success => {
          console.log('first success',success)
          this.loading_1 = false
          this.loading_2 = false
          this.loading_3 = false
          this.alertType = 'success' 
/*
          this.http
            .get(getTable)
            .subscribe(
              data => {
                console.log('success dos', data)
                if (tableType == 'desea') {
                  this.modelDisease = data['row']
                  console.log('desea')
                } else if (tableType == 'prod'){
                  this.modelProd = data['row']
                  console.log('prod')
                } else if (tableType == 'unit'){
                  this.modelCorp = data['row']
                  console.log('unit')
                } else {
                  alert('Error al obtener Datos')
                }
                console.log('CORP', this.modelCorp)
                console.log('DEs', this.modelDisease)
                console.log('PROD', this.modelProd)
            },
            error => {
              console.log('sec error', error)
              this.loading = false
            },
            () => {
              console.log('sec on finish')
              this.loading = false
            }

          )
*/


        },
        error => {
          console.log('first error', error)

          if (error.error.message.includes('For Kmeans to be meaningful')) {
            this.alertType = 'warn_need_data'
          } else if (error.error.message.includes('Already Exists')) {
            this.alertType = 'info'
          } else {
            this.alertType = 'danger'
          }
          this.loading_1 = false
          this.loading_2 = false
          this.loading_3 = false
        },
        () => {
          console.log('on finish')
          this.loading_1 = false
          this.loading_2 = false
          this.loading_3 = false
        }
      )
  }


  


}