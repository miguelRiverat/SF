import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JobsService {

  constructor(private http: HttpClient) { }
  url = 'https://us-central1-prime-principle-243417.cloudfunctions.net/listJobs';
  getListJobs() {
    return this
      .http
      .get(`${this.url}`);
  }
}
