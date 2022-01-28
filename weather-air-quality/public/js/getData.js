"use strict";

import storeCache from "./storeCache.js";

const getData = async (lat, lon, location) => {

  try {

    const url = `/weather?lat=${lat}&lon=${lon}`;

    // creates cache with cacheName as allCoords, if cacheName exists get that 
    const cache = await caches.open("allCoords");

    // cache.put(url, res);

    let res = null;

    res = await cache.match(url);

    if (res === undefined) {

      console.warn(`${url} not found in cache`);

      res = await storeCache(url, cache);

    }

    const data = await res.json();

    const [weatherData, aqData, weatherImgPath] = data;

    const info = {};
    info.coords = { lat, lon };
    info.city = location;

    // console.log(weatherData, aqData, weatherImgPath);

    const { iconPath } = weatherImgPath;
    info.weatherIconPath = iconPath;

    const temp_info = weatherData;

    if (temp_info.failed) {

      console.log(temp_info.message);
      info.tempDataFailed = true;

    } else {

      info.temp = temp_info.main.temp;
      info.humidity = temp_info.main.humidity;
      info.windSpeed = temp_info.wind.speed;

    }

    const air_info = aqData;

    if (air_info.failed) {

      console.log(air_info.message);
      info.airDataFailed = true;

    } else {

      if (air_info.results.length == 0 || air_info.results == undefined) {
        info.airDataFailed = true;
        info.airQuality = "No data";
        info.airQualityUnit = "";
        console.log(`${info.city} has no air quality measurements.`);
      } else {

        // results are sorted by nearest
        const air_quality = air_info.results[0];
        let first_measurement = air_quality.measurements
          .filter((measurement) => measurement.parameter == "pm10")[0];

        if (first_measurement == undefined) {
          console.log(`${info.city} had no measurements in pm10.`);
          first_measurement = air_quality.measurements[0];
        }

        // console.log(first_measurement);

        info.location = air_quality.location;
        info.airQuality = first_measurement.value;
        info.airQualityUnit = first_measurement.unit || "µg/m³";
        info.lastUpdated = new Date(first_measurement.lastUpdated).toLocaleString();

      }

    }

    return info;

  } catch (err) {
    console.error(err);
    console.warn("All promises failed!");
    return info;
  }

}

export default getData;