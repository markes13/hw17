// Store our API endpoint as queryUrl
var queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Using the features array sent back in the API data, create a GeoJSON layer and add it to the map
  console.log(data)
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  function onEachFeature(feature, layer) {
    var marker = layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" +
      new Date(feature.properties.time) + "</p>" + "<h3>" + feature.properties.mag + " magnitude </h3>");
  }

  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
    	return L.circleMarker(latlng, {
    		radius: feature.properties.mag * 7,
    		fillColor: 'red',
    		fillOpacity: 0.65,
    		color:'white'

    	})
    }
  });

  createMap(earthquakes);
}

function createMap(earthquakes) {
  // Define lightmap and darkmap layers
  var lightmap = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?' +
  	'access_token=pk.eyJ1Ijoia2V2aW91cyIsImEiOiJjamVscnRoMHgxZG00MnFwaGF0NHdtMWRmIn0.sJ61-JAqVfCK0774RrsZHw');

  var darkmap = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?' +
  	'access_token=pk.eyJ1Ijoia2V2aW91cyIsImEiOiJjamVscnRoMHgxZG00MnFwaGF0NHdtMWRmIn0.sJ61-JAqVfCK0774RrsZHw');

  var satmap = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?' + 
  	'access_token=pk.eyJ1Ijoia2V2aW91cyIsImEiOiJjamVscnRoMHgxZG00MnFwaGF0NHdtMWRmIn0.sJ61-JAqVfCK0774RrsZHw');

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Light Map": lightmap,
    "Dark Map": darkmap,
    "Satellite Map": satmap
  };

  var overlayMaps = {
    Earthquakes: earthquakes
  }

  // Create a new map
  var myMap = L.map("map", {
    center: [
      39, -105
    ],
    zoom: 3,
    layers: [lightmap, earthquakes]
  });

  // Create a layer control containing our baseMaps
  // Be sure to add an overlay Layer containing the earthquake GeoJSON
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}