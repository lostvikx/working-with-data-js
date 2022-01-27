"use strict";

import getData from "./getData.js";

// Geo Location
const latitude = document.getElementById("lat");
const longitude = document.getElementById("lon");
const weatherBtn = document.getElementById("get-weather");

navigator.geolocation.getCurrentPosition( async pos => {

  const coords = pos.coords;
  // console.log(coords);

  const lat = coords.latitude;
  const lon = coords.longitude;

  latitude.textContent = lat.toFixed(4);
  longitude.textContent = lon.toFixed(4);

  const data = await getData(lat, lon);
  console.log(data);

});
