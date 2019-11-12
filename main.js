var _data;

/**
 * Do the following when the browser window loads
 */
window.onload = function(){
    loadData("trade_exports_value_u.json");
   //drawNestCircle();
};

/**
 * Load data from a CSV file as JSON objects
 * @param path the location of the CSV file to load
 */
function loadData(path){
    d3.json(path, function(error, data){
        //do something with the data
        _data = data;
        console.log(_data);

        var balloon = new balloonVis(_data);
        balloon.margin = {left: 50, top: 20, right:20, bottom: 20};
        balloon.width = $("#chart").width() - balloon.margin.left - balloon.margin.right;
        balloon.height = $("#chart").height() - balloon.margin.left - balloon.margin.bottom;
        balloon.svgContainer = d3.select("#chart");
        balloon.myCont = d3.select("#buttonHide");
        balloon.createBalloon();
        

         
    });
}

