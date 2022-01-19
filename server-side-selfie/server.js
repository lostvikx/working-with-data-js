#!/usr/bin/env node
const express = require("express");
const write_data = require("./apis/write_data");
const Datastore = require("nedb");

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


const db = new Datastore({ filename: "location.db" });
db.loadDatabase(err => console.error(err));

app.get("/api", (req, res) => {

  db.find({}, (err, data) => {
    if (err) console.error(err);
    else {
      // console.log(data, typeof data);
      res.json(data.sort((a, b) => {
        return (a.timeStamp < b.timeStamp) ? 1 : -1;
      }));
    }
  });
});

// post request
app.post("/api", (req, res) => {

  // The middleware to automatically parse JSON.
  const data = req.body;

  // console.log(data);
  // write to JSON file
  // write_data(data);

  // insert in db file
  db.insert(data);

  res.status(200).json(data);
});
