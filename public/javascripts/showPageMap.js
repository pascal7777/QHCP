mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v12", // stylesheet location
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 6, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 15 }).setHTML(
      `<h3>${campground.name}</h3><p>${campground.facility_type}</p>`
    )
  )
  .addTo(map);
