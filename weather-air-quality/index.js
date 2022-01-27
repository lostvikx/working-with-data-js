#!/usr/bin/env node
const express = require("express");
require("dotenv").config();
const fetch = require("node-fetch");
const fs = require("fs");
const makeIcon = require("./apis/makeIcon");
const getWeatherIcon = require("./apis/getWeatherIcon");
const getWeatherData = require("./apis/getWeatherData");
const getAirQualityData = require("./apis/getAirQualityData");

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/", express.static(__dirname + "/public"));

app.use(express.json({
  limit: "1mb",
  type: "application/json"
}));

app.listen(PORT, "localhost", () => console.log(`listening on port http://localhost:${PORT}/`));

const getAllData = async (lat, lon) => {

  const weather_api_key = process.env.WEATHER_API_KEY;

  const weatherData = getWeatherData(lat, lon, weather_api_key);
  const aqData = getAirQualityData(lat, lon);

  const allData = await Promise.all([ weatherData, aqData ]);

  return allData;

}

// This is called a proxy server (middle man)
app.get("/weather", async (req, res) => {

  // console.log(req.query);
  const { lat, lon } = req.query;
  const data = await getAllData(lat, lon);

  const weatherData = data[0];

  const iconName = weatherData.weather[0].icon;
  let iconPath = null;

  // If icon img file exists then just provide the path, else fetch the icon and create and save in the local file system.
  try {
    fs.statSync(__dirname + `/public/weather_icons/img_${iconName}.png`);
    // console.log(iconName, "exists");
    iconPath = `weather_icons/img_${iconName}.png`;
  } catch (err) {
    // console.warn(iconName, "doesn't exists");
    // console.error(err);

    const iconBlob = await getWeatherIcon(iconName);
    iconPath = await makeIcon(iconName, iconBlob);
  }

  data.push({ iconPath });
  res.json(data);

});