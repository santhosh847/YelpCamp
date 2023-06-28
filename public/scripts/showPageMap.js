mapboxgl.accessToken = mapboxToken;
const map = new mapboxgl.Map({
	container: "map", // container ID
	// Choose from Mapbox's core styles, or make your own style with Mapbox Studio
	style: "mapbox://styles/mapbox/streets-v12", // style URL
	center: campground.geometry.coordinates, // starting position [lng, lat]
	zoom: 8, // starting zoom
});

const marker = new mapboxgl.Marker({
	color: "#EA4335",
})
	.setLngLat(campground.geometry.coordinates)
	.setPopup(
		new mapboxgl.Popup({
			offset: 25,
		}).setHTML(`<h4>${campground.title}</h4><p>${campground.location}</p>`)
	)
	.addTo(map);

map.addControl(new mapboxgl.NavigationControl());
