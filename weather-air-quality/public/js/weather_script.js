"use strict";

import getData from "./getData.js";
import { setLocalData, getLocalData } from "./userLocalStorage.js";
import getMoreWeatherData from "./getMoreWeather.js";

// Geo Location
const latitude = document.getElementById("lat");
const longitude = document.getElementById("lon");
const mainTag = document.getElementById("coords");

// map via leaflet.js
const map = L.map('map').setView([0, 0], 3);

const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution }).addTo(map);

map.addControl(new L.Control.Fullscreen());

const placeMarker = (lat, lon, data) => {

  const myIcon = L.divIcon({
    html: `<img src="${data.weatherIconPath || "weather_icons/img_01d.png"}" /><span>${data.city}<span>`,
    iconAnchor: [0, 0],
    popupAnchor: [35, -5],
  });

  const your_marker = L.marker([lat, lon], {
    keyboard: true,
    icon: myIcon
  }).addTo(map);

  your_marker.bindPopup(`
    <p class="data">
      <b>City:</b> ${data.city}<br / console.log(evt);>
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

  const allPlacesInfo = await getMoreWeatherData();
  
  for (const placeInfo of allPlacesInfo) {

    placeMarker(placeInfo.coords.lat, placeInfo.coords.lon, placeInfo);

  }
  // console.log(allPlacesInfo);

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
    mainTag.textContent = "📍 Reload the page and allow location access.";
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
    // console.log(homeCoordsData);


  })();

}

const popup = L.popup();

const getWeatherInfoOnClick = () => {

  map.on("click", async (evt) => {

    // console.log(evt.latlng);

    let { lat, lng } = evt.latlng;

    lat = Number(lat.toFixed(6));
    lon = Number(lng.toFixed(6));

    const data = await getData(lat, lon, "Custom");
    // console.log(data);
    data.city = data.location || data.city;

    popup
      .setLatLng(evt.latlng)
      .setContent(`
        <p class="data">
          <b>City:</b> ${data.city}<br />
          <b>Lat:</b> ${lat} <b>Long:</b> ${lon}<br />
          <b>Temperature:</b> ${data.temp}°C<br />
          <b>Humidity:</b> ${data.humidity}%<br />
          <b>Air Quality:</b> ${data.airQuality} ${data.airQualityUnit}<br />
          <b>Wind Speed:</b> ${data.windSpeed} km/hr<br />
          <b>Data Last Updated:</b> ${data.lastUpdated || "No data"}
        </p>
      `)
      .openOn(map);

  });

}

getWeatherInfoOnClick();