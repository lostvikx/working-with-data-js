"use strict";

import getData from "./getData.js";
import fetchCoords from "./fetchCoords.js";

// Geo Location
const latitude = document.getElementById("lat");
const longitude = document.getElementById("lon");

const map = L.map('map').setView([0, 0], 3);

const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution }).addTo(map);

const placeMarker = (lat, lon, data) => {

  const myIcon = L.divIcon({
    html: `<img src="${data.weatherIconPath}" /><span>${data.city}<span>`,
    iconAnchor: [25, 25],
    popupAnchor: [35, -5],
  });

  const your_marker = L.marker([lat, lon], {
    keyboard: true,
    icon: myIcon
  }).addTo(map);
  your_marker.bindPopup(`
    <p class="data">
      <b>City:</b> ${data.city}<br />
      <b>Temperature:</b> ${data.temp}°C<br />
      <b>Humidity:</b> ${data.humidity}%<br />
      <b>Air Quality:</b> ${data.airQuality} ${data.airQualityUnit}<br />
      <b>Wind Speed:</b> ${data.windSpeed} km/hr<br />
      <b>Data Last Updated:</b> ${data.lastUpdated || "No data"}
    </p>
  `);

}

navigator.geolocation.getCurrentPosition(async pos => {

  const coords = pos.coords;
  // console.log(coords);

  const lat = Number(coords.latitude.toFixed(6));
  const lon = Number(coords.longitude.toFixed(6));

  latitude.textContent = lat;
  longitude.textContent = lon;

  const allLocationsWithCoords = await fetchCoords("../json/location-coords.json");

  allLocationsWithCoords.push({
    location: "Home",
    coords: { lat, lon }
  });

  // console.log(allLocationsWithCoords);

  const allLocPromises = allLocationsWithCoords
    .map(async ({ location, coords }) => getData(coords.lat, coords.lon, location));

  const data = await Promise.all(allLocPromises);
  // console.log(data);

  for (const place of data) {

    placeMarker(place.coords.lat, place.coords.lon, place);

    if (place.city == "Home") {
      map.setView([place.coords.lat, place.coords.lon], 5);
    }

  }

}, (err) => console.error(err));