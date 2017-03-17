
function drawChart(type,data,axisLabel) {
  var typeMapping = {
    "column" : drawColumnChart,
    "bar" : drawBarChart,
    "pie" : drawPieChart
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
      margin = {top: 15, right: 30, bottom: 60, left: 70},
      width = +eleChartBbox.width - margin.left - margin.right,
      height = +eleChartBbox.height - margin.top - margin.bottom;

  var svg = eleChart.append("svg").attr("width",eleChartBbox.width).attr("height",eleChartBbox.height);

  var x = d3.scaleBand().rangeRound([0, width]).padding(0.25),
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
      margin = {top: 15, right: 80, bottom: 60, left: 80},
      width = +eleChartBbox.width - margin.left - margin.right,
      height = +eleChartBbox.height - margin.top - margin.bottom;

  var svg = eleChart.append("svg").attr("width",eleChartBbox.width).attr("height",eleChartBbox.height);

  var x = d3.scaleLinear().rangeRound([0, width]),
      y = d3.scaleBand().rangeRound([height, 0]).padding(0.25);

  var g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .attr("width",width).attr("height",height);;


  x.domain([0, d3.max(data, function(d) { return d.x; })]);
  y.domain(data.map(function(d) { return d.y; }));

  g.append("g")
      .attr("class", "axis axis-x")
      .style("font-size",".75em")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(10));

  g.append("g")
      .attr("class", "axis axis-y")
      .style("font-size",".75em")
      .call(d3.axisLeft(y))
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
    .html(function(d) { return d.x; })
    .direction("e")
    .offset([0,10]);

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

function drawPieChart (data,axisLabel) {
    var eleChart = d3.select(".chart").html(""),
      eleChartBbox = eleChart.node().getBoundingClientRect(),
      margin = {top: 10, right: 15, bottom: 50, left: 15},
      width = +eleChartBbox.width - margin.left - margin.right,
      height = +eleChartBbox.height - margin.top - margin.bottom,
      radius = Math.min(width, height) / 2;

    var color = d3.scaleOrdinal().domain(data.map(function(d){return d.x}))
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

    var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d.y; });

    var svg = eleChart.append("svg")
    .attr("width",eleChartBbox.width)
    .attr("height",eleChartBbox.height)

    var g = svg
    .append("g")
    .attr("transform", "translate(" + (width/2 + margin.left) + "," + (height/2 + margin.top) + ")")
    .attr("width", width)
    .attr("height", height);


    var groupArc = g.selectAll(".arc")
    .data(pie(data))
    .enter().append("g")
    .attr("class", "arc");

    groupArc.append("path")
    .attr("d", arc)
    .style("fill", function(d) {return color(d.data.x); });

    groupArc.append("text")
    .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
    .attr("dy", ".35em")
    .style("text-anchor", "middle")
    .text(function(d) { return d.data.x; })
    .style("fill", "white");

    var xLabel = axisLabel[0];
    var yLabel = axisLabel[1];

    svg
    .append('g').classed("title",true)
    .attr('transform', 'translate(' + (width/2 + margin.left/2) + ', ' + (eleChartBbox.height - margin.bottom/2 ) + ')')
    .append('text')
    .attr('text-anchor', 'middle')
    .text(""+yLabel+" vs. "+xLabel);

    var tip_points = d3.tip()
    .attr('class', 'd3-tip')
    .html(function(d) {return d.data.y; })
    .direction(function(d){
      var availableDirection = ["n", "ne", "e", "se", "s", "sw", "w", "nw"];
      
      var midAngle = ((d.startAngle + d.endAngle)/2);
      
      var midAngle = ((d.startAngle + d.endAngle)/2)*180/Math.PI;
      var indexDirection = Math.floor(midAngle/360 *8);

      var direction = availableDirection[indexDirection];
      console.log(direction);
      return direction
    })
    .offset(function (d) {
      var midAngle = ((d.startAngle + d.endAngle)/2);

      midAngle = Math.floor(midAngle/(Math.PI*2/8))*(Math.PI*2/8);
      midAngle = midAngle - Math.PI/2;
      
      var extraRadius = 15;
      var posCentre = [-extraRadius*Math.sin(midAngle),-extraRadius*Math.cos(midAngle)];

      console.log(midAngle*180/Math.PI);
      console.log(posCentre);
      return posCentre;
    })

    var vis = svg.call(tip_points);

    groupArc
    .on('mouseover', function () {
      // console.log([event,this])
      if ("path" === event.target.nodeName)
      {
        tip_points.show.apply(this,arguments);
      }

    })
    .on('mouseout', function () {
      if ("path" === event.target.nodeName)
      {
        tip_points.hide.apply(this,arguments);
      }

    });


}

function cleanChart() {
  var eleChart = d3.select(".chart").html("");
}