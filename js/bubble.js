
function bubble(svgid){
    var mobileScreen = ($( window ).innerWidth() < 500 ? true : false);
    //Scatterplot
    var margin = {left: 50, top: 20, right: 20, bottom: 20},	width = Math.min($(svgid).width(), 1380) - margin.left - margin.right,
	    height = width*2/3;
    var svg = d3.select(svgid).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
     
    // Various scales. These domains make assumptions of data, naturally.
    var xScale = d3.scale.linear().domain([0, 120000000]).range([0, width]),
        yScale = d3.scale.linear().domain([0, 160000000]).range([height, 0]),
        radiusScale = d3.scale.sqrt().domain([0, 5e8]).range([0, width * 0.05]),
        colorScale = d3.scale.category10();

    //var xScale = d3.scale.log().domain([300, 1e5]).range([0, width]),
     //   yScale = d3.scale.linear().domain([10, 85]).range([height, 0]),
      //  radiusScale = d3.scale.sqrt().domain([0, 5e8]).range([0, width * 0.05]),
       // colorScale = d3.scale.category10();

    //var formatX = d3.format(".1s");
    var formatX = d3.format(function(d){return d/1000000 + "M"});
    // The x & y axes.
    var xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(8, formatX).tickFormat(function(d){return d/1000000 + "M"});
    var yAxis = d3.svg.axis().scale(yScale).orient("left").tickFormat(function(d){return d/1000000 + "M"});
    var format = d3.format(".2s");
    // Add the x-axis.
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    // Add the y-axis.
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
    // Add an x-axis label.
    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 6)
        .text("import value, unit (1000 US$)");
    // Add a y-axis label.
    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("export value, unit (1000 US$)");
    // Add the year label; the value is set on transition.
    var label = svg.append("text")
        .attr("class", "year label")
        .attr("text-anchor", "end")
        .attr("y", height - 24)
        .attr("x", width)
		    .attr("style", "font-size:" + (width * 0.2).toString() + "px")
        .text(2007);
    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .direction('s')
      .html(function(d) {
        return "<p><strong>" + d.name + "</strong></p><p><strong>Population: </strong>" + format(d.population) + "</p>";
      })
    // Various accessors that specify the four dimensions of data to visualize.
    function x(d) { return d.income; }
    function y(d) { return d.lifeExpectancy; }
    function radius(d) { return d.population*10; }

    //function radius(d) { return 5;  }
    //function color(d) { return d.region; }
    function color(d) { return d.name; }
    function key(d) { return d.name; }
    // Load the data.
    d3.json("trade_exports_value.json", function(nations) {
      	// A bisector since many nation's data is sparsely-defined.
      	var bisect = d3.bisector(function(d) { return d[0]; });
      	// Add a dot per nation. Initialize the data at 2007, and set the colors.
	    console.log(nations)
      	var dot = svg.append("g")
        		.call(tip)
        		.attr("class", "dots")
        	.selectAll(".dot")
        		.data(interpolateData(2007))
        	.enter().append("circle")
        		.on('mouseover', tip.show)
         		.on('mouseout', tip.hide)
        		.attr("class", function (d) { return "dot " + d.name; })
          	.style("fill", function(d) { return colorScale(color(d)); })
          	.call(position)
          	.sort(order);
      	console.log(nations);
      	// Add an overlay for the year label.
      	var box = label.node().getBBox();
      
      	var overlay = svg.append("rect")
        		.attr("class", "overlay")
        		.attr("x", box.x)
        		.attr("y", box.y)
        		.attr("width", box.width)
        		.attr("height", box.height)
        		.on("mouseover", enableInteraction);
      
      	// Start a transition that interpolates the data based on year.
      	svg.transition()
          	.duration(15000)
          	.ease("linear")
          	.tween("year", tweenYear)
          	.each("end", enableInteraction);
      
      	// Positions the dots based on data.
      	function position(dot) {
          	dot.attr("cx", function(d) {   return xScale(x(d)); })
              	.attr("cy", function(d) {   return yScale(y(d)); })
              	.attr("r", function(d) {  return radiusScale(radius(d)); });
        		}
      
      	// Defines a sort order so that the smallest dots are drawn on top.
      	function order(a, b) { return radius(b) - radius(a); }
      
      	// After the transition finishes, you can mouseover to change the year.
      	function enableInteraction() {
          	var yearScale = d3.scale.linear()
            	.domain([2007, 2016])
            	.range([box.x + 10, box.x + box.width - 10])
            	.clamp(true);
          	// Cancel the current transition, if any.
          	svg.transition().duration(0);
          	overlay
              	.on("mouseover", mouseover)
              	.on("mouseout", mouseout)
              	.on("mousemove", mousemove)
              	.on("touchmove", mousemove);
          	function mouseover() { label.classed("active", true); }
          	function mouseout() { label.classed("active", false); }
          	function mousemove() { displayYear(yearScale.invert(d3.mouse(this)[0])); }
      	}
      	// Tweens the entire chart by first tweening the year, and then the data.
      	// For the interpolated data, the dots and label are redrawn.
      	function tweenYear() {
          	var year = d3.interpolateNumber(2007, 2016);
          	return function(t) { displayYear(year(t)); };
        }
      	// Updates the display to show the specified year.
      	function displayYear(year) {
          	console.log(dot.data(interpolateData(year), key).call(position).sort(order))
            dot.data(interpolateData(year), key).call(position).sort(order);
          	label.text(Math.round(year));
        }
      	// Interpolates the dataset for the given (fractional) year.
      	function interpolateData(year) {
          	return nations.map(function(d) {
              	return {
                  	name: d.name,
                  	//region: d.region,
                  	//income: interpolateValues(d.income, year),
                  	income: interpolateValues(d.importvalue, year),
                  	population: interpolateValues(d.population, year),
                  	//lifeExpectancy: interpolateValues(d.lifeExpectancy, year)
                  	lifeExpectancy: interpolateValues(d.exportvalue, year)
                };
            });
        }
      	// Finds (and possibly interpolates) the value for the specified year.
      	function interpolateValues(values, year) {
          	var i = bisect.left(values, year, 0, values.length - 1),
                a = values[i];
          	if (i > 0) {
              	var b = values[i - 1],
                    t = (year - a[0]) / (b[0] - a[0]);
              	return a[1] * (1 - t) + b[1] * t;
            }
          return a[1];
        }
    });
}