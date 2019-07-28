import { Component, OnInit } from '@angular/core';
import { JobsService } from './jobs.service';

const URL = 'http://localhost:3000/flows';

@Component({
  selector: 'ngx-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {

  public flows : {
    id: String,
    name: String,
    startTime: Date,
    currentStateTime: Date,
    currentState: String
  }[]

  constructor(private service: JobsService) { }

  ngOnInit() {
    this.service.getListJobs()
      .subscribe(data => {
        this.flows = data['data']['jobs']
        console.log(data)
      })
  }
}
