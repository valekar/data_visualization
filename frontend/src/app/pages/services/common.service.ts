import { Injectable } from '@angular/core';
import {Headers, RequestOptions, ResponseContentType } from '@angular/http';
@Injectable()
export class CommonService {

  constructor() { }


  getHeaderOptions() {
    let header = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json', 
      'Access-Control-Allow-Origin':"*"    
    });

    let options = new RequestOptions({ headers: header });
    return options;
  }

}
