#!/usr/bin/env node
const fetch = require("node-fetch");
const fs = require("fs");

module.exports = class FetchData {

  constructor(lat, lon) {
    this.lat = lat;
    this.lon = lon;
  }

  async getAirQualityData(lat, lon) {

    try {

      const url = `https://docs.openaq.org/v2/latest?limit=1&sort=desc&coordinates=${lat}%2C${lon}&radius=10000&order_by=lastUpdated&dumpRaw=false`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.results == undefined) throw Error("no results found");

      return data;

    } catch (err) {
      console.warn("getAirQualityData failed!");
      console.error(err);
      return { 
        failed: true, 
        message: "No air quality data available" 
      };
    }

  }

  async getWeatherData(lat, lon, apiKey) {

    try {

      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

      const res = await fetch(url);
      const data = await res.json();

      return data;

    } catch (err) {
      console.warn("getWeatherData failed!");
      console.error(err);
      return { 
        failed: true, 
        message: "No temperature data available" 
      };
    }

  }

  static async getWeatherIcon(icon) {

    const url = `http://openweathermap.org/img/wn/${icon}@2x.png`;

    try {

      const res = await fetch(url);
      const data = await res.blob();

      if (data.type.split("/")[0] !== "image") throw Error("icon img not found!");

      return data;

    } catch (err) {
      console.warn("getWeatherIcon failed!");
      console.error(err);
      return null;
    }

  }

  static getCoordsFromFile(jsonFileName) {

    const data = fs.readFileSync(__dirname + `/../${jsonFileName}.json`, {
      encoding: "utf-8",
      flag: "r"
    });
    
    const allCoords = JSON.parse(data);
    
    return allCoords;

  }

}