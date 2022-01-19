#!/usr/bin/env node
const express = require("express");
const fs = require("fs");
const write_data = require("./apis/write_data")

const app = express();
const PORT = 3000;

// Static files
app.use("/selfie", express.static(__dirname + "/public"));
app.use("/iss", express.static(__dirname + "/../iss-location"));
app.use("/fetch-blob", express.static(__dirname + "/../fetch-blob"));
app.use("/nasa", express.static(__dirname + "/../nasa-global-temp"));
app.use("/projects", express.static(__dirname + "/public/projects"));


app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}/`));


app.use(express.json({
  limit: "200kb",
  type: "application/json"
}));


// post request
app.post("/api", (req, res) => {

  // The middleware to automatically parse JSON.
  const data = req.body;

  console.log(data);

  write_data(data);

  res.status(200).json({
    status: "OK",
    lat: data.lat,
    lng: data.lng,
    timeStamp: data.timeStamp
  });
  res.end();
});