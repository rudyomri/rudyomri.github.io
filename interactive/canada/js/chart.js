var chart;

var chartData = [{
    city: "Toronto",
    year1951: 1262000,
    year1971: 1366000,
    year1991: 1265000,
	year2011: 1690000
	},
	
	{
    city: "Montreal",
    year1951: 1539000,
    year1971: 1204000,
    year1991: 384000,
	year2011: 697000
	},
	
	{
    city: "Vancouver",
    year1951: 586000,
    year1971: 496000,
    year1991: 521000,
	year2011: 710000
	},
	
	{
    city: "Ottawa",
    year1951: 312000,
    year1971: 291000,
    year1991: 318000,
	year2011: 315000
	},
	
	{
    city: "Calgary",
    year1951: 142000,
    year1971: 261000,
    year1991: 351000,
	year2011: 460000
	},
	
	{
    city: "Edmonton",
    year1951: 194000,
    year1971: 302000,
    year1991: 344000,
	year2011: 319000
	},
	
	{
    city: "Quebec City",
    year1951: 289000,
    year1971: 192000,
    year1991: 165000,
	year2011: 120000
	},
	
	{
    city: "Winnipeg",
    year1951: 357000,
    year1971: 183000,
    year1991: 112000,
	year2011: 78000
	},
	
	{
    city: "Hamilton",
    year1951: 282000,
    year1971: 217000,
    year1991: 101000,
	year2011: 121000
	},
	
	{
    city: "Kitchener",
    year1951: 108000,
    year1971: 119000,
    year1991: 129000,
	year2011: 121000
	},
	
	{
    city: "London",
    year1951: 168000,
    year1971: 118000,
    year1991: 96000,
	year2011: 92000
	},
	
	{
    city: "St. Catharine",
    year1951: 189000,
    year1971: 114000,
    year1991: 62000,
	year2011: 27000
	},
	
	{
    city: "Halifax",
    year1951: 138000,
    year1971: 85000,
    year1991: 98000,
	year2011: 69000
	},
	
	{
    city: "Oshawa",
    year1951: 30000,
    year1971: 90000,
    year1991: 120000,
	year2011: 116000
	},
	
	{
    city: "Victoria",
    year1951: 115000,
    year1971: 81000,
    year1991: 92000,
	year2011: 56000
	},
	
	{
    city: "Windsor",
    year1951: 183000,
    year1971: 76000,
    year1991: 0,
	year2011: 67000
	},
	
	{
    city: "Saskatoon",
    year1951: 56000,
    year1971: 70000,
    year1991: 84000,
	year2011: 50000
	},
	
	{
    city: "Regina",
    year1951: 73000,
    year1971: 68000,
    year1991: 51000,
	year2011: 18000
	},
	
	{
    city: "St. John's",
    year1951: 81000,
    year1971: 51000,
    year1991: 40000,
	year2011: 25000
	},
	
	{
    city: "Greater Sudbury",
    year1951: 81000,
    year1971: 74000,
    year1991: 3000,
	year2011: 2000
	},

	
	
	
	
	
	];

AmCharts.ready(function() {
    // SERIAL CHART
    chart = new AmCharts.AmSerialChart();
    chart.dataProvider = chartData;
    chart.categoryField = "city";
    chart.plotAreaBorderAlpha = 0.1;
	chart.rotate = true;

    // AXES
    // category
    var categoryAxis = chart.categoryAxis;
    categoryAxis.gridAlpha = 0.1;
    categoryAxis.axisAlpha = 0;
    categoryAxis.gridPosition = "start";

    // value
    var valueAxis = new AmCharts.ValueAxis();
    valueAxis.stackType = "regular";
    valueAxis.gridAlpha = 0.1;
    valueAxis.axisAlpha = 0;
    chart.addValueAxis(valueAxis);

    // GRAPHS
    // first graph    
    var graph = new AmCharts.AmGraph();
    graph.title = "Population in 1951";
    graph.labelText = "";
    graph.valueField = "year1951";
    graph.type = "column";
    graph.lineAlpha = 0;
    graph.fillAlphas = 1;
    graph.lineColor = "#991414";
    chart.addGraph(graph);

    // second graph              
    graph = new AmCharts.AmGraph();
    graph.title = "Population increase between 1951-1971";
    graph.labelText = "";
    graph.valueField = "year1971";
    graph.type = "column";
    graph.lineAlpha = 0;
    graph.fillAlphas = 1;
    graph.lineColor = "#C74242";
    chart.addGraph(graph);

    // third graph                              
    graph = new AmCharts.AmGraph();
    graph.title = "Population increase between 1971-1991";
    graph.labelText = "";
    graph.valueField = "year1991";
    graph.type = "column";
    graph.lineAlpha = 0;
    graph.fillAlphas = 1;
    graph.lineColor = "#E37474";
    chart.addGraph(graph);

    // fourth graph  
    graph = new AmCharts.AmGraph();
    graph.title = "Population increase between 1991-2011";
    graph.labelText = "";
    graph.valueField = "year2011";
    graph.type = "column";
    graph.lineAlpha = 0;
    graph.fillAlphas = 1;
    graph.lineColor = "#F5A6A6";
    chart.addGraph(graph);

    // LEGEND                  
    var legend = new AmCharts.AmLegend();
    legend.borderAlpha = 0;
    legend.valueWidth = 60;
    legend.horizontalGap = 40;
    chart.addLegend(legend);

    // WRITE
    chart.write("chartdiv");
});

// this method sets chart 2D/3D
function setDepth() {
    if (document.getElementById("rb1").checked) {
        chart.depth3D = 0;
        chart.angle = 0;
    } else {
        chart.depth3D = 25;
        chart.angle = 30;
    }
    chart.validateNow();
}