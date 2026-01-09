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
  168472: {
    // TODO expand to nested numbers with more than 8 digits
    type: "number",
    name: "number",
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
  8931602: {
    type: "color",
    name: "color",
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
  71704: {
    // call function with variable
    type: "any",
    name: "set", // and execute one spellpart
    value: (env, children) => {
      env[children[1].rune] = parseSpellPart(env, children[2]);
      env[children[3].rune] = parseSpellPart(env, children[4]);
      env[children[5].rune] = parseSpellPart(env, children[6]);
      return parseSpellPart(env, children[0]);
    },
  },
  287373: {
    // read variable
    type: "any", // matches variable
    name: "get",
    value: (env, children) => {
      return env[children[0].rune];
    },
  },

  // functions
  34996944: {
    type: "function",
    name: "function",
    value: () => (a, b, c, d, e, f, g) => {
      env[children[1].rune] = a;
      env[children[2].rune] = b;
      env[children[3].rune] = c;
      env[children[4].rune] = d;
      env[children[5].rune] = e;
      env[children[6].rune] = f;
      env[children[7].rune] = g;

      return this.parseSpellPart(env, children[0].rune);
    },
  },
  39592357: {
    type: "any",
    name: "apply function",
    value: () =>
      this.parseSpellPart(env, env[children[0].rune])(
        this.parseSpellPart(env, env[children[1].rune]),
        this.parseSpellPart(env, env[children[2].rune]),
        this.parseSpellPart(env, env[children[3].rune]),
        this.parseSpellPart(env, env[children[4].rune]),
        this.parseSpellPart(env, env[children[5].rune]),
        this.parseSpellPart(env, env[children[6].rune]),
        this.parseSpellPart(env, env[children[7].rune])
      ),
  },

  // boolean
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

  // implementation specific IO
  1148428: {
    // set background colors
    type: "empty",
    name: "set background",
    value: (env, children) => {
      console.log("setting background", parseSpellPart(env, children[0]));
      const target = document.getElementById("body");
      target.attributeStyleMap.set(
        "background-color",
        parseSpellPart(env, children[0])
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
// 34996944 define function?
// 773
// 402117
// 21009106
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
// 16416
// 417864
// 54
// 62
// 1051148
