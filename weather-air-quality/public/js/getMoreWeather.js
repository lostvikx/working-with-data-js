"use strict";

const getMoreWeatherData = async () => {

  const res = await fetch("/more-weather");
  const data = await res.json();
  const allPlacesInfo = [];

  // console.log(data);

  for (const place of data) {

    const info = {};
    const [weatherData, aqData, weatherImgPath, { location }, coords] = place;

    info.city = location;
    info.coords = coords;

    const temp_info = weatherData;

    if (temp_info.failed || temp_info.message) {

      console.log(temp_info.message);
      info.tempDataFailed = true;
      info.temp = "No data";
      info.humidity = "No data";
      info.windSpeed = "No data";

    } else {

      info.temp = temp_info.main.temp;
      info.humidity = temp_info.main.humidity;
      info.windSpeed = temp_info.wind.speed;

      const { iconPath } = weatherImgPath;
      info.weatherIconPath = iconPath;

    }

    const air_info = aqData;
    // console.debug(location, air_info);

    if (air_info.failed) {

      console.log(air_info.message);
      info.airDataFailed = true;
      info.airQuality = "No data";
      info.airQualityUnit = "";

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
        info.airQualityUnit = first_measurement.unit;
        info.lastUpdated = new Date(first_measurement.lastUpdated).toLocaleString();

      }

    }

    allPlacesInfo.push(info);

  }

  return allPlacesInfo;

}

export default getMoreWeatherData;