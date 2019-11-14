/**
 * Constructor function for a Visualization that displays data as "balloon"
 * @param data (not required) the data array to visualize
 * @constructor
 */
var balloonVis = function(nations){
    this.nations = nations;

    this.width;
    this.height;
    this.margin;
    this.svgContainer;
    this.myCont;
    this.myPie1;
    this.myPie2;
    this.myNet;
    this.path;
    this.node;

    //this.mobileScreen = ($( window ).innerWidth() < 500 ? true : false);


    this.createBalloon = function(){


        var svg = this.svgContainer.append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .call(d3.zoom().on("zoom", function () {
                                        svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
//            .call(d3.behavior.zoom().on("zoom", function () {
//                            svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
     //        svg.attr("transform", "translate(" + d3.event.translate + ")" )
                          }));
          //  .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");



        // Various scales. These domains make assumptions of data, naturally.
//        var xScale = d3.scale.linear().domain([0, 125]).range([0, this.width]);
//        var yScale = d3.scale.linear().domain([-250, 150000000]).range([this.height, 0]);
//        var radiusScale = d3.scale.sqrt().domain([0, 5e8]).range([0, this.width * 0.05]);
//        var colorScale = d3.scale.category10();

        var xScale = d3.scaleLinear().domain([0, 138000000]).range([40, this.width]);
        var yScale = d3.scaleLinear().domain([0, 150000000]).range([this.height, 0]);
        var radiusScale = d3.scaleSqrt().domain([0, 5e8]).range([0, this.width * 0.05]);

        var colorScale = d3.scaleOrdinal(d3.schemeCategory20);


        var formatX = d3.format(".1s");
        //var formatX = d3.format(function(d){return d/1000000 + "M"});
        // The x & y axes.
        var xAxis = d3.axisBottom(xScale).ticks(8, formatX).tickFormat(function(d){return d/1000000 + "M"});
//        var xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(177, formatX)

//        var yAxis = d3.svg.axis().scale(yScale).orient("left").tickFormat(function(d){return d/1000000 + "M"});
//        var xAxis = d3.axisBottom(xScale).ticks(177, formatX)
        var yAxis = d3.axisLeft(yScale).ticks(8, formatX).tickFormat(function(d){return d/1000000 + "M"});

        var format = d3.format(".2s");

        // Add the x-axis.
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(10," + this.height + ")")
            .call(xAxis);
        // Add the y-axis.
        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(40," + this.margin.left +")")
            .call(yAxis);
        // Add an x-axis label.
        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", this.width - 100)
            .attr("y", this.height + 21)
            .attr("style", "font-size:20px")
            .text("import value, unit (1000 US$)");
        // Add a y-axis label.
        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 50)
            .attr("x", -150)
            .attr("dy", "0.75em")
            .attr("transform", "rotate(-90)")
            .attr("style", "font-size:20px")
            .text("export value, unit (1000 US$)");
        // Add the year label; the value is set on transition.
        var label = svg.append("text")
            .attr("class", "year label")
            .attr("text-anchor", "end")
            .attr("y", this.height - 24)
            .attr("x", this.width - 600)
            .attr("style", "font-size:" + (this.width * 0.2).toString() + "px")
            .text(2007);

        var tip = d3.tip()
          .attr('class', 'd3-tip')
          .direction('s')
          .offset([-8, 0])
          .html(function(d) {
            return "<p><strong>" + d.name + "</strong></p><p><strong>Population: </strong>" + format(d.population) + "</p>";
            });


        var circletip = this.myPie1.append("svg")
                                .attr("id", "mytip")
                                .attr("width", this.myPie1.width)
                                .attr("height", this.myPie1.height);
        var mousedown = function(d) {
            var countryname = d.name;
            var file1 ="graph.json";
            var vis = "#mytip";
            var selColor = d3.select(this).style('fill');
            drawNestCircle(circletip, countryname, file1, selColor);
            //drawPie(circletip);
            var countryClass = d3.select(this).classed();
            //d3.selectAll("circle").transition().duration(100).style("opacity", 0.25);
            d3.select(countryClass).transition().duration(10).style("opacity", 1);
            d3.select("#mytip").transition().duration(100).style("opacity", 1);

            //${#vis1}.style.display = 'block';
          };

        var mouseup = function(d){
            //${#vis1}.style.display = 'none';
            d3.select("#mytip").transition().duration(100).style("opacity", 0);
            d3.selectAll("circle").transition().duration(100).style("opacity", 1);
        }

        // Various accessors that specify the four dimensions of data to visualize.
        function x(d) { return d.income; }
        function y(d) { return d.lifeExpectancy; }
        function radius(d) { return d.population*5; }


    //function color(d) { return d.region; }
        function color(d) { return d.name; }
        function key(d) { return d.name; }

        // A bisector since many nation's data is sparsely-defined.
        var bisect = d3.bisector(function(d) { return d[0]; });


        var dot = svg.append("g")
                .call(tip)
                .attr("class", "dots")
            .selectAll(".dot")
                .data(interpolateData(2007))
            .enter().append("circle")
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide)
                .attr("class", function (d) { return "dot " + d.name; })
                .on("mousedown", mousedown )
                .on("mouseup", mouseup)
            .style("fill", function(d) { return colorScale(color(d)); })
            .call(position)
            .sort(order);

        this.myCont.on("click", function() {
        	d3.select("#mytip").transition().duration(100).style("opacity", 0);
        });


//        function position(dot) {
//                    //dot.attr("cx", function(d, i) {   return xScale(x(i)); })
//                    dot.attr("x", function(d, i) {   return xScale(i); })
//                        .attr("y", function(d) {   return yScale(y(d)); })
//                        .attr("r", function(d) {  return radiusScale(radius(d)); });
//                        }



        // Add an overlay for the year label.
        var box =  label.node().getBBox();

        var overlay = svg.append("rect")
                .attr("class", "overlay")
                .attr("x", box.x)
                .attr("y", box.y)
                .attr("width", box.width)
                .attr("height", box.height)
                .on("mouseover", enableInteraction);

        // Start a transition that interpolates the data based on year.
         //    .ease("linear")
         //    .tween("year", tweenYear)
         // .each("end", enableInteraction);
        svg.transition()
            .duration(15000)
            .ease(d3.easeLinear)
            .attrTween("year", tweenYear)
            .each(enableInteraction);

        function order(a, b) { return radius(b) - radius(a); }
    // Add a dot per nation. Initialize the data at 2007, and set the colors.
        function position(dot) {
            dot.attr("cx", function(d, i) {   return xScale(x(d)); })
//            dot.attr("cx", function(d, i) {   return xScale(i); })
                .attr("cy", function(d) {   return yScale(y(d)); })
               .attr("r", function(d) {  return radiusScale(radius(d)); });
                 }


        // After the transition finishes, you can mouseover to change the year.
        function enableInteraction() {
            var yearScale = d3.scaleLinear()
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

            function  mouseover() { label.classed("active", true); }
            function  mouseout() { label.classed("active", false); }
            function  mousemove() { displayYear(yearScale.invert(d3.mouse(this)[0])); }
        };
        // Tweens the entire chart by first tweening the year, and then the data.
        // For the interpolated data, the dots and label are redrawn.
        function tweenYear() {
            var year = d3.interpolateNumber(2007, 2016);
            return function(t) { displayYear(year(t)); };
        };
        // Updates the display to show the specified year.

        function displayYear(year) {
            //console.log(dot.data(interpolateData(year), key).call(position).sort(order))
            dot.data(interpolateData(year), key).call(position).sort(order);
            label.text(Math.round(year));
        };
        // Interpolates the dataset for the given (fractional) year.

        function interpolateData(year) {
            return nations.map(function(d) {

                return {
                    name: d.name,
                    //region: d.region,
                    //income: this.interpolateValues(d.income, year),
                    income: interpolateValues(d.importvalue, year),
                    population: interpolateValues(d.population, year),
                    //lifeExpectancy: this.interpolateValues(d.lifeExpectancy, year)
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


        function drawNestCircle(svg, ctname, file, myColor){
            //var svg = d3.select(vis);

            var margin = 20;

            var diameter = 800;

            var g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

            var color = d3.scaleLinear()
                .domain([-1, 5])
                .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
                .interpolate(d3.interpolateHcl);
            var pack = d3.pack()
                .size([diameter - margin, diameter - margin])
                .padding(2);

            d3.json(file, function( json) {
              //if (error) throw error;

              for (i=0; i<json.length; i++) {
                  if (json[i]['name']==ctname){
                      root1 = json[i];
                      break;
                  } else {
                      root1 = 0
                      console.log('no country is selected')
                  }
              }

              root = d3.hierarchy(root1)
                  .sum(function(d) { return d.size; })
                  .sort(function(a, b) { return b.value - a.value; });
              var focus = root,
                  nodes = pack(root).descendants(),
                  view;
              //var circle = g.selectAll("circle")
              var circle = g.selectAll("circle")
                .data(nodes)
                .enter().append("circle")
                  .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
                  .style("fill", function(d) { return d.children ? color(d.depth) : myColor; })
                  .on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); });
              var text = g.selectAll("text")
                .data(nodes)
                .enter().append("text")
                  .attr("class", "label")
                  .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
                  .style("display", function(d) { return d.parent === root ? "inline" : "none"; })
                  .text(function(d) { return d.data.name; });

              var node = g.selectAll("circle,text");
              svg
                  .style("background", color(-1))
//                  .style("fill", null)
                  .on("click", function() { zoom(root); });


              zoomTo([root.x, root.y, root.r * 2 + margin]);
              drawPie(svg, root);

              function zoom(d) {
                var focus0 = focus; focus = d;
                var transition = d3.transition()
                    .duration(d3.event.altKey ? 7500 : 750)
                    .tween("zoom", function(d) {
                      var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
                      return function(t) { zoomTo(i(t)); };
                    });
                transition.selectAll("text")
                  .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
                    .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
                    .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
                    .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
              }
              function zoomTo(v) {
                var k = diameter / v[2]; view = v;

                node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
                circle.attr("r", function(d) {  return d.r * k; });
              }


              function drawPie(piesvg, data){

                  var data1 = [2, 4, 8, 10];
                  var data1 = [];
                  var width = piesvg.attr("width"),
                      height = piesvg.attr("height"),
                      radius = Math.min(width, height) / 3.5,
                      g = piesvg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 3 + ")");

                  var color = d3.scaleOrdinal()
                   	.range(["#2C93E8","#838690","#F56C4E"]);


                  // Generate the pie
                  var pie = d3.pie()
                        .value(function(d) { return d.data.size; })(data.children);
                  console.log(data.children[0].data);
                  console.log(data.children.length)
                  // Generate the arcs
                  var arc = d3.arc()
                              .innerRadius(0)
                              .outerRadius(radius);
                  //Generate groups
                  var arcs = g.selectAll("arc")
                              .data(pie)
                              .enter()
                              .append("g")
                              .attr("class", "arc")

                  var labelArc = d3.arc()
                  	.outerRadius(radius - 40)
                  	.innerRadius(radius - 40);

//
//                  var g = piesvg.selectAll("arc")
//                  	.data(pie)
//                  	.enter().append("g")
//                  	.attr("class", "arc");

                  //Draw arc paths
                  arcs.append("path")
                      .attr("fill", function(d, i) {
                          return color(i);
                      })
                      .attr("d", arc);

//                    g.append("path")
//                     .style("fill", function(d) { return color(d.data.name);})
//                     .attr("d", arc);
                  arcs.append("text")
                  	.attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
                  	.text(function(d) { console.log(d.data.data.name); return d.data.data.name;})
                  	.style("fill", "#fff");
              }
              });
        }



    }
    this.PhraseNet = function(){
                // get the data
        var width = this.width,
        height = this.height
        color = d3.scaleOrdinal(d3.schemeCategory20);

        var svg = d3.select("#net").append("svg")
                    .attr("width", width)
                    .attr("height", height);



        var force = d3.forceSimulation()
//                    .links(links)
//                    .size([width, height])
//                    .linkDistance(60)
//                    .charge(-300)
            .force("link", d3.forceLink().id(function(d) { console.log(d); return d.target; }))
            .force("charge", d3.forceManyBody())
            .force("link", d3.forceLink().distance(500))
            .force("center", d3.forceCenter(width / 2, height / 2));

        d3.csv("countryrelation_china.csv", function(links) {

        var nodes = {};

        // Compute the distinct nodes from the links.
        links.forEach(function(link) {
            link.source = nodes[link.source] ||
                (nodes[link.source] = {name: link.source});
            link.target = nodes[link.target] ||
                (nodes[link.target] = {name: link.target});
            link.value = +link.value;
        });

         // Set the range
        var  v = d3.scaleLinear().range([0, 100]);

        // Scale the range of the data
        v.domain([0, d3.max(links, function(d) { return d.value; })]);


        // asign a type per value to encode opacity
        links.forEach(function(link) {
            if (v(link.value) <= 25) {
                link.type = "twofive";
            } else if (v(link.value) <= 50 && v(link.value) > 25) {
                link.type = "fivezero";
            } else if (v(link.value) <= 75 && v(link.value) > 50) {
                link.type = "sevenfive";
            } else if (v(link.value) <= 100 && v(link.value) > 75) {
                link.type = "onezerozero";
            }
        });

        force.nodes(d3.values(nodes))
                    .on("tick", tick);

        force.force("link")
              .links(links);

        force.restart();

        // add the links and the arrows
        var path = svg.append("g").selectAll("path")
            .data(links )
            .enter().append("path")
            .attr("class", function(d) { return "link " + d.type; })
            .attr("marker-end", "url(#end)")
            .attr("stroke-width", function(d) {console.log(d.value); return Math.sqrt(d.value); });
        console.log(force.nodes());

        // define the nodes
        var node = svg.selectAll(".node")
            .data(force.nodes())
          .enter().append("g")
            .attr("class", "node")
            .on("click", click)
            .on("dblclick", dblclick)
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));
//            .call(force.drag);

        // add the nodes
        node.append("circle")
            .attr("r", 5)
            .style("fill", function(d) { return color(d.name); });

        // add the text
        node.append("text")
            .attr("x", 12)
            .attr("dy", ".35em")
            .text(function(d) { return d.name; });



        // build the arrow.
        svg.append("defs").selectAll("marker")
            .data(["end"])      // Different link/path types can be defined here
          .enter().append("marker")    // This section adds in the arrows
            .attr("id", String)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 15)
            .attr("refY", -1.5)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
          .append("path")
            .attr("d", "M0,-5L10,0L0,5");



        // add the curvy lines
        function tick() {
            path.attr("d", function(d) {
                var dx = d.target.x - d.source.x,
                    dy = d.target.y - d.source.y,
                    dr = Math.sqrt(dx * dx + dy * dy);
                return "M" +
                    d.source.x + "," +
                    d.source.y + "A" +
                    dr + "," + dr + " 0 0,1 " +
                    d.target.x + "," +
                    d.target.y;
            });

            node
                .attr("transform", function(d) {
                    return "translate(" + d.x + "," + d.y + ")"; });
        }

        // action to take on mouse click
        function click() {
            d3.select(this).select("text").transition()
                .duration(750)
                .attr("x", 22)
                .style("fill", "steelblue")
                .style("stroke", "lightsteelblue")
                .style("stroke-width", ".5px")
                .style("font", "20px sans-serif");
            d3.select(this).select("circle").transition()
                .duration(750)
                .attr("r", 16)
                .style("fill", "lightsteelblue");
        }

        // action to take on mouse double click
        function dblclick() {
            d3.select(this).select("circle").transition()
                .duration(750)
                .attr("r", 6)
                .style("fill", "#ccc");
            d3.select(this).select("text").transition()
                .duration(750)
                .attr("x", 12)
                .style("stroke", "none")
                .style("fill", "black")
                .style("stroke", "none")
                .style("font", "10px sans-serif");
        }

        function dragstarted(d) {
          if (!d3.event.active) force.alphaTarget(0.3).restart()
//          force.fix(d);
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
//          force.fix(d, d3.event.x, d3.event.y);
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        }

        function dragended(d) {
          if (!d3.event.active) force.alphaTarget(0);
          d.fx = null;
          d.fy = null;
//          force.unfix(d);
        }

        });
    };

}
