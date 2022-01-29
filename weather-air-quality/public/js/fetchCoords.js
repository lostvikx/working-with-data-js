"use strict";

// fetchCoords from JSON file
const fetchCoords = async (path) => {

  const res = await fetch(path);
  const data = await res.json();

  return data;

}

export default fetchCoords;