var apiUrl = "https://api.data.gov.sg/v1/transport/taxi-availability";
var apiKey = "D1d2ksxbOfibGHhw30tqo1nWRnAKlx6W";
var apiAcc = "application/json";
var xhr = new XMLHttpRequest();
var map = L.map('map').setView([1.35, 103.85], 12);
var hexLayer;
window.toggle = false;

L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB',
    maxZoom: 15,
    minZoom: 10,
}).addTo(map);

$.ajax({ 
  type: "GET",
  url: apiUrl, 
  dataType: "json",
  beforeSend: function(xhr) {
        xhr.setRequestHeader("api-key", apiKey);
        xhr.setRequestHeader("accept", apiAcc)  
     },
  success: result,
  error: function () {alert("Network error.");}
})

function result(data) {

  var options = {
    radius : 22,
    radiusRange : [10, 20],
    opacity: 0.4,
  };

  hexLayer = L.hexbinLayer(options).addTo(map)
  hexLayer.colorScale().range(['#ffffcc','#c7e9b4','#7fcdbb','#41b6c4','#2c7fb8','#253494']);

  if(data['features'] === undefined) { location.reload(); }

  var timedate1 = data["features"][0]["properties"]["timestamp"];
  var timedate2 = timedate1.replace('T','x').replace('+','x').split("x");
  var date = timedate2[0];
  var time = timedate2[1];

  document.getElementById("taxi-count").innerHTML = data["features"][0]["properties"]["taxi_count"];
  document.getElementById("date-count").innerHTML = date;
  document.getElementById("time-count").innerHTML = time;

  cabsArray = data["features"][0]["geometry"]["coordinates"];

  for(var i in cabsArray) {
      var arrayflip = cabsArray[i][0];
      cabsArray[i][0] = cabsArray[i][1];
      cabsArray[i][0] = arrayflip;
  }

  hexLayer.data(cabsArray);

  hexLayer.dispatch()
  .on('mouseover', function(d, i) {
    document.getElementById("hex-count").innerHTML = '<b>' + d.length + '</b> CABS HERE';
    //d3.select(i).style("stroke", "#000")
  })
  .on('mouseout', function(d, i) {
    document.getElementById("hex-count").innerHTML = '<b>0</b> CABS HERE';
    //d3.select(i).style("stroke", "#fff")
  })
};

function toggleLayer() {
    if(!toggle) {
      map.removeLayer(hexLayer);
    } else {
      map.addLayer(hexLayer);
    }
    toggle = !toggle;
}


