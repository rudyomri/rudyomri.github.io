var aLayer = true, bLayer = true, cLayer = true;

var map;
var csvData; 
var markersLayer; 
var markersStyle;
var timestamp = 1951;
var scaleFactor = 2; 
var timerInterval = 500;
var timer;



function initialize() {
    setMap();
	setIU();
    var legendYear = document.getElementById("legendYear");
    legendYear.innerHTML = "<center><h1>" + timestamp + "<h1></center>";
};


function setIU(){
	var uiControl = L.Control.extend({
		initialize: function (foo, options) {
			L.Util.setOptions(this, options);
		element = foo.replace('#','');
		},
		onAdd: function (map) {
			return L.DomUtil.get(element);
		}
	});

	
	$('input#typeA:checkbox').on('change', function(){
		if($(this).is(':checked')){
			aLayer = true;
		} else {
			aLayer = false;
		}
		resetLayers();
		updateLayers();
	});
	$('input#typeB:checkbox').on('change', function(){
		if($(this).is(':checked')){
			bLayer = true;
		} else {
			bLayer = false;
		}
		resetLayers();
		updateLayers();
	});
	$('input#typeC:checkbox').on('change', function(){
		if($(this).is(':checked')){
			cLayer = true;
		} else {
			cLayer = false;
		}
		resetLayers();
		updateLayers();
	});
}

function setMap() {

var cloudmadeUrl = 'http://{s}.tiles.mapbox.com/v3/rudyohead.kg1aj92l/{z}/{x}/{y}.png',
    cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap. Imagery &copy; 2011 CloudMade.';

	var minimal   = L.tileLayer('http://{s}.tiles.mapbox.com/v3/rudyohead.kg1aj92l/{z}/{x}/{y}.png', {attribution: cloudmadeAttribution}),
    dark  = L.tileLayer('http://{s}.tiles.mapbox.com/v3/rudyohead.hf2di141/{z}/{x}/{y}.png', {attribution: cloudmadeAttribution}),
	light  = L.tileLayer('http://{s}.tiles.mapbox.com/v3/rudyohead.kk631id5/{z}/{x}/{y}.png', {attribution: cloudmadeAttribution}),
    labels = L.tileLayer('http://{s}.acetate.geoiq.com/tiles/acetate-labels/{z}/{x}/{y}.png', {attribution: cloudmadeAttribution});
	

	var baseMaps = {
    "Default": minimal,
    "Dark": dark,
	"Light": light
};

	var overlayMaps = {
    "Labels": labels,
};

	map = L.map('map', {
				center: new L.LatLng(49, -90),
				zoom: 4,
				layers: [minimal, labels]
	});


	L.control.layers(baseMaps, overlayMaps).addTo(map);
	processCSV();
	sequenceInteractions();
   	
};


function processCSV() {
    var processCSV = new ProcessCSV();
    var csv = 'data/csvData.csv';
    processCSV.addListener("complete", function() {
        csvData = processCSV.getCSV();
        createMarkers();
    });
    processCSV.process(csv);
};


function createMarkers() {
    var markerStyle = {
        color: 'red',
        fillColor: 'red',
        fillOpacity: 0.2,
    };
    var markersArray = [];
    for (var i = 0; i < csvData.length; i++) {
        var feature = {};
        feature.properties = csvData[i];
        var lat = Number(feature.properties.lat);
        var lng = Number(feature.properties.lon);
        var marker = L.circleMarker([lat, lng], markerStyle);
        marker.feature = feature;
        markersArray.push(marker);
    };
    markersLayer = L.featureGroup(markersArray);
    markersLayer.addTo(map);
    radiusArray = [];
    markersLayer.eachLayer(function(layer) {
        var radius = onEachFeature(layer); //->
        radiusArray.push(radius);
    });
    makeLegend(radiusArray);
    markersLayer.addTo(map);
	
	createRetrieveOptions()
	
};


function resetLayers(){	
	map.removeLayer(markersLayer);
	map.addLayer(markersLayer);
}

function onEachFeature(layer) {
	if(layer.feature.properties.type == 'typeA' && aLayer == true){
		layer.setRadius(radius);
	} else if (layer.feature.properties.type == 'typeB' && bLayer == true){
		layer.setRadius(radius);
	} else if (layer.feature.properties.type == 'typeC' && cLayer == true){
		layer.setRadius(radius);
	} else {
		map.removeLayer(layer);
	}
	
    var area = layer.feature.properties[timestamp] * scaleFactor;
    var radius = Math.sqrt(area / Math.PI);
    layer.setRadius(radius);
    
	
    var popupHTML = 
	"<i><b> " + layer.feature.properties.name + ", " + layer.feature.properties.state + "</i> in <i>" + timestamp + "</i></b>" +
	"<h5>Population: <b>" + layer.feature.properties[timestamp] + "000 people</b></h5>" + 
	"<h5>% change (1951-2011): <b>" + layer.feature.properties.percent + "%</b></h5>" 
	;
    
    layer.bindPopup(popupHTML, {
        offset: new L.Point(0, -radius)
    });
    layer.on({
        mouseover: function() {
            layer.openPopup();
            this.setStyle({
                radius: radius,
                color: 'blue',
                fillColor: 'blue',
				fillOpacity: 0.2
            });
        },
        mouseout: function() {
            layer.closePopup();
            this.setStyle({
                color: 'red',
                fillColor: 'red',
				fillOpacity: 0.2
            });
        }
    });
    return radius;
};


function updateLayers(){
	var legendYear = document.getElementById("legendYear");
    legendYear.innerHTML = "<center><h1>" + timestamp + "</h1></center>";
	var radiusArray = [];

	markersLayer.eachLayer(function(layer) {
		var r = onEachFeature(layer);
		radiusArray.push(r);
	});
}

function makeLegend(rArray) {
    var maxrad = Math.max.apply(null, rArray);
    var minrad = Math.min.apply(null, rArray);
    var midrad = (maxrad + minrad) / 2
    var legendArray = [maxrad, midrad, minrad];
    var container = document.getElementById("legend2");
    var mySvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    mySvg.setAttribute("version", "1.2");
    mySvg.setAttribute("baseProfile", "tiny");
    mySvg.setAttribute("height", "200px");
    mySvg.setAttribute("width", "100%");
    container.appendChild(mySvg);
    var c;
    var h = 40;
    for (var i = 0; i < legendArray.length; i++) {
        c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        c.setAttribute("cx", 40);
        c.setAttribute("cy", h);
        c.setAttribute("r", legendArray[i]);
        c.setAttribute("fill", "rgba(255, 0, 0, .2)");
        c.setAttribute("stroke", "rgba(255, 0, 0, .5)");
        c.setAttribute("stroke-width", 2);
        mySvg.appendChild(c);
        h += legendArray[i] * 2;
    };

    var maximum = Math.round((Math.pow(maxrad, 2) * Math.PI) / scaleFactor);
    var median = Math.round((Math.pow(midrad, 2) * Math.PI) / scaleFactor);
    var minimum = Math.round((Math.pow(minrad, 2) * Math.PI) / scaleFactor);
    var legendData = document.getElementById("legendData");
    legendData.innerHTML = "<br/>" + maximum + "000<br /><br/><br/><br/>" + +median + "000<br /><br/><br />" + +minimum + "000";
}

function sequenceInteractions() {
    $(".pause").hide();
    
    $(".play").click(function() {
        $(".pause").show();
        $(".play").hide();
        animateMap();
    });
    
    $(".pause").click(function() {
        $(".pause").hide();
        $(".play").show();
        stopMap();
    });
   
    $(".step").click(function() {
        step();
    });
   
    $(".step-full").click(function() {
        jump(2014); 
    });
	
	$("#temporalSlider").slider({
	min: 1876,
	max: 2011,
	step: 1,
	animate: "fast",
	slide: function(e, ui){
	stopMap();
	timestamp = ui.value;
	updateLayers();
	}
	});
	
    $(".back").click(function() {
        back();
    });
   
    $(".back-full").click(function() {
        jump(1951); 
    });
};


function animateMap() {
    timer = setInterval(function() {
        step();
    }, timerInterval);
};


function stopMap() {
    clearInterval(timer);
}
	

function back() {
    if (timestamp > 1951){ 
		timestamp-=10;
	} else {
		timestamp = 2011; 
	};
	updateLayers();
	updateSlider();
};


function step(){
	if (timestamp < 2011){ 
		timestamp+=10;
	} else {
		timestamp = 1951;
	};
	updateLayers();
	updateSlider();
}


function jump(t){
	
	timestamp = t;
	
	updateLayers();
	updateSlider();
}


function updateSlider(){
	$("#temporalSlider").slider("value",timestamp);
}


function createRetrieveOptions(){
	var cityName;
	markersLayer.eachLayer(function(layer){
		cityName =  layer.feature.properties.name;
		$("#retrieveOptions").append("<option value='"+cityName+"'>"+cityName+"</option>");
	});
	$("#retrieveOptions").attr('onchange', 'retrieveCity(this.value)');
}


function retrieveCity(inValue){
	markersLayer.eachLayer(function(layer){
		if (layer.feature.properties.name == inValue){
			map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 5);
			layer.openPopup();
		}
	});
}


window.onload = initialize();