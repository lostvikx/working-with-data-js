"use strict";

const lat = document.getElementById("lat");
const lng = document.getElementById("lng");
const alertMessage = document.getElementById("alert");

// Create a map
const map = L.map("map").setView([0, 0], 1);
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution }).addTo(map);

const marker = L.marker([0, 0]).addTo(map).bindPopup("Your Location!");

// Copy coords btn
document.getElementById("copy-coords").addEventListener("click", () => {
  window.navigator.clipboard.writeText(`${lat.textContent}° ${lng.textContent}°`)
    .then(() => console.log("Copied Coords!"))
    .catch(err => console.error(err));

  alertMessage.textContent = "Copied 👍"
  setTimeout(() => alertMessage.textContent = "", 5000);
});

let latitude = null;
let longitude = null;

// Get users' geolocation
navigator.geolocation.getCurrentPosition(
  position => {
    // console.log(position.coords);
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    // display only 4 decimal places
    lat.textContent = latitude.toFixed(4);
    lng.textContent = longitude.toFixed(4);

    marker.setLatLng([latitude, longitude]);
    map.setView([latitude, longitude], 15);
  },
  err => console.error(err),
  { enableHighAccuracy: false }
);

// mood data input
let mood = null;
document.getElementById("input-mood")
  .addEventListener("keyup", event => {
    mood = event.target.value;
  });

// send post request
document.getElementById("send-coords")
  .addEventListener("submit", async (event) => {

    event.preventDefault();

    const photo = document.getElementById("photo");

    const sendData = {
      lat: latitude,
      lng: longitude,
      timeStamp: Date.now(),
      mood,
      picture: photo.src
    };

    // console.log(sendData);

    try {

      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(sendData)
      });

      const data = await response.json();

      console.log(data);

      document.getElementById("send-coords").reset();

      alertMessage.textContent = "Data sent successfully! 🎉"
      setTimeout(() => alertMessage.textContent = "", 5000);

    } catch (err) {
      console.error(err);
    }

  });