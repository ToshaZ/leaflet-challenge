// Create a map object
var myMap = L.map("map", {
    center: [39, -97],
    zoom: 4
  });
  
  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

  //Call the URL and pass through a function
  var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

  d3.json(url).then(function(data) {

    console.log(data)
    console.log(data.features)

    var feature = data.features

    //Loop through each feature item and capture in a variable
    for (var i = 0; i < feature.length; i++) {

        var coordinates = feature[i].geometry.coordinates
        var place = feature[i].properties.place
        var time = feature[i].properties.time
        var mag = feature[i].properties.mag
        var depth = feature[i].geometry.coordinates[2]

    // console.log(depth)

   // Define a markerSize function that will give each record a different radius based on magnitude
    function markerSize(magnitude) {
    return magnitude * 20000;
   };
  
 
    // Determine color options for each depth grouping
    function markerColor(d){
        return d > 100 ? '#FF0000' :
        d > 50 ? '#FF4500' :
        d > 25 ? '#FF8C00' :
        d > 10 ? '#FFD700' :
        d > 1 ? '#FFFF10' :
        d < 1 ? '#32CD32' :
                '#9ACD32';

    };
   
    //Add markings and popup to map
    L.circle([coordinates[1], coordinates[0]], {
        fillOpacity: 0.75,
        color: "white",
        stroke: true,
        weight: 0.5,
        fillColor: markerColor(depth),
        radius: markerSize(mag)
       }). bindPopup("<h3>" + place + "</h3><hr><p>" + new Date(time) + "</p><hr><h3>Magnitude: " + mag + " <hr>Depth: " + depth + "</h3>").addTo(myMap);

  };

  // Set up the legend
  var legend = L.control({ position: "bottomright" })
  legend.onAdd = function (myMap) {
    var div = L.DomUtil.create("div", "info legend");
    var depthRange = [-2,1,10,25,50,100];
 
    // Loop through the intervals and generate a label 
    for (var i = 0; i < depthRange.length; i++) {
      div.innerHTML +=
      '<i style="background:' + markerColor(depthRange[i]) + '"></i> ' +
      depthRange[i] + (depthRange[i+1] ? '&ndash;' + depthRange[i+1] + '<br>': '+');
      
    }
    
    div.innerHTML += '<h3>Depth</h3>'; 

      return div;

  };

  // Adding legend to the map
  legend.addTo(myMap);

});