function setDirection(route, directionsService, directionsDisplay) {
  var waypts = [];
  _.each(route.tracks, function(track) {
    if (track.end_city.name != route.end_city.name) {
      waypts.push({
        location: track.end_city.name,
        stopover: true
      });
    }
  });

  function calcRoute() {
    var origin      = new google.maps.LatLng(route.start_city.lat, route.start_city.lng);
    var destination = new google.maps.LatLng(route.end_city.lat, route.end_city.lng);
    var request = {
      origin:      origin,
      destination: destination,
      waypoints:   waypts,
      travelMode:  google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      }
    });
  }
  calcRoute();
  return directionsDisplay
}

function buildMap(callback) {
  handler = Gmaps.build('Google', { markers: { clusterer: undefined }});
  handler.buildMap({
  provider: {
    disableDefaultUI: true,
    zoomControl: true,
    scrollwheel: false,
    styles: [{ featureType: "road", elementType: "labels.icon", stylers: [{ visibility: "off" }] }]
  },
  internal: { id: 'map' } }, callback);
}

function mapWithDirectionsAndMarkers(routes, markers) {
  var directionsDisplays = [];
  var directionsService = new google.maps.DirectionsService();

  _.each(routes, function(route) {
    var directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true,
                                                                 preserveViewport: true });

    directionsDisplay = setDirection(route, directionsService, directionsDisplay)

    directionsDisplays.push(directionsDisplay)
  });

  buildMap(function(){
    _.each(directionsDisplays, function(directionsDisplay) {
      directionsDisplay.setMap(handler.getMap());
    });
    SeMarkers = handler.addMarkers(markers);
    handler.bounds.extendWith(SeMarkers);
    handler.fitMapToBounds();
  });
}

function mapWithDirections(route, markers) {
  var directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });
  var directionsService = new google.maps.DirectionsService();

  directionsDisplay = setDirection(route, directionsService, directionsDisplay)

  buildMap(function() {
    markers = handler.addMarkers(markers);
    directionsDisplay.setMap(handler.getMap());
  });
}
