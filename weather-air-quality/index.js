#!/usr/bin/env node
const express = require("express");
require("dotenv").config();
const NodeCache = require("node-cache");
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

const getAllThree = async (lat, lon) => {

  const data = await getAllData(lat, lon);

  let iconPath = null;

  if (!data[0].failed) {
    try {
      iconPath = await fetchIcon(data[0]);
    } catch (err) {
      console.warn("weatherData server error!");
    }
  }

  data.push({ iconPath });

  return data;

}

// This is called a proxy server (middle man)
app.get("/weather", async (req, res) => {

  // console.log(req.query);
  const { lat, lon } = req.query;

  const allData = await getAllThree(lat, lon);

  // console.log(allData); // [{weatherData}, {aqData}, {iconPath}]

  res.setHeader("Cache-Control", "private, max-age=180");
  res.json(allData);

});

const getAllFive = async (lat, lon, location) => {

  const data = await getAllData(lat, lon);

  let iconPath = null;

  if (!data[0].failed) {
    try {
      iconPath = await fetchIcon(data[0]);
    } catch (err) {
      console.warn("weatherData server error!");
    }
  }

  data.push({ iconPath });
  data.push({ location });
  data.push({ lat, lon });

  return data;

}

const timeToLive = 1800; // 30 minutes

const cache = new NodeCache({ stdTTL: timeToLive });

app.get("/more-weather", async (req, res) => {

  const allCoords = FetchData.getCoordsFromFile("test-coords");
  // console.log(allCoords);

  const allData = cache.get("allData");

  if (allData === undefined) {

    const allCoordsPromises = allCoords.map(async ({ location, coords }) => {

      return getAllFive(coords.lat, coords.lon, location);

    });

    const data = await Promise.all(allCoordsPromises);

    const setData = cache.set("allData", data, timeToLive);

    if (setData) {
      console.log("cache pass!");
    } else {
      console.log("cache failed!");
    }

  } else {
    console.log("allData in cache!");
  }

  console.log(cache.getTtl("allData"));

  res.setHeader("Cache-Control", `private, max-age=${timeToLive}`);
  res.json(allData);

});