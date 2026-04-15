const fileOrder = [
  "index",
  "plan",
  "introduction",
  "turing",
  "esoteric",
  "circle",
  "glyphs",
  "connection",
  "octagram",
];
let fileName = fileOrder[0];

window.onkeyup = (event) => {
  if (event.key !== "n") {
    return;
  }

  const reveals = document.getElementsByClassName("to-be-revealed");

  if (reveals.length) {
    reveals[0].classList.remove("to-be-revealed");
  } else {
    // console.log("Hi", fileName);
    // return;
    window.open(`${fileName}.html`, "_self");
  }
};

initPresentation = function () {
  previousFileName = window.location.href.split("/").pop().split(".")[0];

  console.log("hello", previousFileName);
  fileName =
    fileOrder[
      (fileOrder.findIndex((name) => name === previousFileName) + 1) %
        fileOrder.length
    ];

  const infoElement = document.getElementById("info");
  infoElement.classList.remove("info-hidden");
};

window.onload = initPresentation;
