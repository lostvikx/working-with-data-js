#!/usr/bin/env node
const fs = require("fs");
const makeIcon = require("./makeIcon");
const FetchData = require("./FetchData");

module.exports = async (weatherData) => {

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

    const iconBlob = await FetchData.getWeatherIcon(iconName);
    iconPath = await makeIcon(iconName, iconBlob);
  }

  return iconPath;

}