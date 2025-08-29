globalCircleValue = 0;
globalOffset = 0;
connections = {};
function calculateCircleValue(offset) {
  let circleValue = 0;
  let i = 0;
  for (let a = 1; a <= 7; a++) {
    for (let b = a + 1; b <= 8; b++) {
      const [x, y] = [
        ((a + offset - 1) % 8) + 1,
        ((b + offset - 1) % 8) + 1,
      ].sort();
      connections[`--link-${x}-${y}`] && (circleValue = circleValue | (1 << i));
      i++;
    }
  }
  return circleValue;
}

function updateCircleValue() {
  let circleValue = 1 << 29;
  for (let offset = 0; offset < 8; offset++) {
    val = calculateCircleValue(offset);
    if (circleValue > val) {
      circleValue = val;
      globalOffset = offset;
    }
  }
  globalCircleValue = circleValue;

  const resultElement = document.getElementById("result");
  resultElement.attributeStyleMap.set("--rune-value", circleValue);
}

function dragstartHandler(ev) {
  ev.dataTransfer.setData("startRune", ev.target.id.split("rune")[1]);
  ev.dataTransfer.dropEffect = "link";
  ev.dataTransfer.effectAllowed = "link";
}

function spellbookDragstartHandler(ev) {
  const style = window.getComputedStyle(ev.target);
  const runeValue = style.getPropertyValue("--rune-value");
  ev.dataTransfer.setData("runeValue", runeValue);
  ev.dataTransfer.dropEffect = "copy";
  ev.dataTransfer.effectAllowed = "copy";
}

function dropHandler(ev) {
  ev.preventDefault();

  if (ev.dataTransfer.effectAllowed === "copy") {
    const target = document.getElementById(ev.target.id);
    target.attributeStyleMap.set(
      "--rune-value",
      ev.dataTransfer.getData("runeValue")
    );
    return;
  }

  const startRune = ev.dataTransfer.getData("startRune");
  const endRune = ev.target.id.split("rune")[1];

  const runes = [startRune, endRune].sort();

  const runeLinkProperty = `--link-${runes[0]}-${runes[1]}`;

  const linksElement = document.getElementById("links");
  const oldValue = connections[runeLinkProperty] || 0;
  const newValue = 1 - oldValue;

  connections[runeLinkProperty] = newValue;
  linksElement.attributeStyleMap.set(runeLinkProperty, newValue);

  updateCircleValue(startRune, endRune);
}

function dragoverHandler(ev) {
  ev.preventDefault();
}

function getRunes() {
  const runes = document.querySelectorAll(".magic-circle .rune");
  const runeList = [];

  for (const rune of runes) {
    const style = window.getComputedStyle(rune);
    const runeValue = style.getPropertyValue("--rune-value");
    console.log(runeValue);

    runeList.push({ runeValue, id: rune.id });
  }

  runeList.sort(
    (runeA, runeB) =>
      ((Number(runeA.id.slice(4)) + globalOffset - 1) % runes.length) -
      ((Number(runeB.id.slice(4)) + globalOffset - 1) % runes.length)
  );

  return {
    main: globalCircleValue,
    nodes: runeList.map((rune) => Number(rune.runeValue)),
  };
}

function loadFromSpellbook(event) {
  const style = window.getComputedStyle(event.srcElement);
  const runeValue = style.getPropertyValue("--rune-value");
  loadCircle(runeValue);
}

function loadCircle(circleValue) {
  const linksElement = document.getElementById("links");

  globalOffset = 0;
  globalCircleValue = circleValue;
  let i = 0;
  for (let a = 1; a <= 7; a++) {
    for (let b = a + 1; b <= 8; b++) {
      const runeLinkProperty = `--link-${a}-${b}`;
      const linkValue = Number(!!(circleValue & (1 << i)));
      i++;

      connections[runeLinkProperty] = linkValue;
      linksElement.attributeStyleMap.set(runeLinkProperty, linkValue);
    }
  }
}

const init = function () {
  const spellbookRunes = document.querySelectorAll(".spellbook .rune");
  for (const rune of spellbookRunes) {
    rune.addEventListener("dragstart", spellbookDragstartHandler);
  }

  const runes = document.querySelectorAll(".magic-circle .rune");

  for (const rune of runes) {
    rune.addEventListener("dragstart", dragstartHandler);
    rune.addEventListener("dragover", dragoverHandler);
    rune.addEventListener("drop", dropHandler);
  }

  const castButton = document.getElementById("cast-button");
  castButton.addEventListener("click", () => parseRunes(getRunes));
};

window.onload = init;
