import { Directive, Input, OnChanges } from '@angular/core';
import { GeoData, Geo, Feature, Geometry, CountryMatches } from '../../models/Soccer';
import * as d3 from 'd3/index';
import * as d3Colors from 'd3-scale-chromatic/index';

@Directive({
  selector: '[map-chart]'
})
export class MapChartDirective implements OnChanges {
  host: any;
  @Input('mapData') mapData: Geo = null;
  @Input('countryMatches') countryMatches: Array<CountryMatches> = null;
  constructor() { }

  ngOnChanges(): void {
    if (this.mapData != null && this.countryMatches != null) {
      this.buildMap(this.mapData, this.countryMatches);
    }

  }


  buildMap(mapData: Geo, countryMatches: Array<CountryMatches>) {
    //console.log(countryMatches);
    this.host = d3.select("#mapId");

    let keys = countryMatches.map(function (d) { return <any>d.total_matches });
    console.log(keys);
    let color = d3.scaleOrdinal()
      .domain(keys)
      .range(countryMatches.map(function (d, i) { return "hsl(210, 100%, " + (95 - i * 5) + "%)" }));

    let margin = { top: 80, right: 20, bottom: 20, left: 40 },
      width = 960 - margin.left - margin.right,
      height = 1200 - margin.top - margin.bottom;

    this.host.html('');
    let svg = this.host.append('svg')
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    let div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    let group = svg.selectAll('g')
      .data(mapData.features)
      .enter()
      .append("g")

    let projection = d3.geoMercator().scale(650).translate([width / 2, height + 200]);
    //.scale(width / 2 / Math.PI)
    //.scale(width)
    //.translate([width/2 , height/2 ]);

    let path = d3.geoPath().projection(projection);

    let areas = group.append("path")
      .attr("d", path)
      .attr("class", "area")
      .attr('fill', 'white')
      .attr("fill", (d) => {
        let currentColor = null;
        for (let countryMatch of countryMatches) {
          if (countryMatch.name == d.properties.name) {
            currentColor = color(<any>countryMatch.total_matches);
            return currentColor;
          }
          else if (countryMatch.name.toLowerCase() == 'england'.toLowerCase()
            && d.properties.name.toLowerCase() == 'united kingdom'.toLowerCase()) {
            currentColor = color(<any>countryMatch.total_matches);
            return currentColor;
          }
        }
        return 'white';
      })
      .attr('background-color', 'white')
      .attr('stroke', 'black')
      .call(d3.zoom().on("zoom", function () {
        svg.attr("transform", d3.event.transform)
      }));

    group.on("mouseover", function (d) {
      let customHtml = `<div style="background-color:black;color:white;">${d.properties.name}</div>`;
      for (let countryMatch of countryMatches) {
        if (countryMatch.name == d.properties.name) {
          customHtml = `<div style="background-color:black;color:white;padding:10px;">
                        Country :${countryMatch.name}<br>
                        Total Matches : ${countryMatch.total_matches}<br>
                        League Name : ${countryMatch.league_name}<br>
                        </div>`;
        }
        else if (countryMatch.name.toLowerCase() == 'england'.toLowerCase()
          && d.properties.name.toLowerCase() == 'united kingdom'.toLowerCase()) {
            customHtml = `<div style="color:white;background-color:black;padding:10px;">
            Country :${countryMatch.name}<br>
            Total Matches : ${countryMatch.total_matches}<br>
            League Name : ${countryMatch.league_name}<br>
            </div>`;
        }

      }
      div.transition()
        .duration(200)
        .style("opacity", .9);
      div.html(customHtml)
        .style("left", (d3.event.pageX + 10) + "px")
        .style("top", (d3.event.pageY + 10) + "px");
    });

    group.on("mouseout", function (d) {
      div.transition()
        .duration(0)
        .style("opacity", 0);
    })  

    var legendRectSize = 18;
    var legendSpacing = 4;

    let legend = svg.selectAll('.legend').data(color.domain()).enter().append('g')
      .attr('class', 'legend')
      .attr('transform', function (d, i) {
        var height = legendRectSize + legendSpacing;
        var offset = height * color.domain().length / 2;
        var horz =   legendRectSize;
        var vert = i * height+400;
        return 'translate(' + horz + ',' + vert + ')';
      });


    legend.append('rect')
      .attr('width', legendRectSize)
      .attr('height', legendRectSize)
      .style('fill', color)
      .style('stroke', color);

    legend.append('text')
      .attr('x', legendRectSize + legendSpacing)
      .attr('y', legendRectSize - legendSpacing)
      .text(function (d,i) { return `${d} Matches Played`; });

  }
}
