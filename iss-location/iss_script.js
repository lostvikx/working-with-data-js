// Create a map, rm canvas if err
const map = L.map("map", { renderer: L.canvas() }).setView([0, 0], 1);
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution }).addTo(map);

// Marker
const ISS_icon = L.icon({
  iconUrl: "iss_marker.png",
  iconSize: [50, 50],
  iconAnchor: [25, 25],
  popupAnchor: [-5, -75],
});

const marker = L.marker([0, 0], { icon: ISS_icon })
  .addTo(map)
  .bindPopup('International Space Station');

const iss_url = "https://api.wheretheiss.at/v1/satellites/25544";

// Get ISS location data
async function getData() {

  const res = await fetch(iss_url);

  const data = await res.json();

  const { altitude, latitude, longitude, visibility } = data;

  // console.log(data);

  // set the lat and lng of marker
  marker.setLatLng([latitude, longitude]);
  map.setView([latitude, longitude], 3);

  document.getElementById("lat").textContent = latitude.toFixed(2);
  document.getElementById("lon").textContent = longitude.toFixed(2);
  document.getElementById("alt").textContent = altitude.toFixed(2);
  document.getElementById("units").textContent = data.units;
  document.getElementById("vis").textContent = visibility;

}

getData();
const intervalId = setInterval(getData, 10000);