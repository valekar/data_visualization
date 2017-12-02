import { Component, OnInit, ElementRef, ViewChildren, Renderer2, AfterViewInit, QueryList, ViewChild } from '@angular/core';
import { BarService } from '../../services/bar.service';
import { Team, TeamData, Match, MatchData, TeamAttributes, TeamAttributesData } from '../../../models/Soccer';
import * as d3 from 'd3/index';
import { Element } from '@angular/compiler';
import { ElementDef } from '@angular/core/src/view';
import { Selection } from 'd3-selection';
import { Router } from '@angular/router';

@Component({
  selector: 'bar-graph',
  templateUrl: './bar-graph.component.html',
  styleUrls: ['./bar-graph.component.scss'],
  providers: [BarService]
})
export class BarGraphComponent implements OnInit {


  teamList: Array<Team>;
  selectedTeamId: number = -1;
  matches: Array<Match>;
  host: any;
  svg: any;
  @ViewChild('myBarGraph') myBarGraph: ElementRef;


  //spider chart
  toggleSpiderChart: boolean = false;
  teamAttribute: TeamAttributes = null;
  toggleNoData: boolean = false;
  constructor(private barService: BarService, private renderer: Renderer2, private router: Router) {

  }

  ngOnInit() {
    this.barService.getAllTeams().subscribe((res: TeamData) => {
      this.teamList = res.data;
    });
  }

  teamSelection() {
    this.toggleSpiderChart = false;
    this.toggleNoData = false;

    this.barService.getMatch(this.selectedTeamId).subscribe((res: MatchData) => {
      //console.log(res);
      this.matches = res.data;
      this.host = d3.select(this.myBarGraph.nativeElement);
      //console.log(this.renderer.parentNode);
      this.buildstackedBar(this.matches);
    });
  }

  buildstackedBar(matches: any): void {
    //    //this.host.html('');
    //  // console.log(this.host);
    //   this.svg = this.renderer.createElement('svg');
    //   this.renderer.setAttribute(this.svg,'xmlns',"http://www.w3.org/1999/xlink");
    //   this.renderer.setAttribute(this.svg,'width','600');
    //   this.renderer.setAttribute(this.svg,'height','400');
    //   this.renderer.setAttribute(this.svg,'background-color','blue');
    //   this.renderer.appendChild(this.host,this.svg);

    let margin = { top: 80, right: 20, bottom: 20, left: 40 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    this.host.html('');
    this.svg = this.host.append('svg')
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
      "translate(" + margin.left + "," + (margin.top - 20) + ")");

    let matchesLength = matches.length;

    if (matchesLength == 1) {
      width = width / 7;
    }
    else if (matchesLength == 2) {
      width = width / 4;
    }
    else if (matchesLength == 3) {
      width = width / 3;
    }
    else if (matchesLength == 4) {
      width = width / 3;
    }
    else if (matchesLength == 5) {
      width = width / 2;
    }
    else if (matchesLength == 6) {
      width = width / 2;
    }
    else if (matchesLength == 7) {
      width = width / 1;
    }


    let keys = ['win', 'draw', 'loss'];

    let color = d3.scaleOrdinal(d3.schemeCategory20);
    let stack = d3.stack()
      .keys(keys)
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);

    let layers = stack(<any>matches);
    //console.log(layers);
    matches.sort(function (a, b) { return b.total - a.total; });

    // set the ranges
    let x = d3.scaleBand().range([0, width]).padding(0.1);
    let y = d3.scaleLinear().range([height, 0]);

    // Scale the range of the data in the domains
    x.domain(matches.map((d) => { return d.season; }));
    y.domain([0, d3.max(layers[layers.length - 1], function (d) { return d[0] + d[1]; })]).nice();

    var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    let layer = this.svg.selectAll(".layer")
      .data(layers)
      .enter().append("g")
      .attr("class", "layer")
      .style("fill", function (d, i) { return color(i); });

    let rect = layer.selectAll("rect")
      .data(function (d) { return d; })
      .enter().append("rect")
      .attr("x", (d) => { return x(d.data.season); })
      .attr("y", function (d) { return y(d[1]); })
      .attr("height", function (d) { return 0; })
      .attr("width", x.bandwidth())
      .on('mouseover', function (d) {
        div.transition()
          .duration(200)
          .style("opacity", .9);
        div.html(`<div style="color:white;background-color:black;"> 
                  Season : ${d.data.season}<br>
                  Total Wins : ${d.data.win}<br> 
                  Total Losses: ${d.data.loss} <br> 
                  Total Draws: ${d.data.draw}</div>`)
          .style("left", (d3.event.pageX + 100) + "px")
          .style("top", (d3.event.pageY + 50) + "px");
      }).on("mouseout", function (d) {
        div.transition()
          .duration(0)
          .style("opacity", 0);
      })
      .on('click', (d) => {
        div.transition()
          .duration(0)
          .style("opacity", 0);
        //console.log(d);
        let year = d.data.season.match(/\/(.*)/);
        //console.log(year[1]);

        //this.seeTeamAttributes(year[1]);
        this.barService.getTeamAttributes(this.selectedTeamId, year[1]).subscribe((res: TeamAttributesData) => {
          if (res.data.length > 0) {
            this.teamAttribute = res.data[0];
            this.toggleNoData = false;
            this.toggleSpiderChart = true;
          }
          else {
            this.toggleSpiderChart = false;
            this.toggleNoData = true;
          }

        });
      }).transition()
			.duration(200)
			.delay(function (d, i) {
				return i * 50;
			})
			.attr("x", (d) => { return x(d.data.season); })
      .attr("y", function (d) { return y(d[1]); })
      .attr("height", function (d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth())


    layer.selectAll("text").data(function (d) { return d }).enter().append("text")
      //.text(function (d) { return d3.format(".3s")(((d[1] - d[0])/+d.data.total_matches)*100) + "%"; })
      .text(function (d) { return d3.format(".3s")(((d[1] - d[0]) / +d.data.total_matches) * 100) + "%"; })
      .attr("y", function (d) { return y(d[1]) + (y(d[0]) - y(d[1])) / 2; })
      .attr("x", function (d) { return x(d.data.season) + x.bandwidth() / 4 })
      .style("fill", '#ffffff');


    // add the x Axis
    this.svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // add the y Axis
    this.svg.append("g")
      .call(d3.axisLeft(y));

    this.svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2) - 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Total Matches");

    this.svg.append("text")
      .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
      .attr("transform", "translate(" + (width / 2) + "," + ((height) + margin.top / 2) + ")")  // centre below axis
      .text("Years");


    var legendRectSize = 18;
    var legendSpacing = 4;

    let legend = this.svg.selectAll('.legend').data(color.domain()).enter().append('g')
      .attr('class', 'legend')
      .attr('transform', function (d, i) {
        var height = legendRectSize + legendSpacing;
        var offset = height * color.domain().length / 2;
        var horz = 10 * legendRectSize;
        var vert = i * height;
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
      .text(function (d) { return keys[d]; });
  }


}
