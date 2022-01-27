#!/usr/bin/env node
const fs = require("fs");

module.exports = async (iconName, iconBlob) => {

  if (iconBlob === null) {
    // console.log("iconBlob === null");
    return "";
  }

  const fileExtension = iconBlob.type.split("/")[1];
  const file = `img_${iconName}.${fileExtension}`;

  const arrBuff = await iconBlob.arrayBuffer();
  const buff = Buffer.from(arrBuff);

  const filePath = `${__dirname}/../public/weather_icons/${file}`;

  const path_to_icon = `weather_icons/${file}`

  fs.stat(filePath, (err, stats) => {

    // file doesn't exist
    if (err !== null) {

      // console.log("file was created at", filePath);

      // Save the img file
      fs.writeFile(filePath, buff, err => {
        if (err) {
          console.log("img write err");
          console.error(err);
        }
      });

    } 
    // else {
    //   console.log("file already exists!", stats);
    // }

  });

  return path_to_icon;

}