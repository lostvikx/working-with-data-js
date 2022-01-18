#!/usr/bin/env node
const express = require("express");

const app = express();
const PORT = 3000;

// Static files
app.use("/selfie", express.static(__dirname + "/public"));
app.use("/iss", express.static(__dirname + "/../iss-location"));
app.use("/fetch-blob", express.static(__dirname + "/../fetch-blob"));
app.use("/nasa", express.static(__dirname + "/../nasa-global-temp"));
app.use("/projects", express.static(__dirname + "/public/projects"));

app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}/`));