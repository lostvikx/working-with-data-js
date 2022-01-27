#!/usr/bin/env node
const fetch = require("node-fetch");

// an async function always returns a promise
// 60 calls per minute
module.exports = async (lat, lon, apiKey) => {

  try {

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    const res = await fetch(url);
    const data = await res.json();

    return data;

  } catch (err) {
    console.warn("getWeatherData failed!");
    console.error(err);
    return { failed: true, message: "No temperature data available" };
  }

}