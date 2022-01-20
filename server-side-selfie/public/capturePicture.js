"use strict";

(() => {
  const width = 320;
  let height = 0;
  let streaming = false;

  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const photo = document.getElementById("photo");
  const captureButton = document.getElementById("capture-btn");

  // Get user media stream from webcam, then set video.srcObject to display the video stream.
  navigator.mediaDevices
    .getUserMedia({video: true, audio: false})
    .then(stream => {
      video.srcObject = stream;
      video.play();
    })
    .catch(err => {
      console.error(err);
    });

  // Once the video is ready to be played, complete loading
  video.addEventListener("canplay", () => {

    if (!streaming) {
      // To maintain aspect ratio
      height = video.videoHeight / (video.videoWidth / width);
      // console.log(width, height);

      video.setAttribute("width", width);
      video.setAttribute("height", height);

      canvas.setAttribute("width", width);
      canvas.setAttribute("height", height);

      streaming = true;
    }

  });

  const context = canvas.getContext("2d");

  const clearPicture = () => {

    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

  }

  const takePicture = () => {

    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);

      const image64 = canvas.toDataURL("image/png");
      photo.setAttribute("src", image64);
    } else {
      clearPicture();
    }

  }

  captureButton.addEventListener("click", (evt) => {

    evt.preventDefault();

    takePicture();

  });

})();