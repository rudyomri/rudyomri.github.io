//global variables
var map; //map object
var legend; //legend object
var year = 2005; //initial timestamp
var scaleFactor = 45; //scale factor for marker area

var radiusArray;

//the first function called once the html is loaded
function initialize(){
	//<-window.onload
	setMap(); //->
};

function setMap() {
	//<-initialize()
	
	//create the map and set its initial view
	map = L.map('map').setView([38, -94], 4);
	
	//add the tile layer to the map
	var layer = L.tileLayer(
		'http://{s}.acetate.geoiq.com/tiles/acetate/{z}/{x}/{y}.png',
		{
			attribution: 'Acetate tileset from GeoIQ'
	}).addTo(map);
	
	//call the function to process the csv with the data
	processCSV(); //->
};

function processCSV() {
	//<-setMap()

	//process the citiesData csv file
	var processCSV = new ProcessCSV();
	var csv = 'data/citiesData.csv';
	processCSV.addListener("complete", function(){
		var csvData = processCSV.getCSV();
		createMarkers(csvData); //->
	});
	processCSV.process(csv);
};

function createMarkers(csvData) {
	//<-processCSV()
	
	
	//marker style object
	var markerStyle = {
    	fillColor: "#39F"
	};
	
	//create array to hold markers
	var markersArray = [];
	
	//create a circle marker for each feature object in the csvData array
	for (var i=0; i<csvData.length; i++) {
		var feature = {};
		feature.properties = csvData[i];
		var lat = Number(feature.properties.latitude);
		var lng = Number(feature.properties.longitude);
		var marker = L.circleMarker([lat,lng], markerStyle);
		marker.feature = feature;
		markersArray.push(marker);
	};
	
	//create a markers layer with all of the circle markers
	var markersLayer = L.featureGroup(markersArray);
	
	//designate variable to hold array of marker radii for legend
	radiusArray = [];
	
	//call the function to size each marker and add its popup
	markersLayer.eachLayer(function(layer) {
		var radius = onEachFeature(layer);//->
		radiusArray.push(radius);
	});
	
	//set the map legend
	//setLegend(radiusArray);//->
	
	makeLegend(radiusArray);
	
	//add the markers layer to the map
	markersLayer.addTo(map);
};

function onEachFeature(layer) {	
	//<-createMarkers()
	
	//calculate the area based on the data for that timestamp
	var area = layer.feature.properties[year] * scaleFactor;
	//calculate the radius
	var radius = Math.sqrt(area/Math.PI);
	//set the symbol radius
	layer.setRadius(radius);
	
	return radius;
};

function setLegend(radiusArray){  // solution written by Carl Sack
	//<-createMarkers()
	
	//calculate the max, min, and mean radii from the array
	var maxrad = Math.max.apply(null, radiusArray);
	var minrad = Math.min.apply(null, radiusArray);
	var midrad = (maxrad + minrad)/2;
	
	//create the legend with options that disable any map functionality
	legend = L.map('legend', {
		zoomControl: false,
		attributionControl: false,
		dragging: false,
		maxZoom: 1,
		minZoom: 1
	}).setView([30,30], 1);
	
	//create each circle marker with its center adjusted to line up base points
	var baselat = maxrad*0.65;
	var lat = baselat;
	var markerMax = L.circleMarker([lat,0], {
		radius: maxrad,
		fillColor: "#39F"
	}).addTo(legend);
	//lower center by max radius - mean radius
	lat = baselat - (maxrad*0.65) + (midrad*0.65);
	var markerMid = L.circleMarker([lat,0], {
		radius: midrad,
		fillColor: "#39F"
	}).addTo(legend);
	//lower center by max radius - min radius
	lat = baselat - (maxrad*0.65) + (minrad*0.65);
	var markerMin = L.circleMarker([lat,0], {
		radius: minrad,
		fillColor: "#39F"
	}).addTo(legend);
	
	//fill the timestamp div
	var legendYear = document.getElementById("legendYear");	
	legendYear.innerHTML = "<h1>"+year+"<h1>";
	
	//reverse-calculate the legend marker values
	var maximum = Math.round((Math.pow(maxrad,2)*Math.PI)/scaleFactor);
	var median = Math.round((Math.pow(midrad,2)*Math.PI)/scaleFactor);
	var minimum = Math.round((Math.pow(minrad,2)*Math.PI)/scaleFactor);
	//fill the legend data div
	var legendData = document.getElementById("legendData");	
	legendData.innerHTML = 
		"Max: "+maximum+"<br />"+
		"Median: "+median+"<br />"+
		"Min: "+minimum+"<br />";
};

function makeLegend(rArray){
	
	var maxrad = Math.max.apply(null, rArray);
	var minrad = Math.min.apply(null, rArray);
	var midrad = (maxrad + minrad)/2
	var legendArray = [maxrad, midrad, minrad];
	
	// DIV ELEMENTS and CSS ATTRIBUTES APPROACH
	var container = document.getElementById("legend1");
	var circleContainer = document.createElement("div");
	circleContainer.setAttribute("id", "circleContainer");
	var cDiv,h = 20,w = 10,v;
	
	for (var i=0; i < legendArray.length; i++) {	
		v = legendArray[i]*2;
		cDiv = document.createElement('div');
		cDiv.setAttribute("style", "width: "+v+"px; height: "+v+"px; margin: 0 auto "+h/2+"px; border-radius:50%; border: 2px solid #728bed; background: rgba(114, 139, 237, .4);" );
		circleContainer.appendChild(cDiv);
	}
	container.appendChild(circleContainer);
	
	// JS ROLL YOUR OWN APPROACH
	// http://blog.blazingcloud.net/2010/09/17/svg-scripting-with-javascript-part-1-simple-circle/
	var container = document.getElementById("legend2");
	var mySvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	mySvg.setAttribute("version", "1.2");
	mySvg.setAttribute("baseProfile", "tiny");
	mySvg.setAttribute("height", "200px");
	mySvg.setAttribute("width", "100%");
	container.appendChild(mySvg);
		
	var c;
	var h = 40;
	for (var i=0; i < legendArray.length; i++) {		
		c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		c.setAttribute("cx", 40);
		c.setAttribute("cy", h);
		c.setAttribute("r", legendArray[i]);
		c.setAttribute("fill", "rgba(114, 139, 237, .4)");
		c.setAttribute("stroke", "#728bed");
		c.setAttribute("stroke-width", 2);
		mySvg.appendChild(c);
		h += legendArray[i]*2;	
	}
	
	// Raphael approach
	var legend = Raphael(document.getElementById('legend3'),100, 0);
	
	var legendCircle;
	var h = 40;
	var circle;
	for (var i=0; i < legendArray.length; i++) {
		circle = legend.circle(40, h, legendArray[i]);
		circle.attr("fill", "rgba(114, 139, 237, .4)");
		circle.attr("stroke", "#728bed");
		circle.attr("stroke-width", 2);
		h += legendArray[i]*2;	
	}
	
	//fill the timestamp div
	var legendYear = document.getElementById("legendYear");	
	legendYear.innerHTML = "<h2>Current Year: "+year+"<h2>";
	
	
	//reverse-calculate the legend marker values
	var maximum = Math.round((Math.pow(maxrad,2)*Math.PI)/scaleFactor);
	var median = Math.round((Math.pow(midrad,2)*Math.PI)/scaleFactor);
	var minimum = Math.round((Math.pow(minrad,2)*Math.PI)/scaleFactor);
	//fill the legend data div
	var legendData = document.getElementById("legendData");	
	legendData.innerHTML = 
		"<p>Max: "+maximum+"<br />"+
		"Median: "+median+"<br />"+
		"Min: "+minimum+"<br /></p>";
	
}


//call the initialize function
window.onload = initialize(); //->
