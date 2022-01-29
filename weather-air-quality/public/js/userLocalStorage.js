"use strict";

// val = { lat: , lon: }, ttl = time in ms
const setLocalData = (key, val, ttl) => {

  const item = {
    data: val,
    expiry: new Date().getTime() + ttl
  }

  localStorage.setItem(key, JSON.stringify(item));

}

const getLocalData = (key) => {

  const item = localStorage.getItem(key);

  if (item === null) return null;

  const { data, expiry } = JSON.parse(item);

  if (new Date().getTime() > expiry) {

    localStorage.removeItem(key);
    return null;

  } else {
    return data;
  }

}

export { setLocalData, getLocalData };