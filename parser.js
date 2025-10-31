function parseSpell(spell) {
  console.log("parsing", spell);
  const result = parseSpellPart({}, spell);
  const resultElement = document.getElementById("spell-result");
  resultElement.innerText = result;
  console.log(result);
}

function parseSpellPart(env, spell) {
  if (!spell) {
    return null;
  }
  const result = runeMap[spell.rune].value(env, spell.children);
  return result;
}

// Categories:
const categories = ["empty", "numbers", "logic"];
const c = function (name) {
  return categories.findIndex((category) => category === name);
};
console.log(c("empty"), c("logic"), c("numbers"));

const runeMap = {
  0: {
    type: "empty",
    category: c("empty"),
    name: "empty",
    value: () => null,
  },

  //numbers
  34087073: { type: "number", name: "0", value: () => 0 },
  4: { type: "number", name: "1", value: () => 1 },
  4489250: { type: "number", name: "2", value: () => 2 },
  22: { type: "number", name: "3", value: () => 3 },
  65554: { type: "number", name: "4", value: () => 4 },
  335905: { type: "number", name: "5", value: () => 5 },
  524310: { type: "number", name: "6", value: () => 6 },
  32904: { type: "number", name: "7", value: () => 7 },
  599073: { type: "number", name: "8", value: () => 8 },
  10748225: { type: "number", name: "9", value: () => 9 },

  // arithmatic
  2052: {
    // add
    type: "number",
    name: "add",
    value: (env, children) =>
      children
        .map((child) => parseSpellPart(env, child))
        .reduce((sum, add) => sum + add),
  },

  // elements

  // attacks

  // colours

  // variables
  71704: {
    // set variables
    type: "variable",
    name: "set",
    value: (env, children) => {
      env[children[0]] = children[1];
      env[children[2]] = children[3];
      env[children[4]] = children[5];
      env[children[6]] = children[7];
    },
  },
  287373: {
    // read variable
    type: "any", // matches variable
    name: "get",
    value: (env, children) => {
      return env[children[0]];
    },
  },

  //boolean
  81960: { type: "boolean", name: "true", value: () => true },
  522: { type: "boolean", name: "false", value: () => false },
  2: {
    // comparison
    type: "boolean",
    name: ">",
    value: (env, children) => {
      return (
        parseSpellPart(env, children[1]) > parseSpellPart(env, children[3]) &&
        parseSpellPart(env, children[1]) > parseSpellPart(env, children[4]) &&
        parseSpellPart(env, children[1]) > parseSpellPart(env, children[5]) &&
        parseSpellPart(env, children[1]) > parseSpellPart(env, children[6]) &&
        parseSpellPart(env, children[1]) > parseSpellPart(env, children[7])
      );
    },
  },

  // references
  // parent reference???
  // self reference???
  // target reference

  // control structures
  1041: {
    // if
    type: "control",
    name: "if",
    value: (env, children) => {
      if (parseSpellPart(env, children[0])) {
        parseSpellPart(env, children[1]);
      } else if (parseSpellPart(env, children[2])) {
        parseSpellPart(env, children[3]);
      } else if (parseSpellPart(env, children[4])) {
        parseSpellPart(env, children[5]);
      } else if (parseSpellPart(env, children[6])) {
        parseSpellPart(env, children[7]);
      } else {
        parseSpellPart(env, children[8]);
      }
    },
  },
  3089: {
    // while
    type: "control",
    name: "while",
    value: (env, children) => {
      while (parseSpellPart(env, children[0])) {
        children.slice(1).map((child) => parseSpellPart(env, child));
      }
    },
  },
};

// interesting runes:

// 168472
// 541332
// 297024
// 9752
// 65564
// 164882
// 528
// 8931602
// 1148428
// 542992
// 1125004
// 533010
// 4326600
// 34996944
// 773
// 402117
// 21009106
// 5391393
// 34087345
// 270729
// 258
// 39592357
// 20155932
