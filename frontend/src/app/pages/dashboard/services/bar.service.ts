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
export class BarService {

  constructor(private commonService:CommonService,private http:Http) { }

  getAllTeams(){
    return this.http.get(URLS.TEAMS_URL,this.commonService.getHeaderOptions())
    .map((res:Response)=>{ return res.json()})
    .catch((err:Response)=> {return Observable.throw(err.json())});
  }

  getMatch(teamId:number){
    return this.http.get(URLS.MATCH_URL+teamId,this.commonService.getHeaderOptions())
    .map((res:Response)=>{ return res.json()})
    .catch((err:Response)=> {return Observable.throw(err.json())});
  }

  getTeamAttributes(teamId:number,year:number){
    return this.http.get(URLS.TEAM_ATTRIBUTES_URL+teamId+"/"+year,this.commonService.getHeaderOptions())
      .map((res:Response)=>{return res.json()})
      .catch((err:Response)=>{return Observable.throw(err.json())})
  }

}
