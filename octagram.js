spell = {
  rune: 0,
  children: [
    { rune: 0, number: 1 },
    { rune: 0, number: 2 },
    { rune: 0, number: 3 },
    { rune: 0, number: 4 },
    { rune: 0, number: 5 },
    { rune: 0, number: 6 },
    { rune: 0, number: 7 },
    { rune: 0, number: 8 },
  ],
};
currentPosition = [];
currentCircle = spell;
currentChildrenWithoutOffset = [...spell.children];
currentBreadCrumb = null;

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

function getRuneIdNumber(idString) {
  return idString.split("rune")[1];
}

function findCircleValue() {
  let circleValue = 1 << 29;
  for (let offset = 0; offset < 8; offset++) {
    val = calculateCircleValue(offset);
    if (circleValue > val) {
      circleValue = val;
      globalOffset = offset;
    }
  }
  return circleValue;
}

function updateCircleValue(circleValue) {
  globalCircleValue = circleValue;

  const resultElement = document.getElementById("result");
  resultElement.attributeStyleMap.set("--rune-value", circleValue);

  currentCircle.rune = circleValue;

  let currentChildren = [...currentChildrenWithoutOffset];

  console.log(globalOffset);
  console.log(currentChildren.slice(globalOffset, -1));
  console.log(currentChildrenWithoutOffset.slice(0, globalOffset));

  currentCircle.children = currentChildren
    .slice(globalOffset)
    .concat(currentChildrenWithoutOffset.slice(0, globalOffset));

  console.log(currentCircle.children);

  currentBreadCrumb.attributeStyleMap.set("--rune-value", circleValue);
}

function dragstartHandler(ev) {
  ev.dataTransfer.setData("startRune", getRuneIdNumber(ev.target.id));
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
    const runeValue = ev.dataTransfer.getData("runeValue");
    target.attributeStyleMap.set("--rune-value", runeValue);

    const targetRuneNumber = getRuneIdNumber(ev.target.id);
    currentChildrenWithoutOffset[targetRuneNumber - 1].rune = runeValue;

    return;
  }

  const startRune = ev.dataTransfer.getData("startRune");
  const endRune = getRuneIdNumber(ev.target.id);

  const runes = [startRune, endRune].sort();

  const runeLinkProperty = `--link-${runes[0]}-${runes[1]}`;

  const linksElement = document.getElementById("links");
  const oldValue = connections[runeLinkProperty] || 0;
  const newValue = 1 - oldValue;

  connections[runeLinkProperty] = newValue;
  linksElement.attributeStyleMap.set(runeLinkProperty, newValue);

  updateCircleValue(findCircleValue(startRune, endRune));
}

function dragoverHandler(ev) {
  ev.preventDefault();
}

function loadFromSpellbook(event) {
  const style = window.getComputedStyle(event.srcElement);
  const runeValue = style.getPropertyValue("--rune-value");
  loadCircle(runeValue);
  updateCircleValue(runeValue);
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

function initSpellbook() {}

function moveToSubCircle(event) {
  const style = window.getComputedStyle(event.srcElement);
  const runeValue = style.getPropertyValue("--rune-value");
  const runeNumber = getRuneIdNumber(event.srcElement.id);

  if (!runeNumber) {
    return;
  }

  loadCircle(runeValue);

  currentPosition.push(runeNumber);
  currentCircle = currentCircle.children[runeNumber - 1];

  if (!currentCircle.children) {
    currentCircle.children = Array.from(Array(8)).map(() => ({
      rune: 0,
    }));
  }

  currentChildrenWithoutOffset = [...currentCircle.children];

  for (let n = 1; n <= 8; n++) {
    setRune(n, currentChildrenWithoutOffset[n - 1].rune);
  }

  addBreadcrumb(runeValue);
}

function setRune(runeNumber, runeValue) {
  const target = document.getElementById(`rune${runeNumber}`);
  target.attributeStyleMap.set("--rune-value", runeValue);
}

function addBreadcrumb(runeValue) {
  const crumbContainer = document.getElementById("bread-crumbs");
  const crumbTemplate = document.getElementById("crumb-template");
  const crumbArrowTemplate = document.getElementById("crumb-arrow-template");

  const crumb = crumbTemplate.content.cloneNode(true);
  crumb.children[0].attributeStyleMap.set("--rune-value", runeValue);
  currentBreadCrumb = crumb.children[0];

  const crumbArrow = crumbArrowTemplate.content.cloneNode(true);

  crumbContainer.append(crumbArrow);
  crumbContainer.append(crumb);
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
  castButton.addEventListener("click", () => parseSpell(spell));

  currentBreadCrumb = document.getElementById("crumb-1");
};

window.onload = init;
