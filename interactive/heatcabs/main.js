var apiUrl = "https://api.data.gov.sg/v1/transport/taxi-availability";
var apiKey = "D1d2ksxbOfibGHhw30tqo1nWRnAKlx6W";
var apiAcc = "application/json";
var xhr = new XMLHttpRequest();
var map = L.map('map').setView([1.35, 103.85], 12);
var hexLayer;
window.toggle = false;

L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB',
    maxZoom: 14,
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
      var arrayflip = cabsArray[i][1];
      cabsArray[i][1] = cabsArray[i][0];
      cabsArray[i][0] = arrayflip;
      cabsArray[i].push(0.5);
  }

  heatLayer = L.heatLayer(cabsArray, {radius: 7, blur: 12}).addTo(map);

};

function toggleLayer() {
    if(!toggle) {
      map.removeLayer(heatLayer);
    } else {
      map.addLayer(heatLayer);
    }
    toggle = !toggle;
}


