import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { UploadService } from './upload.service';
import {  FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { HttpClient } from '@angular/common/http';
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";

const URL = 'http://35.238.233.15:3000/uploadfile';

@Component({
  selector: 'ngx-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  public uploader: FileUploader = new FileUploader({url: URL, itemAlias: 'file'})
  public fileToUpload: File = null
  public files: {
    bucket: String,
    contentType: String,
    name: String,
    size: String,
    timeCreated: String,
    updated: String,
    path: String
  }[];

  constructor(private service: UploadService, private http: HttpClient, private el: ElementRef) { }

  ngOnInit() {
    this.service.getListBucket()
      .subscribe(data => {
        this.files = data['objects']
        console.log(data)
      })

    this.uploader.onAfterAddingFile = (file)=> { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
        console.log("ImageUpload:uploaded:", item, status, response);
    };
  }

  handleFileInput(files: FileList) {
    console.log(files)
    this.fileToUpload = files.item(0)
  }

  updateList () {
    this.service.getListBucket()
    .subscribe(data => {
      this.files = data['objects']
      console.log(data)
    })
  }

  change(event) {
    let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#photo');
    this.fileToUpload = inputEl.files.item(0)
  }

  upload() {
    let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#photo');
    let fileCount: number = inputEl.files.length;
    let formData = new FormData();

    if (fileCount > 0) {
      this.fileToUpload = inputEl.files.item(0)
      formData.append('file', inputEl.files.item(0));
      this.http
        .post(URL, formData).map((res:Response) => res).subscribe(
          (success) => {
          this.updateList()
          alert('upload compleate')
        },
        (error) => alert(error))
    }
  }
}
