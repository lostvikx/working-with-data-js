#!/usr/bin/env node
const fetch = require("node-fetch");

module.exports = async (lat, lon) => {

  try {

    const url = `https://docs.openaq.org/v2/latest?limit=5&sort=desc&coordinates=${lat}%2C${lon}&radius=10000&order_by=lastUpdated&dumpRaw=false`;

    const res = await fetch(url);
    const data = await res.json();

    return data;

  } catch (err) {
    console.warn("getAirQualityData failed!");
    console.error(err);
    return { failed: true, message: "No air quality data available" };
  }

}