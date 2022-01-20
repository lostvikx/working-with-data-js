#!/usr/bin/env node
const fs = require("fs");
const randomName = require("./randomName");

module.exports = (img64) => {

  if (img64 == null || img64 == undefined) {
    console.log("img64 == null or undefined");
    return null;
  }

  const fileName = randomName();

  const [fullBase64Url, mimeType, fileExtension, bufferType, url] = img64.match(/^data:(\w+\/(\w+));(base64),(\S+)$/);

  // Gets us this => ["data:image/png;base64,iVBORw0KGgoAAAA...", "image/png", "png", "base64", "iVBORw0KGgoAAAA..."]

  // console.log(fileExtension, url, mimeType, bufferType);

  // The Buffer class in Node.js is designed to handle raw binary data. 
  const buffer = Buffer.from(url, bufferType);

  // Save the img file
  fs.writeFile(`${__dirname}/../public/img/${fileName}.${fileExtension}`, buffer, err => {
    console.error(err);
  });

  return `img/${fileName}.${fileExtension}`

}