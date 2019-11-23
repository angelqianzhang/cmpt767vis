var _data;

window.onload = function(){
    loadData("data/trade_exports_value.json");
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

        var balloon = new balloonVis(_data);
        balloon.margin = {left: 20, top: 20, right:20, bottom: 20};

        balloon.width = $("#chart").width() - balloon.margin.left - balloon.margin.right;
        balloon.height = $("#chart").height() - balloon.margin.left - balloon.margin.bottom;
        balloon.svgContainer = d3.select("#chart");
//        balloon.myPie1 = d3.select("#pie1");
//        balloon.myPie2 = d3.select("#pie2");
//        balloon.myCont = d3.select("#buttonHide");
        balloon.createBalloon();

        balloon.myNet = d3.select("#net");

        balloon.PhraseNet();

        //balloon.sunBurst();
        //balloon.load_home();
         
    });
}

