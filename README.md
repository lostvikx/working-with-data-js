# Working with Data!

In this repository, I have created some interesting JavaScript projects that use data from external APIs or even user generated data.

I had a lot of fun while creating them. I was inspired to build these projects by a YouTube channel called: [The Coding Train](https://www.youtube.com/c/TheCodingTrain).

## Project Description
- **Project 1: Fetch Blob** - Uses the JavaScript fetch API to GET Blobs stored locally. To create `src` urls for `img` HTML tag, I used the `URL.createObjectURL()`.

- **Project 2: NASA Global Temperature** - Uses the [Chart.js](https://www.chartjs.org/) library to create a beautiful chart to display to global average temperature for more than 100 years.

- **Project 3: Live ISS Location** - Uses the [Leaflet](https://leafletjs.com/) JavaScript Library to create a embeded map that shows the location of the International Space Station. Got the co-ordinates data from [here](https://wheretheiss.at/).

- **Project 4: Data Selfie** - Uses Node.js runtime with Express.js to create a simple http server. The front-end was build using VanillaJS which is primarily used to collect user data. Data like - client's coords (lat and lng), mood (text input), and a selfie (image/png). It stores all the data, except the image, in a database powered by [NeDB](https://github.com/louischatriot/nedb). The images are stored locally. First the image is converted to a Base64 string, then it is sent with the rest of the data in JSON format, POST request. Then in the back-end the Base64 string is parsed into a Buffer (Uint8Array) which is written to a file with the appropriate extension. The path of the file, which in the public directory, is added to the database.
