"use strict";

const storeUserCoords = async (url, cache) => {

  try {

    const res = await fetch(url, {
      method: "GET",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json"
      }
    });

    // clone is needed because put() consumes the response body
    const response = res.clone();

    // stores cache
    await cache.put(url, res);

    return response;

  } catch (err) {
    console.error(err);
    console.log("couldn't fetch", url);
  }

}

const roundTwoDecimal = (floatingNum) => {

  return Number(floatingNum.toFixed(2));

}

const getUserCoords = async (url, cache) => {

  let res = await cache.match(url);

  if (res !== undefined) {
    const cachedDate = new Date(res.headers.get("date")).getTime();

    // refresh data after 1 hr!
    const timeToLive = 1800; // seconds
    const timePassed = roundTwoDecimal((Date.now() - cachedDate) / 1000);
    // console.log(timePassed); // seconds

    if (timePassed > timeToLive) {

      const dataDeleted = await cache.delete(url);
      if (dataDeleted) {

        console.debug(url, "deleted");
        res = null;

      }

    }

    else {
      console.log(timeToLive - timePassed, "time left before cache refresh!");
    }
  }

  return res;

}

export { storeUserCoords, getUserCoords };