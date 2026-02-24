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

const RUNE = {
  EMPTY: 0,
  //numbers
  ZERO: 34087073,
  ONE: 4,
  TWO: 4489250,
  THREE: 22,
  FOUR: 65554,
  FIVE: 335905,
  SIX: 524310,
  SEVEN: 32904,
  EIGHT: 599073,
  NINE: 10748225,
  NUMBER: 168472,
  //arithmetic
  ADD: 2052,
  //colors
  COLOR: 8931602,
  //variables
  SET: 71704,
  GET: 287373,
  VAR_X: 16416, //no definition, just used as variable
  VAR_Y: 417864, //no definition, just used as variable
  //boolean
  TRUE: 81960,
  FALSE: 522,
  GREATER: 2,
  //functions
  FUNCTION: 21009106,
  APPLY_FUNCTION: 39592357,
  //logic
  IF: 1041,
  WHILE: 3089,
  //io
  SET_BACKGROUND: 1148428,
};

const runeMap = {
  [RUNE.EMPTY]: {
    type: "empty",
    value: () => null,
  },

  //numbers
  [RUNE.ZERO]: { type: "number", value: () => 0 },
  [RUNE.ONE]: { type: "number", value: () => 1 },
  [RUNE.TWO]: { type: "number", value: () => 2 },
  [RUNE.THREE]: { type: "number", value: () => 3 },
  [RUNE.FOUR]: { type: "number", value: () => 4 },
  [RUNE.FIVE]: { type: "number", value: () => 5 },
  [RUNE.SIX]: { type: "number", value: () => 6 },
  [RUNE.SEVEN]: { type: "number", value: () => 7 },
  [RUNE.EIGHT]: { type: "number", value: () => 8 },
  [RUNE.NINE]: { type: "number", value: () => 9 },
  [RUNE.NUMBER]: {
    // TODO expand to nested numbers with more than 8 digits
    type: "number",
    value: (env, children) => {
      base = 8;
      mult = 1;
      sum = 0;
      children
        .map((child) => parseSpellPart(env, child))
        .forEach((value) => {
          sum += value * mult;
          mult *= base;
        });
      return sum;
    },
  },

  // arithmatic
  [RUNE.ADD]: {
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
  [RUNE.COLOR]: {
    type: "color",
    value: (env, children) => {
      let r = 0,
        g = 0,
        b = 0;
      let mult = 1;
      if (children) {
        for (const child of children) {
          r += (parseSpellPart(env, child) & 1) * mult;
          g += (parseSpellPart(env, child) & 2) * mult;
          b += (parseSpellPart(env, child) & 4) * mult;
          mult *= 2;
        }
      }
      return "rgb(" + r + "," + g + "," + b + ")";
    },
  },

  // variables
  [RUNE.SET]: {
    // set variable and execute one spellpart
    type: "any",
    value: (env, children) => {
      env[children[1].rune] = parseSpellPart(env, children[2]);
      env[children[3].rune] = parseSpellPart(env, children[4]);
      env[children[5].rune] = parseSpellPart(env, children[6]);
      return parseSpellPart(env, children[0]);
    },
  },
  [RUNE.GET]: {
    // read variable
    type: "any", // matches variable
    value: (env, children) => {
      return env[children[0].rune];
    },
  },

  // functions
  [RUNE.FUNCTION]: {
    type: "function",
    value: (env, children) => (a, b, c, d, e, f, g) => {
      env[children[1].rune] = a;
      env[children[2].rune] = b;
      env[children[3].rune] = c;
      env[children[4].rune] = d;
      env[children[5].rune] = e;
      env[children[6].rune] = f;
      env[children[7].rune] = g;

      return this.parseSpellPart(env, children[0]);
    },
  },
  [RUNE.APPLY_FUNCTION]: {
    type: "any",
    value: (env, children) =>
      this.parseSpellPart(env, children[0])(
        this.parseSpellPart(env, children[1]),
        this.parseSpellPart(env, children[2]),
        this.parseSpellPart(env, children[3]),
        this.parseSpellPart(env, children[4]),
        this.parseSpellPart(env, children[5]),
        this.parseSpellPart(env, children[6]),
        this.parseSpellPart(env, children[7])
      ),
  },

  // boolean
  [RUNE.TRUE]: { type: "boolean", value: () => true },
  [RUNE.FALSE]: { type: "boolean", value: () => false },
  [RUNE.GREATER]: {
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

  // references
  // parent reference???
  // self reference???
  // target reference

  // control structures
  [RUNE.IF]: {
    // if
    type: "control",
    value: (env, children) => {
      if (parseSpellPart(env, children[0])) {
        return parseSpellPart(env, children[1]);
      } else if (parseSpellPart(env, children[2])) {
        return parseSpellPart(env, children[3]);
      } else if (parseSpellPart(env, children[4])) {
        return parseSpellPart(env, children[5]);
      } else {
        return parseSpellPart(env, children[7]);
      }
      // unused: parseSpellPart(env, children[6]);
    },
  },
  [RUNE.WHILE]: {
    // while
    type: "control",
    value: (env, children) => {
      while (parseSpellPart(env, children[0])) {
        children.slice(1).map((child) => parseSpellPart(env, child));
      }
    },
  },

  // implementation specific IO
  [RUNE.SET_BACKGROUND]: {
    // set background colors
    type: "empty",
    value: (env, children) => {
      const target = document.getElementById("body");
      target.attributeStyleMap.set(
        "background-color",
        parseSpellPart(env, children[7])
      );
    },
  },
};

// interesting runes:

// 168472 number?
// 541332
// 297024
// 9752
// 65564
// 164882
// 528
// 8931602 color?
// 1148428 set background color?
// 542992
// 1125004
// 533010
// 4326600
// 34996944
// 773
// 402117
// 21009106 define function?
// 5391393
// 34087345
// 270729
// 258
// 39592357 use function?
// 20155932
// 71704
// 2
// 4210721
// 66564
// 16416 // var x
// 417864 // var y
// 54
// 62
// 1051148
