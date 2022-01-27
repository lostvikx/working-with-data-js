#!/usr/bin/env node
const fetch = require("node-fetch");

module.exports = async (icon) => {

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