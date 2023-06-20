let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url).then(function (data) {
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
  }

  function getColor(depth) {
    return depth >= 90 ? "#eb5e28" :
      depth >= 70 ? "#f9a03f" :
      depth >= 50 ? "#f3c053" :
      depth >= 30 ? "#FFEDA0" :
      depth >= 10 ? "#87a330" :
      depth >= -10 ? "#6a8532" :
      "#008000";
  }

  function style(feature) {
    return {
      radius: feature.properties.mag * 4,
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 1
    };
  }

  let earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: style,
    onEachFeature: onEachFeature
  });

  createMap(earthquakes);
}

function createMap(earthquakes) {
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  let baseMaps = {
    "Street Map": street
  };

  let overlayMaps = {
    Earthquakes: earthquakes
  };

  let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [street, earthquakes]
  });

  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "legend");
    div.style.backgroundColor = "white";
    div.innerHTML += '<i style="background: #eb5e28; color: white;">  90+  </i><br>';
    div.innerHTML += '<i style="background: #f9a03f; color: white;">  70-90  </i><br>';
    div.innerHTML += '<i style="background: #f3c053; color: white;">  50-70  </i><br>';
    div.innerHTML += '<i style="background: #FFEDA0; color: white;">  30-50  </i><br>';
    div.innerHTML += '<i style="background: #87a330; color: white;">  10-30  </i><br>';
    div.innerHTML += '<i style="background: #6a8532; color: white;">  -10-10  </i><br>';
  
    return div;
  };
  

  legend.addTo(myMap);

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
