
var balloonVis = function(nations){
    this.nations = nations;

    this.width;
    this.height;
    this.margin;
    this.svgContainer;
//    this.myCont;
//    this.myPie1;
//    this.myPie2;
    this.myNet;

    //this.mobileScreen = ($( window ).innerWidth() < 500 ? true : false);

    this.createBalloon = function(){

        var load_home = function(country){

                            document.getElementById("content")
                            .innerHTML='<object type="text/html" data="index_chord.html?country='
                                + country
                                + '" style="width:90%; height:80%;  border:none;" scrolling="no"  seamless="seamless"></object>';
                            };

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

        var xScale = d3.scaleLinear().domain([0, 138000000]).range([110, this.width]);
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
            .attr("transform", "translate(100," + this.margin.left +")")
            .call(yAxis);
        // Add an x-axis label.
        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", this.width - 100)
            .attr("y", this.height - 10)
            .attr("style", "font-size:20px")
            .text("import value, unit (1000 US$)");
        // Add a y-axis label.
        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 110)
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
            return "<h5><strong>" + d.name + "</strong></h5><h5><strong>Population: </strong>" + format(d.population) + "</h5>";
            });


//        var circletip = this.myPie1.append("svg")
//                                .attr("id", "mytip")
//                                .attr("width", this.myPie1.width)
//                                .attr("height", this.myPie1.height);




        function click(d) {
            d3.select(this)
               .style('stroke', 'red');
            nodeid = d.name.split(' ').join('_');


            d3.select('#net').select("circle#"+nodeid).transition()
                            .duration(750)
                            .attr("r", 50)
                            .style("fill", "lightsteelblue");
            $('html,body').animate({
                    scrollTop: $("#net").offset().top},
                    'slow');
            var country = d.name;
            load_home(country);
        }

        function dblclick(d) {
            d3.select(this)
               .style('stroke', 'none');
            nodeid = d.name.split(' ').join('_');

            d3.select('#net').select("circle#"+nodeid).transition()
                            .duration(750)
                            .attr("r", 6)
                            .style("fill", "#ccc");


        }
        // Various accessors that specify the four dimensions of data to visualize.
        function x(d) { return d.income; }
        function y(d) { return d.lifeExpectancy; }
        function radius(d) { return d.population*1; }


    //function color(d) { return d.region; }
        function color(d) { return d.name; }
        function key(d) { return d.name; }

        // A bisector since many nation's data is sparsely-defined.
        var bisect = d3.bisector(function(d) { return d[0]; });

        var defs = svg.append("defs");
        defs.append("pattern")
        .attr("id", 'flags')
        .attr("height", "100%")
        .attr("width", "100%")
        .attr("patternContentUnits", "objectBoundingBox")
        .append("image")
        .attr("height", 1)
        .attr("width", 1)
        .attr("preserveAspectRatio", "none")
        .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
        .attr("xlink:href", "CN.svg");

        defs.selectAll(".flag-pattern")
            .data(interpolateData(2007))
            .enter().append("pattern")
            .attr("class", "flag-pattern")
            .attr("id", function(d){
                //CN
                //US
                return d.code;})
            .attr("height", "100%")
            .attr("width", "100%")
            .attr("patternContentUnits", "objectBoundingBox")
            .append("image")
            .attr("height", 1)
            .attr("width", 1)
            .attr("preserveAspectRatio", "none")
            .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
            .attr("xlink:href", function(d){
                return "images/"+d.code+".svg";
                });


        var dot = svg.append("g")
                .call(tip)
                .attr("class", "dots")
            .selectAll(".dot")
                .data(interpolateData(2007))
            .enter().append("circle")
                .style('stroke-width', '15px')
                .style('stroke', 'none')
                .attr('id', function(d){
                    var newid = d.name.split(' ').join('_');
                     return newid;})
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide)
                .attr("class", function (d) { return "dot " + d.name; })
                .on("click", click )
                .on("dblclick", dblclick)
//            .style("fill", function(d) { return colorScale(color(d)); })
              .style("fill", function(d){
//                    return "url(#flags)";
                return "url(#" + d.code +")";
                })
            .call(position)
            .sort(order);


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
                    code: d.CountryCode,
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
            .force("link", d3.forceLink().id(function(d) { return d.target; }))
            .force("charge", d3.forceManyBody())
            .force("link", d3.forceLink().distance(300))
            .force("center", d3.forceCenter(width / 2, height / 2));

        d3.csv("countryrelation_top1.csv", function(links) {

        var load_home = function(country){

                document.getElementById("content")
                .innerHTML='<object type="text/html" data="index_chord.html?country='
                    + country
                    + '" style="width:100%; height:80%;  border:none;" scrolling="no"  seamless="seamless"></object>';
                };

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
            if (v(link.value) <= 10) {
                link.type = 1;
            } else if (v(link.value) <= 20 && v(link.value) > 10) {
                link.type = 2;
            } else if (v(link.value) <= 30 && v(link.value) > 20) {
                link.type = 3;
            } else if (v(link.value) <= 40 && v(link.value) > 30) {
                link.type = 4;
            } else if (v(link.value) <= 50 && v(link.value) > 40) {
                link.type = 5;
            } else if (v(link.value) <= 60 && v(link.value) > 50) {
                link.type = 6;
            } else if (v(link.value) <= 70 && v(link.value) > 60) {
                link.type = 7;
            } else if (v(link.value) <= 80 && v(link.value) > 70) {
                link.type = 8;
            } else if (v(link.value) <= 90 && v(link.value) > 80) {
                link.type = 9;
            } else if (v(link.value) <= 100 && v(link.value) > 90) {
                link.type = 10;
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
            .attr("stroke-width", function(d) { return 2*d.type; })
            .attr("marker-end", "url(#end)");

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
            .attr("r", 10)
            .attr("id", function(d){ var newid = d.name.split(' ').join('_');
              return newid;})
            .style("fill", function(d) { return color(d.name); });

        // add the text
        node.append("text")
            .attr("x", 20)
            .attr("dy", "1.75em")
            .text(function(d) { return d.name; });



        // build the arrow.
        svg.append("defs").selectAll("marker")
            .data(["end"])      // Different link/path types can be defined here
          .enter().append("marker")    // This section adds in the arrows
            .attr("id", String)
//            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 15)
            .attr("refY", -1.5)
            .attr("viewBox", "0 0 10 10")
            .attr("markerUnits", "strokeWidth")
            .attr("markerWidth", 10)
            .attr("markerHeight", 5)
            .attr("orient", "auto")
          .append("path")
//            .attr("d", "M 0 0 L 10 5 L 0 10 z");
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
        var globalCount = 0;
        function click(d) {
            d3.select(this).select("text").transition()
                .duration(750)
                .attr("x", 22)
                .style("fill", "steelblue")
                .style("stroke", "lightsteelblue")
                .style("stroke-width", ".5px")
                .style("font", "20px sans-serif");
            d3.select(this).select("circle").transition()
                .duration(750)
                .attr("r", 50)
                .style("fill", "lightsteelblue");
            nodeid = d.name.split(' ').join('_');
            d3.select('#chart').select("circle#"+nodeid).transition()
                .duration(750)
                .style('stroke-width', '15px')
                .style('stroke', 'red');
            $('html,body').animate({
                scrollTop: $("#content").offset().top},
                'slow');

            var country = d3.select(this).text();

            load_home(country);
        }

        // action to take on mouse double click
        function dblclick() {
            d3.select(this).select("circle").transition()
                .duration(750)
                .attr("r", 6)
                .style("fill", "#ccc");
            d3.select(this).select("text").transition()
                //.duration(750)
                .attr("x", 20)
                .style("stroke", "none")
                .style("fill", "black")
                .style("font", "10px sans-serif");
            nodeid = d.name.split(' ').join('_');
                d3.select('#chart').select("circle#"+nodeid).transition()
                    .duration(750)
                    .style('stroke', 'none');


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
