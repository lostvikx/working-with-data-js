#!/usr/bin/env node
const fs = require("fs");

module.exports = (data) => {
  const json_filePath = __dirname + "/../coords_data.json";
  console.log(data);

  fs.readFile(json_filePath, "utf-8", (err, json_data) => {
    if (err) {
      console.error(err);
    } else {

      const coordsData = JSON.parse(json_data);  // unable to convert

      console.log(coordsData);
      console.log(typeof coordsData);  // string: incorrect
      coordsData["coords"].push(data);

      const json = JSON.stringify(json_data);

      fs.writeFile(json_filePath, json, "utf-8", (err) => console.error(err));

    }
  });
}