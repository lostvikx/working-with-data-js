"use strict";

import { setLocalData, getLocalData } from "./userLocalStorage.js";


const userCoords = getLocalData("userCoords");
const userCoordsData = getLocalData("userCoordsData");

console.log(userCoords, userCoordsData);

// const renderData = ()

if (userCoords !== null && userCoordsData !== null) {

  const { lat, lon } = userCoords;

  

}