"use strict";

import getData from "./getData.js";

// Geo Location
const latitude = document.getElementById("lat");
const longitude = document.getElementById("lon");

const map = L.map('map').setView([0, 0], 3);

const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution }).addTo(map);

navigator.geolocation.getCurrentPosition(async pos => {

  const coords = pos.coords;
  // console.log(coords);

  const lat = coords.latitude;
  const lon = coords.longitude;

  latitude.textContent = lat.toFixed(4);
  longitude.textContent = lon.toFixed(4);

  const data = await getData(lat, lon);
  console.log(data);

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
    </p>
  `);

  map.setView([lat, lon], 5);

}, (err) => console.error(err));