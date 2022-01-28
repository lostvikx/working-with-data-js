"use strict";

const getData = async (lat, lon) => {

  const allPlacesInfo = [];

  try {

    const res = await fetch(`/weather?lat=${lat}&lon=${lon}`);
    const data = await res.json();

    for (const place of data) {

      const [weatherData, aqData, weatherImgPath, {city}, {coords}] = place;

      const info = {};
      info.coords = coords;
      info.city = city;

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

        if (air_info.results.length == 0) {
          info.airDataFailed = true;
          info.airQuality = null;
          info.airQualityUnit = null;
          console.log(`${city} has no air quality measurements.`);
        } else {

          // results are sorted by nearest
          const air_quality = air_info.results[0];
          let first_measurement = air_quality.measurements
            .filter((measurement) => measurement.parameter == "pm10" || measurement.parameter == "co")[0];

          if (first_measurement == undefined) {
            first_measurement = air_quality.measurements[0];
            console.log(`${city} had no measurements in pm10 or co.`);
          }

          // console.log(first_measurement);

          info.location = air_quality.location;
          info.airQuality = first_measurement.value;
          info.airQualityUnit = first_measurement.unit || "µg/m³";
          info.lastUpdated = new Date(first_measurement.lastUpdated).toLocaleString();

        }

      }

      allPlacesInfo.push(info);

    }

    return allPlacesInfo;

  } catch (err) {
    console.error(err);
    console.warn("All promises failed!");
    return allPlacesInfo;
  }

}

export default getData;