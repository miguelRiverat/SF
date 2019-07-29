import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'ngx-earning-card',
  styleUrls: ['./earning-card.component.scss'],
  templateUrl: './earning-card.component.html',
})
export class EarningCardComponent {

  public url = 'https://us-central1-prime-principle-243417.cloudfunctions.net/products';
  dates: string[] = ['2019-04', '2019-03', '2019-02', '2019-01'];
  moleculas: string[] = ['ZORRITONE JBE 120 ML'];

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

  getMoleculas() {
    this.http.get(this.url)
      .subscribe(data => {
        this.moleculas = data['results'].map(producto => producto.forms[0].molecula)
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

  generate(type, date, molecula) {
    let url = ''
    let body = {}
    if (type == 'agrupacion_venta_molecula') {
      url = 'https://us-central1-prime-principle-243417.cloudfunctions.net/predictions-kmeans'
      body = {
        "date" : `${date}-01`,
        "molecula": molecula
      }
    } else if (type == 'agrupacion_prod_venta' ) {
      url = 'https://us-central1-prime-principle-243417.cloudfunctions.net/cluster-prod-venta-general'
      body = {
        "date" : `${date}-01`
      }
    } else if (type == 'agrupacion_prod_enfermedad' ) { 
      url = 'https://us-central1-prime-principle-243417.cloudfunctions.net/cluster-enfermedad-producto'
      body = {
        "date" : `${date}-01`
      }
    }

    console.log(url, body)

    return this.http
      .post(url, body)
      .subscribe(data => {
        console.log('generate OK', data)
      })
  }
}
