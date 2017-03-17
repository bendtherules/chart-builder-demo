
function drawChart(type,data,axisLabel) {
  var typeMapping = {
    "column" : drawColumnChart,
    "bar" : drawBarChart,
    // "pie" : drawPieChart
  };
  if (typeof(type) === "string"){
    var drawFunc = typeMapping[type.toLowerCase()];
    if (typeof(drawFunc) !== undefined){
      drawFunc(data,axisLabel);
    }
  }
}

function drawColumnChart(data,axisLabel)
{
  var eleChart = d3.select(".chart").html(""),
      eleChartBbox = eleChart.node().getBoundingClientRect(),
      margin = {top: 35, right: 20, bottom: 60, left: 70},
      width = +eleChartBbox.width - margin.left - margin.right,
      height = +eleChartBbox.height - margin.top - margin.bottom;

  var svg = eleChart.append("svg").attr("width",eleChartBbox.width).attr("height",eleChartBbox.height);

  var x = d3.scaleBand().rangeRound([0, width/1.1]).padding(0.25),
      y = d3.scaleLinear().rangeRound([height, 0]);

  var g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  x.domain(data.map(function(d) { return d.x; }));
  y.domain([0, d3.max(data, function(d) { return d.y; })]);

  g.append("g")
      .attr("class", "axis axis-x")
      .style("font-size",".75em")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis axis-y")
      .style("font-size",".75em")
      .call(d3.axisLeft(y).ticks(10))
    .append("text")
      .attr("transform", "translate(15,0) rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("y");

  var xLabel = ((axisLabel.length == 2) && axisLabel[0] ) || "X-label";
  var yLabel = ((axisLabel.length == 2) && axisLabel[1] ) || "Y-label";

  var xLabelPos = d3.select(".axis-x").node().getBBox().height*2 + height;
  var yLabelPos = -d3.select(".axis-y").node().getBBox().width*0.65;

  g
    .append('g').classed("label-x",true)
    .attr('transform', 'translate(' + (width/2) + ', ' + xLabelPos + ')')
    .append('text')
    .attr('text-anchor', 'middle')
    .text(xLabel);

  g
    .append('g').classed("label-y",true)
    .attr('transform', 'translate(' + yLabelPos + ', ' + (height/2) + ') rotate(-90)')
    .append('text')
    .attr('text-anchor', 'middle')
    .attr("shape-rendering","crispEdges")
    .text(yLabel);

  var tip_points = d3.tip()
    .attr('class', 'd3-tip')
    .html(function(d) { return d.y; });

  var vis = svg.call(tip_points);

  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.x); })
      .attr("y", function(d) { return y(d.y); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.y); })
      .on('mouseover', function () {
        tip_points.show.apply(this,arguments);

      })
      .on('mouseout', function () {
        tip_points.hide.apply(this,arguments);

   });

}

function drawBarChart(data,axisLabel){
  var eleChart = d3.select(".chart").html(""),
      eleChartBbox = eleChart.node().getBoundingClientRect(),
      margin = {top: 20, right: 35, bottom: 70, left: 60},
      width = +eleChartBbox.width - margin.left - margin.right,
      height = +eleChartBbox.height - margin.top - margin.bottom;

  var svg = eleChart.append("svg").attr("width",eleChartBbox.width).attr("height",eleChartBbox.height);

  var x = d3.scaleLinear().rangeRound([0, width/1.1]),
      y = d3.scaleBand().rangeRound([height, 0]).padding(0.25);

  var g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  x.domain([0, d3.max(data, function(d) { return d.x; })]);
  y.domain(data.map(function(d) { return d.y; }));

  // g.append("g")
  //     .attr("class", "axis axis-x")
  //     .style("font-size",".75em")
  //     .attr("transform", "translate(0," + height + ")")
  //     .call(d3.axisBottom(x));

  // g.append("g")
  //     .attr("class", "axis axis-y")
  //     .style("font-size",".75em")
  //     .call(d3.axisLeft(y).ticks(10))
  //   .append("text")
  //     .attr("transform", "translate(15,0) rotate(-90)")
  //     .attr("y", 6)
  //     .attr("dy", "0.71em")
  //     .attr("text-anchor", "end")
  //     .text("y");

  // var xLabel = ((axisLabel.length == 2) && axisLabel[0] ) || "X-label";
  // var yLabel = ((axisLabel.length == 2) && axisLabel[1] ) || "Y-label";

  // var xLabelPos = d3.select(".axis-x").node().getBBox().height*2 + height;
  // var yLabelPos = -d3.select(".axis-y").node().getBBox().width*0.65;

  // g
  //   .append('g').classed("label-x",true)
  //   .attr('transform', 'translate(' + (width/2) + ', ' + xLabelPos + ')')
  //   .append('text')
  //   .attr('text-anchor', 'middle')
  //   .text(xLabel);

  // g
  //   .append('g').classed("label-y",true)
  //   .attr('transform', 'translate(' + yLabelPos + ', ' + (height/2) + ') rotate(-90)')
  //   .append('text')
  //   .attr('text-anchor', 'middle')
  //   .attr("shape-rendering","crispEdges")
  //   .text(yLabel);

  var tip_points = d3.tip()
    .attr('class', 'd3-tip')
    .html(function(d) { return d.x; });

  var vis = svg.call(tip_points);

  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return 0; })
      .attr("y", function(d) { return y(d.y); })
      .attr("width", function(d) { return x(d.x); })
      .attr("height", y.bandwidth())
      .on('mouseover', function () {
        tip_points.show.apply(this,arguments);

      })
      .on('mouseout', function () {
        tip_points.hide.apply(this,arguments);

   });

}








function cleanChart() {
  var eleChart = d3.select(".chart").html("");
}