console.log("HI");

const link = function (runeA, runeB) {
  console.log(runeA, runeB);
};

function dragstartHandler(ev) {
  console.log(`dragstart: effectAllowed = ${ev.dataTransfer.effectAllowed}`);

  // Add this element's id to the drag payload so the drop handler will
  // know which element to add to its tree
  ev.dataTransfer.setData("text", ev.target.id);
  ev.dataTransfer.effectAllowed = "move";
}

function dropHandler(ev) {
  console.log(`drop: effectAllowed = ${ev.dataTransfer.effectAllowed}`);

  ev.preventDefault();
  // Get the id of the target and add the element to the target's DOM
  const data = ev.dataTransfer.getData("text");
  console.log("Drag complete ");
}

function dragoverHandler(ev) {
  console.log(`dragover: effectAllowed = ${ev.dataTransfer.effectAllowed}`);
  ev.preventDefault();
}

const init = function () {
  const runes = document.querySelectorAll(".rune");

  for (const rune of runes) {
    rune.addEventListener("dragstart", dragstartHandler);
    rune.addEventListener("dragover", dragoverHandler);
    rune.addEventListener("drop", dropHandler);
  }
};

window.onload = init;
