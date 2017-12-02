import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {BarService} from '../../services/bar.service';
import {TeamAttributesData} from '../../../models/Soccer';
@Component({
  selector: 'app-team-attributes',
  templateUrl: './team-attributes.component.html',
  styleUrls: ['./team-attributes.component.scss'],
  providers: [BarService]
})
export class TeamAttributesComponent implements OnInit {

  spiderData: TeamAttributesData;
  constructor(private activatedRoute: ActivatedRoute,private barService:BarService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((urlsParams: { id: number,year:number }) => {
      //console.log(urlsParams.id);
      this.barService.getTeamAttributes(urlsParams.id,urlsParams.year).subscribe((res:TeamAttributesData)=>{
         this.spiderData = res; 
         //console.log(res);
      },
      (err)=>{
        console.log(err);
      });
    });

  }

}
