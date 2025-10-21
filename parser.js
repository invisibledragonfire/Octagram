function parseSpell(spell) {
  const result = parseSpellPart({}, spell);
  const resultElement = document.getElementById("spell-result");
  resultElement.innerText = result;
}

function parseSpellPart(env, spell) {
  if (!spell) {
    return null;
  }
  console.log("parsing", spell);

  const result = runeMap[spell.rune].value(env, spell.children);
  console.log(result);
  return result;
}

runeMap = {
  0: { type: "nothing", value: () => null },

  //numbers
  4: { type: "number", value: () => 1 },
  4489250: { type: "number", value: () => 2 },
  22: { type: "number", value: () => 3 },
  65554: { type: "number", value: () => 4 },
  335905: { type: "number", value: () => 5 },
  524310: { type: "number", value: () => 6 },
  32904: { type: "number", value: () => 7 },
  599073: { type: "number", value: () => 8 },
  10748225: { type: "number", value: () => 9 },

  // arithmatic
  2052: {
    // add
    type: "number",
    value: (env, children) =>
      children
        .map((child) => parseSpellPart(env, child))
        .reduce((sum, add) => sum + add),
  },

  // elements

  // attacks

  // colours

  // variables

  //boolean
  81960: { type: "boolean", value: () => true },
  522: { type: "boolean", value: () => false },
  2: {
    // comparison
    type: "boolean",
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

  // control structures
  1041: {
    // if
    type: "control",
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
