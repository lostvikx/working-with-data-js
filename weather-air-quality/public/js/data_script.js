"use strict";

import { setLocalData, getLocalData } from "./userLocalStorage.js";
import getMoreWeatherData from "./getMoreWeather.js";

const root = document.getElementById("all-data");

const userCoords = getLocalData("userCoords");
const userCoordsData = getLocalData("userCoordsData");

console.log(userCoords, userCoordsData);

const renderData = (data) => {

  const { lat, lon } = data.coords;
  const place = document.createElement("div");
  place.className = "place";

  // city name
  const placeName = document.createElement("h2");
  placeName.textContent = data.city;

  // icon and temp
  const temp = document.createElement("div");

  const icon = document.createElement("img");
  icon.src = data.weatherIconPath;
  icon.alt = "weather icon";

  const temp_info = document.createElement("p");
  temp_info.textContent = data.temp + "°C";

  temp.append(icon, temp_info);
  temp.className = "temp"

  // coords
  const coords = document.createElement("p");
  coords.textContent = `📍 ${lat}, ${lon}`;

  // air quality
  const airQualityFace = (quality) => {
    if (quality > 200) return "🥵"
    else if (quality > 100) return "😷";
    else if (quality > 50) return "😐";
    else if (quality > 0) return "😎";
    else return null;
  }


  const air_quality = document.createElement("p");
  air_quality.textContent = `${airQualityFace(data.airQuality) || "No data"}: ${data.airQuality} ${data.airQualityUnit}`;

  // humidity
  const humidity = document.createElement("p");
  humidity.textContent = `🌦️ ${data.humidity}%`;

  // wind speed
  const windSpeed = document.createElement("p");
  windSpeed.textContent = `🍃 ${data.windSpeed} km/hr`;

  place.append(placeName, temp, coords, air_quality, humidity, windSpeed);

  place.style.height = "300px";

  root.append(place);

}

if (userCoords !== null && userCoordsData !== null) {

  renderData(userCoordsData);

}

const renderAllData = async () => {

  const allPlacesInfo = await getMoreWeatherData();
  // console.log(allPlacesInfo);

  for (const place of allPlacesInfo) {

    renderData(place);

  }

}

renderAllData();