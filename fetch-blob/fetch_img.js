const root = document.getElementById("root");
const imgs = ["house.jpg", "night-city.jpg"];

imgs.forEach(img => {

  const imgElement = document.createElement("img");
  imgElement.width = 480;
  const imgName = img.split(".")[0];

  imgElement.alt = imgName;

  root.insertAdjacentElement("beforeend", imgElement);

  fetch(`./img/${img}`)
    .then(res => {
      console.log(res);
      // console.log(res.url)
      return res.blob();
    })
    .then(data => {
      console.log(data);
      // creates blob: urls
      imgElement.src = URL.createObjectURL(data);
      // to avoid any memory leaks
      URL.revokeObjectURL(data);
    })
    .catch(error => console.error(error));
});