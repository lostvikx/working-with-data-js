#!/usr/bin/env node
const express = require("express");
require("dotenv").config();
// const cache = require("node-cache");
const FetchData = require("./apis/FetchData");
const fetchIcon = require("./apis/fetchIcon");

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/", express.static(__dirname + "/public"));

app.use(express.json({
  limit: "1mb",
  type: "application/json"
}));

app.listen(PORT, "localhost", () => console.log(`listening on port http://localhost:${PORT}/`));

const getAllData = async (lat, lon) => {

  const fetchData = new FetchData(lat, lon);

  const weather_api_key = process.env.WEATHER_API_KEY;

  const weatherData = fetchData.getWeatherData(lat, lon, weather_api_key);
  const aqData = fetchData.getAirQualityData(lat, lon);

  const allData = await Promise.all([ weatherData, aqData ]);

  return allData;

}

// This is called a proxy server (middle man)
app.get("/weather", async (req, res) => {

  // console.log(req.query);
  const { lat, lon } = req.query;

  const data = await getAllData(lat, lon);
  const iconPath = await fetchIcon(data[0]);

  data.push({iconPath});
  // console.log(data); // [{weatherData}, {aqData}, {iconPath}]

  res.setHeader("Cache-Control", "private, max-age=1800");
  res.json(data);

});