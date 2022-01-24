#!/usr/bin/env node
const express = require("express");
require("dotenv").config();
const fetch = require("node-fetch");

const weather_api_key = process.env.WEATHER_API_KEY;
// const icon_url = "http://openweathermap.org/img/wn/icon@id.png";

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/", express.static(__dirname + "/public"));

app.use(express.json({
  limit: "1mb",
  type: "application/json"
}));

app.listen(PORT, "localhost", () => console.log(`listening on port http://localhost:${PORT}/`));

// This is called a proxy server
app.get("/weather/lat/:lat/lon/:lon", async (req, res) => {

  const { lat, lon } = req.params;
  
  const json_res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weather_api_key}&units=metric`);

  const data = await json_res.json();

  res.json(data);

});