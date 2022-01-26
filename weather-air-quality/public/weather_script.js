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

    if (temp_info.failed) {

      console.log(temp_info.message);
      info.tempDataFailed = true;

    } else {

      info.temp = temp_info.main.temp;
      info.humidity = temp_info.main.humidity;
      info.windSpeed = temp_info.wind.speed;

    }

    const air_info = data[1];

    if (air_info.failed) {

      console.log(air_info.message);
      info.airDataFailed = true;

    } else {

      // results are sorted by nearest
      const air_quality = air_info.results[0];
      const first_measurement = air_quality.measurements.filter(reading => reading.parameter === "pm10")[0];

      // console.log(first_measurement);

      info.location = air_quality.location;
      info.city = air_quality.city;
      info.airQuality = first_measurement.value;
      info.airQualityUnit = first_measurement.unit || "µg/m³";
      info.lastUpdated = new Date(first_measurement.lastUpdated).toLocaleString();

    }

    console.log(info);

  } catch (err) {
    console.error(err);
    console.warn("All promises failed!");
  }

});
