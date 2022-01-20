#!/usr/bin/env node
const fs = require("fs");

module.exports = (img64) => {

  if (img64 == null || img64 == undefined) {
    console.log("img64 == null or undefined");
    return null;
  }

  const matchArr = img64.match(/^data:(\w+\/(\w+));(base64),(\S+)/);
  // ["data:image/png;base64,iVBORw0KGgoAAAA...", "image/png", "png", "base64", "iVBORw0KGgoAAAA..."]
  // console.log(matchArr);

  console.log(matchArr[1], matchArr[2], matchArr[3]);

  const buffer = Buffer.from(matchArr[4], "base64");

  fs.writeFile(`${__dirname}/../public/img/test1.png`, buffer, err => {
    console.error(err);
  });

  
}