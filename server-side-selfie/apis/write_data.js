#!/usr/bin/env node
const fs = require("fs");

module.exports = (data) => {
  const json_filePath = __dirname + "/../coords_data.json";

  fs.readFile(json_filePath, "utf-8", (err, json_data) => {
    if (err) {
      console.error(err);
    } else {

      const coordsData = JSON.parse(json_data);

      // console.log(coordsData);
      // console.log(typeof coordsData);
      coordsData.coords.push(data);

      const json = JSON.stringify(coordsData);
      // console.log(json);

      fs.writeFile(json_filePath, json, "utf-8", (err) => console.error(err));

    }
  });
}
