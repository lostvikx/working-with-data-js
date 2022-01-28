"use strict";

const getData = async (lat, lon) => {

  try {

    const res = await fetch(`/weather?lat=${lat}&lon=${lon}`);
    const data = await res.json();
    const allPlacesInfo = [];

    for (const place of data) {

      const [weatherData, aqData, weatherImgPath, {city}, {coords}] = place;

      const info = {};
      info.coords = coords;

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
        } else {

          // results are sorted by nearest
          const air_quality = air_info.results[0];
          const first_measurement = air_quality.measurements[0];

          // console.log(first_measurement);

          info.location = air_quality.location;
          info.city = city;
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