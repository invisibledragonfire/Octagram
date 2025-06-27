console.log("HI");

const link = function (runeA, runeB) {
  console.log(runeA, runeB);
};

function dragstartHandler(ev) {
  console.log(`dragstart: effectAllowed = ${ev.dataTransfer.effectAllowed}`);

  // Add this element's id to the drag payload so the drop handler will
  // know which element to add to its tree
  console.log(ev.target.id);
  console.log(ev.target.id.split("rune")[1]);
  ev.dataTransfer.setData("startRune", ev.target.id.split("rune")[1]);
  ev.dataTransfer.effectAllowed = "move";
}

function dropHandler(ev) {
  console.log(`drop: effectAllowed = ${ev.dataTransfer.effectAllowed}`);

  ev.preventDefault();
  // Get the id of the target and add the element to the target's DOM
  const startRune = ev.dataTransfer.getData("startRune");
  const endRune = ev.target.id.split("rune")[1];

  const runes = [startRune, endRune].sort();

  const runeLinkProperty = `--link-${runes[0]}-${runes[1]}`;

  const linksElement = document.getElementById("links");
  console.log(linksElement);
  linksElement.attributeStyleMap.set(
    runeLinkProperty,
    1 - linksElement.attributeStyleMap.get(runeLinkProperty)
  );
  console.log(linksElement.attributeStyleMap);
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
