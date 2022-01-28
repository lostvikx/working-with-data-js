const fetch = require("node-fetch");

module.exports = async (jsonFilePath) => {

  try {
    
    const res = await fetch(jsonFilePath);
    const data = await res.json();

    return data;

  } catch (err) {
    console.error(err);
    console.log("can't read json file", jsonFilePath);
  }

}