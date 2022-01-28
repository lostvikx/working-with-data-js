"use strict";

const cacheData = async (request) => {

  const cache = await caches.open("allCoordsData");

  // cache.add(request);

  // cache.delete(request);

}

export default cacheData;