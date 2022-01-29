"use strict";

import getData from "./getData.js";
import fetchCoords from "./fetchCoords.js";

// Geo Location
const latitude = document.getElementById("lat");
const longitude = document.getElementById("lon");
const mainTag = document.getElementById("coords");

// map via leaflet.js
const map = L.map('map').setView([0, 0], 3);

const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution }).addTo(map);

const placeMarker = (lat, lon, data) => {

  const myIcon = L.divIcon({
    html: `<img src="${data.weatherIconPath || "weather_icons/img_01d.png"}" /><span>${data.city}<span>`,
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

  const lat = Number(coords.latitude.toFixed(6));
  const lon = Number(coords.longitude.toFixed(6));

  latitude.textContent = lat;
  longitude.textContent = lon;

  const homePlace = await getData(lat, lon, "Home");

  placeMarker(homePlace.coords.lat, homePlace.coords.lon, homePlace);

  if (homePlace.city === "Home") {
    map.setView([homePlace.coords.lat, homePlace.coords.lon], 5);
  }

  const allPlaces = await fetch("/more-weather");

}, (err) => {
  console.error(err);
  console.log("Please allow location access!");
  mainTag.textContent = "Please allow location access 📍";
  mainTag.style.fontSize = "1.5rem";
}, {
  maximumAge: 180000,
  timeout: 5000,
  enableHighAccuracy: false
});
