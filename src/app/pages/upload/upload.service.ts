import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  constructor(private http: HttpClient) { }
    url = 'https://us-central1-prime-principle-243417.cloudfunctions.net/list-objects';
    getListBucket() {
      return this
              .http
              .get(`${this.url}`);
    }

  postFile(fileToUpload: File): any {
    const endpoint = 'http://35.188.82.218:3000/uploadfile';
    //const endpoint = 'http://localhost:3000/uploadfile';
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    return this.http
      .post(endpoint, formData, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }})
      .pipe(
        timeout(600000),
        catchError(e => {
          console.log('timeout')
          // do something on a timeout
          return of(null);
        })
      )
  } 
}
