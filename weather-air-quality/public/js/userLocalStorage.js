"use strict";

// val = { lat: , lon: }, ttl = time in ms
const setUserCoordsWithExpiry = (key, val, ttl) => {

  const coords = {
    val,
    expiry: new Date().getTime() + ttl
  }

  localStorage.setItem(key, JSON.stringify(coords));

}

const getUserCoordsWithExpiry = (key) => {

  const item = localStorage.getItem(key) || null;

  if (item === null) return null;

  const coords = JSON.parse(item);

  if (new Date().getTime() > coords.expiry) {

    localStorage.removeItem(key);
    return null;

  } else {
    return coords.val;
  }

}

export { setUserCoordsWithExpiry, getUserCoordsWithExpiry };