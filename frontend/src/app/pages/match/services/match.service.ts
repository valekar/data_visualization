import { Injectable } from '@angular/core';

import {CommonService} from '../../services/common.service';
import {URLS} from '../../models/URLS';
import 'rxjs';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MatchService {

  constructor(private commonService:CommonService,private http:Http) { }

  getGeoJSON(){
    return this.http.get(URLS.GET_GEO_JSON_URL,this.commonService.getHeaderOptions())
      .map((res:Response)=> {return res.json()})
      .catch((err:Response)=> {return Observable.throw(err.json())});
  }

  getCountryMatches(){
    return this.http.get(URLS.GET_COUNTRY_MATCHES_URL,this.commonService.getHeaderOptions())
    .map((res:Response)=> {return res.json()})
    .catch((err:Response)=> {return Observable.throw(err.json())})
  }

}
