"use strict";

const storeCacheCoords = async (url, cache) => {

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

    await cache.put(url, res);

    return response;

  } catch (err) {
    console.error(err);
    console.log("couldn't fetch", url);
  }

}

export default storeCacheCoords;