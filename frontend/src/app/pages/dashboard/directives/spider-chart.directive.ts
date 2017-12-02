import { Directive, OnChanges, Input } from '@angular/core';
import { TeamAttributesData, TeamAttributes } from '../../models/Soccer';
import * as d3 from 'd3/index';
@Directive({
  selector: '[spider-chart]'
})
export class SpiderChartDirective implements OnChanges {

  svg: any;
  host: any;
  @Input('spiderData') teamAttributeData: TeamAttributes;
  @Input('index') i: number;
  constructor() { }

  ngOnChanges() {
    if (this.teamAttributeData != null) {
      //console.log('#'+'spiderGraphId_'+this.i);
      this.host = d3.select('#spiderGraphId');
      this.spiderSvg(this.teamAttributeData);
    }
  }

  spiderSvg(teamData: TeamAttributes) {
    let data: TeamAttributes = teamData;

    let margin = { top: 80, right: 20, bottom: 20, left: 40 },
      width = 400,
      height = 400;


    let cfg = {
      radius: 5,
      w: width,
      h: height,
      factor: 1,
      factorLegend: .85,
      levels: 5,//3
      maxValue: 100,//0
      radians: 2 * Math.PI,
      opacityArea: 0.5,
      ToRight: 5,
      TranslateX: 100,
      TranslateY: 30,
      ExtraWidthX: 300,//100,
      ExtraWidthY: 100,
      color: d3.scaleOrdinal().range(["steelblue", "#4D6A83"])
    };
    let intermediaryData: Array<number> = [];

    var allAxis = [];
    Object.keys(data).forEach(function (k: string) {
      //console.log(k);
      if (!(k == "team_api_id" || k == "date")) {
        if (k == 'buildUpPlayPassing') {
          allAxis.push('Build Up Play Speed');
        }
        else if (k == 'buildUpPlaySpeed') {
          allAxis.push('Build-up Play Passing');
        }
        else if (k == 'chanceCreationCrossing') {
          allAxis.push('Chance Creation Passing');
        }
        else if (k == 'chanceCreationPassing') {
          allAxis.push('Chance Creation Crossing');
        }
        else if (k == 'chanceCreationShooting') {
          allAxis.push('Chance Creation Shooting');
        }
        else if (k == 'defenceAggression') {
          allAxis.push('Defence Aggression');
        }
        else if (k == 'defencePressure') {
          allAxis.push('Defence Pressure');
        }
        else if (k == 'defenceTeamWidth') {
          allAxis.push('Defence Team Width');
        }
      }
    });
    //console.log(allAxis);
    var total = allAxis.length;
    var radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2);
    var Format = d3.format('%');
    //this.host.select("svg").remove();

    //build svg
    this.host.html('');
    var g = this.host.append('svg')
      .attr("width", cfg.w + cfg.ExtraWidthX)
      .attr("height", cfg.h + cfg.ExtraWidthY)
      .append("g")
      .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");

    //Circular segments
    for (var j = 0; j < cfg.levels; j++) {
      var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
      g.selectAll(".levels")
        .data(allAxis)
        .enter()
        .append("svg:line")
        .attr("x1", function (d, i) { return levelFactor * (1 - cfg.factor * Math.sin(i * cfg.radians / total)); })
        .attr("y1", function (d, i) { return levelFactor * (1 - cfg.factor * Math.cos(i * cfg.radians / total)); })
        .attr("x2", function (d, i) { return levelFactor * (1 - cfg.factor * Math.sin((i + 1) * cfg.radians / total)); })
        .attr("y2", function (d, i) { return levelFactor * (1 - cfg.factor * Math.cos((i + 1) * cfg.radians / total)); })
        .attr("class", "line")
        .style("stroke", "steelblue")
        .style("stroke-opacity", "0.75")
        .style("stroke-width", "0.3px")
        .attr("transform", "translate(" + (cfg.w / 2 - levelFactor) + ", " + (cfg.h / 2 - levelFactor) + ")");
    }

    //Text indicating at what % each level is
    for (var j = 0; j < cfg.levels; j++) {
      var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
      g.selectAll(".levels")
        .data([1]) //dummy data
        .enter()
        .append("svg:text")
        .attr("x", function (d) { return levelFactor * (1 - cfg.factor * Math.sin(0)); })
        .attr("y", function (d) { return levelFactor * (1 - cfg.factor * Math.cos(0)); })
        .attr("class", "legend")
        .style("font-family", "sans-serif")
        .style("font-size", "10px")
        .attr("transform", "translate(" + (cfg.w / 2 - levelFactor + cfg.ToRight) + ", " + (cfg.h / 2 - levelFactor) + ")")
        .attr("fill", "#737373")
        .text((j + 1) * 100 / cfg.levels);
    }

    var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    var series = 0;
    var axis = g.selectAll(".axis")
      .data(allAxis)
      .enter()
      .append("g")
      .attr("class", "axis");


    axis.append("line")
      .attr("x1", cfg.w / 2)
      .attr("y1", cfg.h / 2)
      .attr("x2", function (d, i) { return cfg.w / 2 * (1 - cfg.factor * Math.sin(i * cfg.radians / total)); })
      .attr("y2", function (d, i) { return cfg.h / 2 * (1 - cfg.factor * Math.cos(i * cfg.radians / total)); })
      .attr("class", "line")
      .style("stroke", "grey")
      .style("stroke-width", "1px");
      


    axis.append("text")
      .attr("class", "legend")
      .text(function (d) { return d })
      .style("font-family", "sans-serif")
      .style("font-size", "11px")
      .attr("text-anchor", "middle")
      .attr("dy", "1.5em")
      .attr("transform", function (d, i) { return "translate(0, -10)" })
      .attr("x", function (d, i) { return cfg.w / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) - 60 * Math.sin(i * cfg.radians / total); })
      .attr("y", function (d, i) { return cfg.h / 2 * (1 - Math.cos(i * cfg.radians / total)) - 20 * Math.cos(i * cfg.radians / total); });



    intermediaryData.push(+data.buildUpPlayPassing);
    intermediaryData.push(+data.buildUpPlaySpeed);
    intermediaryData.push(+data.chanceCreationCrossing);
    intermediaryData.push(+data.chanceCreationPassing);
    intermediaryData.push(+data.chanceCreationShooting);
    intermediaryData.push(+data.defenceAggression);
    intermediaryData.push(+data.defencePressure);
    intermediaryData.push(+data.defenceTeamWidth);

    let dataValues = [];
    g.selectAll(".nodes")
      .data(intermediaryData, function (j, i) {
        dataValues.push([
          cfg.w / 2 * (1 - (parseFloat(Math.max(j, 0) + "") / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
          cfg.h / 2 * (1 - (parseFloat(Math.max(j, 0) + "") / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
        ]);
      });
    dataValues.push(dataValues[0]);
    g.selectAll(".area")
      .data([dataValues])
      .enter()
      .append("polygon")
      .attr("class", "radar-chart-serie" + series)
      .style("stroke-width", "2px")
      .style("stroke", "")
      .attr("points", function (d) {
        var str = "";
        for (var pti = 0; pti < d.length; pti++) {
          str = str + d[pti][0] + "," + d[pti][1] + " ";
        }
        return str;
      })
      .style("fill", function (j, i) { return 0 })
      .style("fill-opacity", "")
      .transition()
			.duration(200)
			.delay(function (d, i) {
				return i * 50;
      })
      .style("stroke", cfg.color(series + ""))
      .style("fill", function (j, i) { return cfg.color(series + "") })
      .style("fill-opacity", cfg.opacityArea);

      g.on('mouseover', function (d) {
        let z = "polygon." + d3.select(this).attr("class");
        g.selectAll("polygon")
          .transition(200)
          .style("fill-opacity", 0.1);
        g.selectAll(z)
          .transition(200)
          .style("fill-opacity", .7);

        div.transition()
          .duration(200)
          .style("opacity", .9);
        div.html(`<div style="color:white;background-color:black;padding:10px;"> 
                  Build Up Play Passing : ${data.buildUpPlayPassing}% <br>
                  Build Up Play Speed : ${data.buildUpPlaySpeed}%<br>
                  Chance Creation Crossing : ${data.chanceCreationCrossing}%<br>
                  Chance Creation Passing : ${data.chanceCreationPassing}%<br>
                  Chance Creation Shooting : ${data.chanceCreationShooting}%<br>
                  Defense Aggression : ${data.defenceAggression}%<br>
                  Defense Pressure : ${data.defencePressure}%<br>
                  Defense Team Width : ${data.defenceTeamWidth}%<br>`)

          .style("left", (d3.event.pageX + 10) + "px")
          .style("top", (d3.event.pageY + 10) + "px");

      })
      .on('mouseout', function () {
        g.selectAll("polygon")
          .transition(200)
          .style("fill-opacity", cfg.opacityArea);
        div.transition()
          .duration(0)
          .style("opacity", 0);
      });
    series++;



    var tooltip = this.host.append("div").attr("class", "toolTip");
    intermediaryData.forEach(function (y, x) {
      g.selectAll(".nodes")
        .data(y).enter()
        .append("svg:circle")
        .attr("class", "radar-chart-serie" + series)
        .attr('r', cfg.radius)
        .attr("alt", function (j) { return Math.max(j.value, 0) })
        .attr("cx", function (j, i) {
          dataValues.push([
            cfg.w / 2 * (1 - (parseFloat(Math.max(j, 0) + "") / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
            cfg.h / 2 * (1 - (parseFloat(Math.max(j, 0) + "") / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
          ]);
          return cfg.w / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total));
        })
        .attr("cy", function (j, i) {
          return cfg.h / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total));
        })
        .attr("data-id", function (j) { return j.area })
        .style("fill", "#fff")
        .style("stroke-width", "2px")
        .style("stroke", cfg.color(series + "")).style("fill-opacity", .9)
        .on('mouseover', function (d) {
          console.log(d.area)
          tooltip
            .style("left", d3.event.pageX - 40 + "px")
            .style("top", d3.event.pageY - 80 + "px")
            .style("display", "inline-block")
            .html((d.area) + "<br><span>" + (d.value) + "</span>");
        })
        .on("mouseout", function (d) { tooltip.style("display", "none"); });

      series++;
    });

    g.append("text")
      .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
      .attr("transform", "translate(" + (width / 2) + "," + ((height) + margin.top / (1.5)) + ")")  // centre below axis
      .text(data.date);
  }


}
