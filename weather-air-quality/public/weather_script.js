"use strict";

// Geo Location
const latitude = document.getElementById("lat");
const longitude = document.getElementById("lon");
const weatherBtn = document.getElementById("get-weather");

const info = {};

navigator.geolocation.getCurrentPosition(async pos => {

  const coords = pos.coords;

  // console.log(coords);

  const lat = coords.latitude;
  const lon = coords.longitude;

  latitude.textContent = lat.toFixed(4);
  longitude.textContent = lon.toFixed(4);

  try {

    const res = await fetch(`/weather?lat=${lat}&lon=${lon}`);
    const data = await res.json();

    console.log(data);

    const temp_info = data[0];
    console.log("temp:", temp_info.main.temp);
    console.log("humidity:", temp_info.main.humidity);
    console.log("wind speed:", temp_info.wind.speed);

    // results are sorted by nearest
    const air_quality = data[1].results[0];
    console.log("city:", air_quality.city);
    const first_measurement = air_quality.measurements[0]
    console.log(`air quality: ${first_measurement.value} (${first_measurement.parameter})`);
    console.log("lastUpdated:", new Date(first_measurement.lastUpdated).toLocaleString());

    

  } catch (err) {
    console.warn(err);
  }

});