import { Component, OnInit } from '@angular/core';
import { MatchService } from './services/match.service';
import { GeoData, Geo, Feature, Geometry, CountryMatches, CountryMatchesData } from '../models/Soccer';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss'],
  providers: [MatchService]
})
export class MatchComponent implements OnInit {

  geoData: Geo;
  countryMatches: Array<CountryMatches>;
  constructor(private matchService: MatchService) { }

  ngOnInit() {
    this.matchService.getGeoJSON().subscribe((res: GeoData) => {
      //console.log(res.data);
      let geoData = res.data[0];
      this.matchService.getCountryMatches().subscribe((res: CountryMatchesData) => {
        this.countryMatches = res.data;
        this.geoData = geoData;
      });
    });
  }

}
