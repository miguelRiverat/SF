import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'ngx-prediction',
  styleUrls: ['./prediction.component.scss'],
  templateUrl: './prediction.component.html',
})
export class PredictionComponent {

  @Output() periodChange = new EventEmitter<string>();
  @Output() typeChange = new EventEmitter<string>();

  @Input() periodIn: string = 'year';
  @Input() typeIn: string = 'cantidad';

  public productsUrl = 'https://us-central1-prime-principle-243417.cloudfunctions.net/products'
  public predictUrl = 'https://us-central1-prime-principle-243417.cloudfunctions.net/predictions'

  public predictionModel : {
    producto: string,
    presentacion: string,
    genero:  string,
    molecula: string,
    prediction: string
  }[]


  constructor(private http: HttpClient) {
    this.listProducts()
  }

  generatePredict (product, form, type, index) {
    console.log(product, form, type, index)
    let body = {
      "prod" : product,
      "form" : form,
      "date" : "2019-02-01",
      "type" : type
    }
    return this.http
      .post(this.predictUrl, body)
      .subscribe(data => {
        console.log(data[0].predicted_mthunidades)
        this.predictionModel[index].prediction = data[0].predicted_mthunidades
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
