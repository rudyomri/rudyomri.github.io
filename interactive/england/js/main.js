var keyArray = ["Cattle", "Horses", "Pigs", "Lambs", "Goats", "Poultry"]
var expressed = keyArray[0];

var min = 0;
var mid = +50;
var max = +100;

var legend = d3.scale
			   .linear()
			   .domain([min, mid, max])
			   .range([	"#ADDD8E","#41AB5D","#005A32"]);
					   
for(var i=min;i<=max;i++) {
		  $("#legend" ).append('<td bgcolor="' +legend(i)+ '" height="10" width="5"></td>');
		};
		
function initialize(){
	setMap();
};


function setMap(){

	var width = 1025;
	var height = 880;
	
	var map = d3.select("map")
		.append("svg")
		.attr("width", width)
		.attr("height", height);

	var projection = d3.geo.albers()
		.center([-6.1, 52.7])
		.rotate([0, 0])
		.parallels([43, 82])
		.scale(5900)
		.translate([width / 2, height / 2]);

	var path = d3.geo.path()
		.projection(projection);

	var graticule = d3.geo.graticule()
		.step([10, 10]); 
		
	var gratBackground = map.append("path")
		.datum(graticule.outline) 
		.attr("class", "background") 
		.attr("d", path) 

	var gratLines = map.selectAll(".graticule") 
		.data(graticule.lines)
		.enter() 
		.append("path")
		.attr("class", "graticule")
		.attr("d", path); 
	
	d3.csv("data/lab3_data.csv", function(csvData){ 
		var recolorMap = colorScale(csvData);
		drawPcp(csvData);
		
		d3.json("data/england.json", function(error,europe){ 

			var jsonProvs = europe.objects.EnglandCounties.geometries;

			for (var i=0; i<csvData.length; i++) {
				var csvProvince = csvData[i];
				var csvAdm1 = csvProvince.ADMIN2_ID; 

				for (var a=0; a<jsonProvs.length; a++){
					if (jsonProvs[a].properties.ADMIN2_ID == csvAdm1){
							for (var b=0; b<keyArray.length; b++){
								var key = keyArray[b];
								var val = parseFloat(csvProvince[key]);
								jsonProvs[a].properties[key] = val;
							};

					jsonProvs[a].properties.ADMIN_NAME = csvProvince.ADMIN_NAME; 
					break;
			};
		};
	};

			var countries = map.append("path") 
				.datum(topojson.object(europe, europe.objects.EuropeCountries))
				.attr("class", "countries")
				.attr("d", path);
					
			var provinces = map.selectAll(".counties")
				.data(topojson.object(europe, europe.objects.EnglandCounties).geometries) 
				.enter() 
				.append("path")
				.attr("id", function(d) { return d.properties.ADMIN2_ID})
				.attr("class", "provinces") 
				.attr("d", path) 
				.style("fill", function(d) {
					return choropleth(d, recolorMap);
				})
				// .on("click",click);
				.on("mouseover", highlight)
				.on("mouseout", dehighlight)
				.on("mousemove", moveLabel)
				.append("desc") 
					.text(function(d) {
						return choropleth(d, recolorMap);
					});
		});
	});
}

function colorScale(csvData){
	var color = d3.scale.quantile() 
	.range([
		"#ADDD8E",
		"#78C679",
		"#41AB5D",
		"#238443",
		"#005A32"
	]);

	color.domain([
		d3.min(csvData, function(d) { return Number(d[expressed]); }),
		d3.max(csvData, function(d) { return Number(d[expressed]); }),
		
	]);
	
	var minval = d3.min(csvData, function(d) { return Number(d[expressed]); });
	var maxval = d3.max(csvData, function(d) { return Number(d[expressed]); });
	var mid = d3.mean(csvData, function(d) { return Number(d[expressed]); });
	
	var midval = mid.toPrecision(3)
	
	$("#minVal" ).html("Min: <b>" + (minval) + "%</b>");
	$("#midVal" ).html("Mean: <b>" + (midval) + "%</b>");
	$("#maxVal" ).html("Max: <b>" + (maxval) + "%</b>");
	
	return color;
	
};

function choropleth(d, recolorMap){
	var value = d.properties[expressed];

	if (value) {
		return recolorMap(value);
			} else {
		return "#ccc";
		};
};

function drawPcp(csvData){
	var width = 500;
	var height = 780;

	var keys = [], attributes = [];

	for (var key in csvData[0]){
		keys.push(key);
		};

	for (var i=2; i<keys.length; i++){
	attributes.push(keys[i]);
	};

	var coordinates = d3.scale.ordinal() 
		.domain(attributes) 
		.rangePoints([0, width]); 

	var axis = d3.svg.axis()
		.orient("left");
	
	scales = {}; 
	attributes.forEach(function(att){ 
		 scales[att] = d3.scale.linear() 
			 .domain(d3.extent(csvData, function(data){ 
	return +data[att]; 
	}))
			 .range([height, 0]); 
	});

	var line = d3.svg.line(); 

	var pcplot = d3.select("map")
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("class", "pcplot") 
		.append("g") 
		.attr("transform", d3.transform( 
		"scale(0.8, 0.6),"+ 
		"translate(96, 50)")); 

	var pcpBackground = pcplot.append("rect") 
		.attr("x", "-25")
		.attr("y", "-40")
		.attr("width", "550")
		.attr("height", "850")
		.attr("rx", "15")
		.attr("ry", "15")
		.attr("class", "pcpBackground");


	var pcpLines = pcplot.append("g") 
		.attr("class", "pcpLines") 
		.selectAll("path") 
		.data(csvData)
		.enter()
		.append("path") 
		.attr("id", function(d){
	return d.ADMIN2_ID; 
	})
		.attr("d", function(d){
	return line(attributes.map(function(att){ 
	return [coordinates(att), scales[att](d[att])]; 
	}));
	})
		.on("mouseover", highlight)
		.on("mouseout", dehighlight)
		.on("mousemove", moveLabel);

	var axes = pcplot.selectAll(".attribute") 
		.data(attributes) 
		.enter() 
		.append("g") 
		.attr("class", "axes")
		.attr("transform", function(d){
	return "translate("+coordinates(d)+")"; 
	})
		.each(function(d){ 
	d3.select(this) 
		.call(axis 
		.scale(scales[d]) 
		.ticks(0)
		.tickSize(0) 
	)
		.attr("id", d) 
		.style("stroke-width", "9px") 
		.on("click", function(){ 
	sequence(this, csvData);
	});	
	});

	
	pcplot.select("#"+expressed)
	.style("stroke-width", "18px")
	};


function highlight(data){
	var props = datatest(data); 
	console.log(props);
	d3.select("#"+props.ADMIN2_ID) 
		.style("fill", "#000"); 

	d3.selectAll(".pcpLines")
		.select("#"+props.ADMIN2_ID)
		.style("stroke","#F0F007");
	
	var labelAttribute = "<h1>"+props[expressed]+"% </h1><br><b>"+expressed+"</b>";
	var labelPercentage ="<h1>"+props
	var labelName = props.ADMIN_NAME; 

	var infolabel = d3.select("map").append("div")
		.attr("class", "infolabel") 
		.attr("id", props.ADMIN2_ID+"label") 
		.html(labelAttribute) 
		.append("div") 
		.attr("class", "labelname") 
		.html("| " + labelName); 
};


function datatest(data){
	if (data.properties){ 
		return data.properties;
	} else { 
		return data;
	};
};

function dehighlight(data){
	var props = datatest(data);	

	var prov = d3.select("#"+props.ADMIN2_ID); 
	var fillcolor = prov.select("desc").text(); 
	prov.style("fill", fillcolor);

	d3.selectAll(".pcpLines") 
	.select("#"+props.ADMIN2_ID)
	.style("stroke","#005A32");

	d3.select("#"+props.ADMIN2_ID+"label").remove();
};

function moveLabel() {
	var x = d3.event.clientX-390;
	var y = d3.event.clientY-85;

	d3.select(".infolabel") 
		.style("margin-left", x+"px") 
		.style("margin-top", y+"px"); 
};

function sequence(axis, csvData){
	d3.selectAll(".axes") 
		.style("stroke-width", "9px");
	axis.style.strokeWidth = "18px"; 

	expressed = axis.id; 

	d3.selectAll(".provinces") 
		.style("fill", function(d) {
	return choropleth(d, colorScale(csvData)); 
	})
		.select("desc") 
		.text(function(d) {
	return choropleth(d, colorScale(csvData));
	});
};

window.onload = initialize();
