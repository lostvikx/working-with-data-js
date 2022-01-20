(async () => {

  try {

    const response = await fetch("/api");
    const data = await response.json();
    // console.log(data);

    const allData = document.getElementById("all-data");

    for (const item of data) {

      const root = document.createElement("p");
      const coordinates = document.createElement("div");
      const mood = document.createElement("div");
      const timeStamp = document.createElement("div");
      const img = document.createElement("img");

      coordinates.textContent = `lat: ${item.lat}° lng: ${item.lng}°`;
      mood.textContent = `current mood: ${item.mood}`;
      timeStamp.textContent = new Date(item.timeStamp).toLocaleString();

      img.alt = "Your Picture Saved in Database 😎";
      img.src = item.pathToImg;

      root.append(img, coordinates, mood, timeStamp);
      allData.append(root, document.createElement("hr"));
    }

  } catch (err) {
    console.error(err);
  }

})();