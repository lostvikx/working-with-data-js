#!/usr/bin/env node
const express = require("express");
require("dotenv").config();
const fetch = require("node-fetch");

const weather_api_key = process.env.WEATHER_API_KEY;
// const icon_url = "http://openweathermap.org/img/wn/icon@id.png";

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/", express.static(__dirname + "/public"));

app.use(express.json({
  limit: "1mb",
  type: "application/json"
}));

app.listen(PORT, "localhost", () => console.log(`listening on port http://localhost:${PORT}/`));

// an async function always returns a promise
const getWeatherData = async (lat, lon, apiKey) => {

  try {
    
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    const res = await fetch(url);
    const data = await res.json();

    return data;

  } catch (err) {
    console.warn("getWeatherData failed!");
    console.error(err);
  }

}

const getAirQualityData = async (lat, lon) => {

  try {
    
    const url = `https://docs.openaq.org/v2/latest?limit=5&sort=desc&coordinates=${lat}%2C${lon}&radius=10000&order_by=lastUpdated&dumpRaw=false`;

    const res = await fetch(url);
    const data = await res.json();

    return data;

  } catch (err) {
    console.warn("getAirQualityData failed!");
    console.error(err);
  }

}

const getAllData = async (lat, lon) => {

  const weatherData = getWeatherData(lat, lon, weather_api_key);
  const aqData = getAirQualityData(lat, lon);

  const allData = await Promise.all([ weatherData, aqData ]);

  return allData;

}

// This is called a proxy server
app.get("/weather", async (req, res) => {

  // console.log(req.query);
  const { lat, lon } = req.query;

  // 700ms
  // // weather api
  // const weatherData = await getWeatherData(lat, lon, weather_api_key);
  // // air quality api
  // const aqData = await getAirQualityData(lat, lon);

  // const data = {
  //   weather: weatherData,
  //   airQuality: aqData
  // };

  // 300ms
  const data = await getAllData(lat, lon);

  res.json(data);

});