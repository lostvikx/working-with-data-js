"use strict";

// Geo Location

navigator.geolocation.getCurrentPosition(async pos => {

  const coords = pos.coords;

  console.log(coords);

  const lat = coords.latitude;
  const lon = coords.longitude;

  try {
    
    const res = await fetch(`/weather/lat/${lat}/lon/${lon}`);
    const data = await res.json();

    console.log(data);

  } catch (err) {
    console.warn(err);
  }

});