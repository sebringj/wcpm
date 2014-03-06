$(window).load(function(){
	var map = new google.maps.Map($('#map')[0], {
		mapTypeControl: false,
		zoomControl: true,
		streetViewControl: false,
		zoom: 14,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});
	var initialLocation = new google.maps.LatLng(33.923156, -117.888935); //US position
	map.setCenter(initialLocation);
	var latlng = new google.maps.LatLng(33.923156, -117.888935);
	var marker = new google.maps.Marker({
      position: latlng,
      map: map,
      title: 'West Coast Prime Meats'
  	});
    google.maps.event.addListener(marker, 'click', function () {
        location = 'https://www.google.com/maps/dir//West+Coast+Prime+Meats,+344+Cliffwood+Park+St,+Brea,+CA+92821/@37.2691744,-119.306607,6z/data=!4m8!4m7!1m0!1m5!1m1!1s0x80dcd51a6c51edc9:0x1f7df92a1b9a26e!2m2!1d-117.888794!2d33.923077'
    });
});