var aLayer = false;
bLayer = false;
cLayer = false;
dLayer = false;
eLayer = false;
fLayer = false;
gLayer = false;
hLayer = false;
iLayer = false;
lLayer = false;
jLayer = true;
mLayer = false;
nLayer = false;
oLayer = false;
pLayer = false;
var map;
var csvData;
var markersLayer;
var markersStyle;
var timestamp = 1951;
var scaleFactor = 2;
var timerInterval = 500;
var timer;
var checkboxes = document.getElementsByTagName('input');
for (var i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].type == 'checkbox') {
        checkboxes[i].checked = false;
    }
}

function initialize() {
    setMap();
    setIU();
};

function setIU() {
    var uiControl = L.Control.extend({
        initialize: function(foo, options) {
            L.Util.setOptions(this, options);
            element = foo.replace('#', '');
        },
        onAdd: function(map) {
            return L.DomUtil.get(element);
        }
    });
    $('input#typeJ:checkbox').prop('checked', true);
    $('input#typeA:checkbox').on('change', function() {
        if ($(this).is(':checked')) {
            $('input#typeJ:checkbox').prop('checked', false);
            aLayer = true;
        } else {
            aLayer = false;
        }
        resetLayers();
        updateLayers();
    });
    $('input#typeB:checkbox').on('change', function() {
        if ($(this).is(':checked')) {
            $('input#typeJ:checkbox').prop('checked', false);
            bLayer = true;
        } else {
            bLayer = false;
        }
        resetLayers();
        updateLayers();
    });
    $('input#typeC:checkbox').on('change', function() {
        if ($(this).is(':checked')) {
            $('input#typeJ:checkbox').prop('checked', false);
            cLayer = true;
        } else {
            cLayer = false;
        }
        resetLayers();
        updateLayers();
    });
    $('input#typeD:checkbox').on('change', function() {
        if ($(this).is(':checked')) {
            $('input#typeJ:checkbox').prop('checked', false);
            dLayer = true;
        } else {
            dLayer = false;
        }
        resetLayers();
        updateLayers();
    });
    $('input#typeE:checkbox').on('change', function() {
        if ($(this).is(':checked')) {
            $('input#typeJ:checkbox').prop('checked', false);
            eLayer = true;
        } else {
            eLayer = false;
        }
        resetLayers();
        updateLayers();
    });
    $('input#typeF:checkbox').on('change', function() {
        if ($(this).is(':checked')) {
            $('input#typeJ:checkbox').prop('checked', false);
            fLayer = true;
        } else {
            fLayer = false;
        }
        resetLayers();
        updateLayers();
    });
    $('input#typeG:checkbox').on('change', function() {
        if ($(this).is(':checked')) {
            $('input#typeJ:checkbox').prop('checked', false);
            gLayer = true;
        } else {
            gLayer = false;
        }
        resetLayers();
        updateLayers();
    });
    $('input#typeH:checkbox').on('change', function() {
        if ($(this).is(':checked')) {
            $('input#typeJ:checkbox').prop('checked', false);
            hLayer = true;
        } else {
            hLayer = false;
        }
        resetLayers();
        updateLayers();
    });
    $('input#typeI:checkbox').on('change', function() {
        if ($(this).is(':checked')) {
            $('input#typeJ:checkbox').prop('checked', false);
            iLayer = true;
        } else {
            iLayer = false;
        }
        resetLayers();
        updateLayers();
    });
    $('input#typeL:checkbox').on('change', function() {
        if ($(this).is(':checked')) {
            lLayer = true;
            $('input#typeJ:checkbox').prop('checked', false);
        } else {
            lLayer = false;
        }
        resetLayers();
        updateLayers();
    });
    $('input#typeM:checkbox').on('change', function() {
        if ($(this).is(':checked')) {
            mLayer = true;
            $('input#typeJ:checkbox').prop('checked', false);
        } else {
            mLayer = false;
        }
        resetLayers();
        updateLayers();
    });
    $('input#typeO:checkbox').on('change', function() {
        if ($(this).is(':checked')) {
            $('input#typeJ:checkbox').prop('checked', false);
            oLayer = true;
        } else {
            oLayer = false;
        }
        resetLayers();
        updateLayers();
    });
	 $('input#typeP:checkbox').on('change', function() {
        if ($(this).is(':checked')) {
            $('input#typeJ:checkbox').prop('checked', false);
            pLayer = true;
        } else {
            pLayer = false;
        }
        resetLayers();
        updateLayers();
    });
    $('input#typeJ:checkbox').on('change', function() {
        if ($(this).is(':checked')) {
            aLayer = false;
            bLayer = false;
            cLayer = false;
            dLayer = false;
            eLayer = false;
            fLayer = false;
            gLayer = false;
            hLayer = false;
            iLayer = false;
            jLayer = true;
            lLayer = false;
            mLayer = false;
            nLayer = false;
            oLayer = false;
			pLayer = false;
            $('input#typeA:checkbox').prop('checked', false);
            $('input#typeB:checkbox').prop('checked', false);
            $('input#typeC:checkbox').prop('checked', false);
            $('input#typeD:checkbox').prop('checked', false);
            $('input#typeE:checkbox').prop('checked', false);
            $('input#typeF:checkbox').prop('checked', false);
            $('input#typeG:checkbox').prop('checked', false);
            $('input#typeH:checkbox').prop('checked', false);
            $('input#typeI:checkbox').prop('checked', false);
            $('input#typeL:checkbox').prop('checked', false);
            $('input#typeM:checkbox').prop('checked', false);
            $('input#typeN:checkbox').prop('checked', false);
            $('input#typeO:checkbox').prop('checked', false);
			$('input#typeP:checkbox').prop('checked', false);
        } else {
            jLayer = false;
        }
        resetLayers();
        updateLayers();
    });
}

function setMap() {
    var acetateAttribution = 'Acetate tileset from GeoIQ';
    var light = L.tileLayer('https://a.tiles.mapbox.com/v3/rudyohead.hf2dlb3i/{z}/{x}/{y}.png', {
        attribution: acetateAttribution
    }),
        dark = L.tileLayer('https://a.tiles.mapbox.com/v3/rudyohead.hf2di141/{z}/{x}/{y}.png', {
            attribution: acetateAttribution
        }),
        mapbox = L.tileLayer('https://a.tiles.mapbox.com/v3/uwmadison-ucomm.uwmm/{z}/{x}/{y}.png', {
            attribution: acetateAttribution
        }),
        satellite = L.tileLayer('https://a.tiles.mapbox.com/v3/uwmadison-ucomm.madison_aerial/{z}/{x}/{y}.png', {
            attribution: acetateAttribution
        }),
        labels = L.tileLayer('http://{s}.acetate.geoiq.com/tiles/acetate-labels/{z}/{x}/{y}.png', {
            attribution: acetateAttribution
        });
    var southWest = L.latLng(42.8, -89.6),
        northEast = L.latLng(43.6, -89.0),
        bounds = L.latLngBounds(southWest, northEast);
    map = L.map('map', {
        center: new L.LatLng(43.0755, -89.409),
        zoom: 15,
        minZoom: 14,
        layers: [mapbox],
        maxBounds: bounds
    });
    var baseMaps = {
        "Satellite": satellite,
        "Dark": dark,
        "Light": light,
        "Default": mapbox
    };
    var overlayMaps = {};
    zoomControl = L.control.zoom()
    layerControl = L.control.layers(baseMaps, overlayMaps, {
        position: 'topleft'
    });
    layerControl.addTo(map);
    zoomControl.addTo(map);
    processCSV();
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
        color: 'crimson',
        fillColor: 'crimson',
        fillOpacity: 0.6,
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

function resetLayers() {
    map.removeLayer(markersLayer);
    map.addLayer(markersLayer);
}

function onEachFeature(layer) {
	
    if (layer.feature.properties.cblocal == 'typeA' && aLayer == true) {
        layer.setRadius(radius);
    } else {
        if (layer.feature.properties.cblocal == '0' && aLayer == true) {
            map.removeLayer(layer);
        }
    }
    if (layer.feature.properties.cbfairtrade == 'typeB' && bLayer == true) {
        layer.setRadius(radius);
    } else {
        if (layer.feature.properties.cbfairtrade == '0' && bLayer == true) {
            map.removeLayer(layer);
        }
    }
    if (layer.feature.properties.cbvegetarian == 'typeC' && cLayer == true) {
        layer.setRadius(radius);
    } else {
        if (layer.feature.properties.cbvegetarian == '0' && cLayer == true) {
            map.removeLayer(layer);
        }
    }
    if (layer.feature.properties.cbcomposting == 'typeD' && dLayer == true) {
        layer.setRadius(radius);
    } else {
        if (layer.feature.properties.cbcomposting == '0' && dLayer == true) {
            map.removeLayer(layer);
        }
    }
    if (layer.feature.properties.cbrecycling == 'typeE' && eLayer == true) {
        layer.setRadius(radius);
    } else {
        if (layer.feature.properties.cbrecycling == '0' && eLayer == true) {
            map.removeLayer(layer);
        }
    }
    if (layer.feature.properties.cbcreusable == 'typeF' && fLayer == true) {
        layer.setRadius(radius);
    } else {
        if (layer.feature.properties.cbreusable == '0' && fLayer == true) {
            map.removeLayer(layer);
        }
    }
    if (layer.feature.properties.cbencreusable == 'typeG' && gLayer == true) {
        layer.setRadius(radius);
    } else {
        if (layer.feature.properties.cbencreusable == '0' && gLayer == true) {
            map.removeLayer(layer);
        }
    }
    if (layer.feature.properties.cbcoffee == 'typeH' && hLayer == true) {
        layer.setRadius(radius);
    } else {
        if (layer.feature.properties.cbcoffee == '0' && hLayer == true) {
            map.removeLayer(layer);
        }
    }
    if (layer.feature.properties.cbicecream == 'typeI' && iLayer == true) {
        layer.setRadius(radius);
    } else {
        if (layer.feature.properties.cbicecream == '0' && iLayer == true) {
            map.removeLayer(layer);
        }
    }
    if (layer.feature.properties.cbrest == 'typeL' && lLayer == true) {
        layer.setRadius(radius);
    } else {
        if (layer.feature.properties.cbrest == '0' && lLayer == true) {
            map.removeLayer(layer);
        }
    }
    if (layer.feature.properties.cbmarket == 'typeM' && mLayer == true) {
        layer.setRadius(radius);
    } else {
        if (layer.feature.properties.cbmarket == '0' && mLayer == true) {
            map.removeLayer(layer);
        }
    }
    if (layer.feature.properties.cbdining == 'typeO' && oLayer == true) {
        layer.setRadius(radius);
    } else {
        if (layer.feature.properties.cbdining == '0' && oLayer == true) {
            map.removeLayer(layer);
        }
    }
	if (layer.feature.properties.cbother == 'typeP' && pLayer == true) {
        layer.setRadius(radius);
    } else {
        if (layer.feature.properties.cbother == '0' && pLayer == true) {
            map.removeLayer(layer);
        }
    }
    if (layer.feature.properties.cball == 'typeJ' && jLayer == true) {
        layer.setRadius(radius);
    } else {
        if (layer.feature.properties.cball == 'typeJ' && aLayer == false && bLayer == false && cLayer == false && dLayer == false && eLayer == false && fLayer == false && gLayer == false && hLayer == false && iLayer == false && lLayer == false && mLayer == false && nLayer == false && oLayer == false && pLayer == false) {
            map.removeLayer(layer);
        }
    }
    var area = layer.feature.properties[timestamp] * scaleFactor;
    var radius = Math.sqrt(area / Math.PI);
    layer.setRadius(radius);
    var popupHTML = "<h4><i><b> " + layer.feature.properties.name + "</i></b></h4><h5>" + layer.feature.properties.address + " | <a href=" + layer.feature.properties.reviews + "> <b>More info</b></a><br><br>" + "<img src=" + layer.feature.properties.local + ">" + "<img src=" + layer.feature.properties.fairtrade + ">" + "<img src=" + layer.feature.properties.vegetarian + ">" + "<img src=" + layer.feature.properties.composting + ">" + "<img src=" + layer.feature.properties.recycling + ">" + "<img src=" + layer.feature.properties.reusable + ">" + "<img src=" + layer.feature.properties.encreusable + ">" + "<img src=" + layer.feature.properties.coffee + ">" + "<img src=" + layer.feature.properties.icecream + "></h5>";
    layer.bindPopup(popupHTML, {
        offset: new L.Point(0, -radius)
    });
    layer.on({
        mouseover: function() {
            layer.openPopup();
            this.setStyle({
                radius: radius,
                color: 'red',
                fillColor: 'red',
                fillOpacity: 1.0
            });
        },
        mouseout: function() {
            this.setStyle({
                color: 'crimson',
                fillColor: 'crimson',
                fillOpacity: 0.6
            });
        }
    });
    return radius;
};

function updateLayers() {
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
    var mySvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    mySvg.setAttribute("version", "1.2");
    mySvg.setAttribute("baseProfile", "tiny");
    mySvg.setAttribute("height", "200px");
    mySvg.setAttribute("width", "100%");
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
}

function createRetrieveOptions() {
    var cityName;
    markersLayer.eachLayer(function(layer) {
        cityName = layer.feature.properties.name;
        $("#retrieveOptions").append("<option value='" + cityName + "'>" + cityName + "</option>");
    });
    $("#retrieveOptions").attr('onchange', 'retrieveCity(this.value)');
}

function retrieveCity(inValue) {
    markersLayer.eachLayer(function(layer) {
        if (layer.feature.properties.name == inValue) {
            map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 18);
            layer.openPopup();
        }
    });
}
window.onload = initialize();