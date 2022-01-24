"use strict";

// Geo Location
const latitude = document.getElementById("lat");
const longitude = document.getElementById("lon");
const weatherBtn = document.getElementById("get-weather");

navigator.geolocation.getCurrentPosition(async pos => {

  const coords = pos.coords;

  // console.log(coords);

  const lat = coords.latitude;
  const lon = coords.longitude;

  latitude.textContent = lat;
  longitude.textContent = lon;

  try {

    const res = await fetch(`/weather?lat=${lat}&lon=${lon}`);
    const data = await res.json();

    console.log(data);

  } catch (err) {
    console.warn(err);
  }

});