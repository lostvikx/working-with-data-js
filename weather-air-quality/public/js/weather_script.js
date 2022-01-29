"use strict";

import getData from "./getData.js";
import { setLocalData, getLocalData } from "./userLocalStorage.js";

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

const userCoords = getLocalData("userCoords");
const userCoordsData = getLocalData("userCoordsData");

const plotUserData = async (lat, lon, storedLocally) => {

  let homeCoordsData = null;

  if (storedLocally) {
    homeCoordsData = getLocalData("userCoordsData");
  } else {
    homeCoordsData = await getData(lat, lon, "Home");
  }

  // const homeCoordsData = await getData(lat, lon, "Home");

  placeMarker(homeCoordsData.coords.lat, homeCoordsData.coords.lon, homeCoordsData);

  if (homeCoordsData.city === "Home") {
    map.setView([homeCoordsData.coords.lat, homeCoordsData.coords.lon], 4);
  }

  return homeCoordsData;

}

const plotAllUsersData = async () => {

  const allPlaces = await fetch("/more-weather");
  const allPlacesData = await allPlaces.json();
  const allPlacesInfo = [];

  console.log(allPlacesData);

  for (const place of allPlacesData) {

    const info = {};
    const [weatherData, aqData, weatherImgPath, {location}, coords ] = place;

    info.city = location;
    info.coords = coords;

    const temp_info = weatherData;

    if (temp_info.failed || temp_info.message) {

      console.log(temp_info.message);
      info.tempDataFailed = true;
      info.temp = "No data";
      info.humidity = "No data";
      info.windSpeed = "No data";

    } else {

      info.temp = temp_info.main.temp;
      info.humidity = temp_info.main.humidity;
      info.windSpeed = temp_info.wind.speed;

      const { iconPath } = weatherImgPath;
      info.weatherIconPath = iconPath;

    }

    const air_info = aqData;
    // console.debug(location, air_info);

    if (air_info.failed) {

      console.log(air_info.message);
      info.airDataFailed = true;
      info.airQuality = "No data";
      info.airQualityUnit = "";

    } else {

      if (air_info.results.length == 0 || air_info.results == undefined) {
        info.airDataFailed = true;
        info.airQuality = "No data";
        info.airQualityUnit = "";
        console.log(`${info.city} has no air quality measurements.`);
      } else {

        // results are sorted by nearest
        const air_quality = air_info.results[0];
        let first_measurement = air_quality.measurements
          .filter((measurement) => measurement.parameter == "pm10")[0];

        if (first_measurement == undefined) {
          console.log(`${info.city} had no measurements in pm10.`);
          first_measurement = air_quality.measurements[0];
        }

        // console.log(first_measurement);

        info.location = air_quality.location;
        info.airQuality = first_measurement.value;
        info.airQualityUnit = first_measurement.unit;
        info.lastUpdated = new Date(first_measurement.lastUpdated).toLocaleString();

      }

    }

    allPlacesInfo.push(info);

  }
  
  for (const placeInfo of allPlacesInfo) {

    placeMarker(placeInfo.coords.lat, placeInfo.coords.lon, placeInfo);

  }
  console.log(allPlacesInfo);

}

plotAllUsersData();

// userCoords not in localStorage
if (userCoords === null) {

  navigator.geolocation.getCurrentPosition(async pos => {

    const coords = pos.coords;

    const lat = Number(coords.latitude.toFixed(6));
    const lon = Number(coords.longitude.toFixed(6));

    latitude.textContent = lat;
    longitude.textContent = lon;

    const homeCoordsData = await plotUserData(lat, lon);

    // key, value, ttl
    setLocalData("userCoords", { lat, lon }, 180000);

    if (userCoordsData === null) {
      setLocalData("userCoordsData", homeCoordsData, 180000);
    }

  }, (err) => {
    console.error(err);
    console.log("Please allow location access!");
    mainTag.textContent = "Please allow location access 📍";
    mainTag.style.fontSize = "1.5rem";
  }, {
    maximumAge: 180000,
    enableHighAccuracy: false
  });

} else {

  (async () => {

    const { lat, lon } = userCoords;
    latitude.textContent = lat;
    longitude.textContent = lon;

    const homeCoordsData = await plotUserData(lat, lon, true);
    console.log(homeCoordsData);


  })();

}
