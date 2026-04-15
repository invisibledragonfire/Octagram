getBasicSpellFromRune = (rune) => ({
  rune,
  children: [
    { rune: RUNE.EMPTY, number: 1 },
    { rune: RUNE.EMPTY, number: 2 },
    { rune: RUNE.EMPTY, number: 3 },
    { rune: RUNE.EMPTY, number: 4 },
    { rune: RUNE.EMPTY, number: 5 },
    { rune: RUNE.EMPTY, number: 6 },
    { rune: RUNE.EMPTY, number: 7 },
    { rune: RUNE.EMPTY, number: 8 },
  ],
});

fillWithEmpty = (runeList) => {
  const existing = {};
  for (const runeEntry of runeList) {
    existing[runeEntry.number] = runeEntry;
  }

  const filledRuneList = [];
  for (let i = 1; i <= 8; i++) {
    filledRuneList.push(existing[i] || { rune: RUNE.EMPTY, number: i });
  }
  return filledRuneList;
};

const spellbook = [
  {
    title: "utility",
    spells: [{ name: "empty", spell: getBasicSpellFromRune(RUNE.EMPTY) }],
  },
  {
    title: "numbers",
    spells: [
      { name: "0", spell: getBasicSpellFromRune(RUNE.ZERO) },
      { name: "1", spell: getBasicSpellFromRune(RUNE.ONE) },
      { name: "2", spell: getBasicSpellFromRune(RUNE.TWO) },
      { name: "3", spell: getBasicSpellFromRune(RUNE.THREE) },
      { name: "4", spell: getBasicSpellFromRune(RUNE.FOUR) },
      { name: "5", spell: getBasicSpellFromRune(RUNE.FIVE) },
      { name: "6", spell: getBasicSpellFromRune(RUNE.SIX) },
      { name: "7", spell: getBasicSpellFromRune(RUNE.SEVEN) },
      { name: "8", spell: getBasicSpellFromRune(RUNE.EIGHT) },
      { name: "9", spell: getBasicSpellFromRune(RUNE.NINE) },
      { name: "Number", spell: getBasicSpellFromRune(RUNE.NUMBER) },
    ],
  },
  {
    title: "arithmetic",
    spells: [{ name: "add", spell: getBasicSpellFromRune(RUNE.ADD) }],
  },
  {
    title: "colors",
    spells: [
      { name: "color", spell: getBasicSpellFromRune(RUNE.COLOR) },
      {
        name: "orange",
        spell: {
          rune: RUNE.COLOR,
          children: fillWithEmpty([
            { ...getBasicSpellFromRune(RUNE.THREE), number: 7 },
            { ...getBasicSpellFromRune(RUNE.ONE), number: 8 },
          ]),
        },
      },
    ],
  },
  {
    title: "elements",
    spells: [
      { name: "Fire", spell: getBasicSpellFromRune(RUNE.FIRE) },
      { name: "Water", spell: getBasicSpellFromRune(RUNE.WATER) },
      { name: "Earth", spell: getBasicSpellFromRune(RUNE.EARTH) },
      { name: "Air", spell: getBasicSpellFromRune(RUNE.AIR) },
    ],
  },
  {
    title: "variables",
    spells: [
      { name: "set", spell: getBasicSpellFromRune(RUNE.SET) },
      { name: "get", spell: getBasicSpellFromRune(RUNE.GET) },
    ],
  },
  {
    title: "boolean",
    spells: [
      { name: "true", spell: getBasicSpellFromRune(RUNE.TRUE) },
      { name: "false", spell: getBasicSpellFromRune(RUNE.FALSE) },
      { name: ">", spell: getBasicSpellFromRune(RUNE.GREATER) },
    ],
  },
  {
    title: "functions",
    spells: [
      { name: "function", spell: getBasicSpellFromRune(RUNE.FUNCTION) },
      { name: "apply", spell: getBasicSpellFromRune(RUNE.APPLY_FUNCTION) },
    ],
  },
  {
    title: "logic",
    spells: [
      { name: "if", spell: getBasicSpellFromRune(RUNE.IF) },
      { name: "while", spell: getBasicSpellFromRune(RUNE.WHILE) },
    ],
  },
  {
    title: "I/O",
    spells: [
      {
        name: "set background",
        spell: getBasicSpellFromRune(RUNE.SET_BACKGROUND),
      },
    ],
  },
  {
    title: "spells",
    spells: [
      {
        name: "2+3",
        spell: {
          rune: RUNE.ADD,
          children: fillWithEmpty([
            { ...getBasicSpellFromRune(RUNE.TWO), number: 1 },
            { ...getBasicSpellFromRune(RUNE.THREE), number: 2 },
          ]),
        },
      },
      {
        name: "2*5",
        spell: {
          rune: RUNE.APPLY_FUNCTION,
          children: fillWithEmpty([
            {
              ...getBasicSpellFromRune(RUNE.FUNCTION),
              number: 1,
              children: fillWithEmpty([
                {
                  rune: RUNE.ADD,
                  number: 1,
                  children: fillWithEmpty([
                    {
                      rune: RUNE.GET,
                      number: 1,
                      children: fillWithEmpty([
                        { rune: RUNE.VAR_X, number: 1 },
                      ]),
                    },
                    {
                      rune: RUNE.GET,
                      number: 2,
                      children: fillWithEmpty([
                        { rune: RUNE.VAR_X, number: 1 },
                      ]),
                    },
                  ]),
                },
                { rune: RUNE.VAR_X, number: 2 },
              ]),
            },
            { ...getBasicSpellFromRune(RUNE.FIVE), number: 2 },
          ]),
        },
      },
      {
        name: "Fibonacci",
        spell: {
          rune: RUNE.APPLY_FUNCTION,
          children: fillWithEmpty([
            {
              rune: RUNE.FUNCTION,
              number: 1,
              children: fillWithEmpty([
                {
                  rune: RUNE.WHILE,
                  number: 1,
                  children: fillWithEmpty([
                    {
                      rune: RUNE.GREATER,
                      number: 1,
                      children: fillWithEmpty([
                        {
                          rune: RUNE.GET,
                          number: 2,
                          children: fillWithEmpty([
                            {
                              rune: RUNE.VAR_V,
                              number: 1,
                            },
                          ]),
                        },
                        {
                          rune: RUNE.GET,
                          number: 4,
                          children: fillWithEmpty([
                            {
                              rune: RUNE.VAR_COUNT,
                              number: 1,
                            },
                            { rune: RUNE.ZERO, number: 2 },
                          ]),
                        },
                      ]),
                    },
                    {
                      rune: RUNE.SET,
                      number: 2,
                      children: fillWithEmpty([
                        { rune: RUNE.ZERO, number: 1 },
                        {
                          rune: RUNE.VAR_COUNT,
                          number: 2,
                        },
                        {
                          rune: RUNE.ADD,
                          number: 3,
                          children: fillWithEmpty([
                            {
                              rune: RUNE.GET,
                              number: 1,
                              children: fillWithEmpty([
                                {
                                  rune: RUNE.VAR_COUNT,
                                  number: 1,
                                },
                                { rune: RUNE.ZERO, number: 2 },
                              ]),
                            },
                            { rune: RUNE.ONE, number: 2 },
                          ]),
                        },
                      ]),
                    },
                    {
                      rune: RUNE.APPLY_FUNCTION,
                      number: 3,
                      children: fillWithEmpty([
                        {
                          rune: RUNE.GET,
                          number: 1,
                          children: fillWithEmpty([
                            { rune: RUNE.VAR_W, number: 1 },
                          ]),
                        },
                      ]),
                    },
                  ]),
                },
                { rune: RUNE.VAR_W, number: 2 },
                { rune: RUNE.VAR_V, number: 3 },
              ]),
            },
            {
              rune: RUNE.FUNCTION,
              number: 2,
              children: fillWithEmpty([
                {
                  rune: RUNE.SET,
                  number: 1,
                  children: fillWithEmpty([
                    {
                      rune: RUNE.GET,
                      number: 1,
                      children: fillWithEmpty([
                        { rune: RUNE.VAR_X, number: 1 },
                      ]),
                    },
                    { rune: RUNE.VAR_X, number: 2 },
                    {
                      rune: RUNE.ADD,
                      number: 3,
                      children: fillWithEmpty([
                        {
                          rune: RUNE.GET,
                          number: 1,
                          children: fillWithEmpty([
                            { rune: RUNE.VAR_Y, number: 1 },
                            { rune: RUNE.ZERO, number: 2 },
                          ]),
                        },
                        {
                          rune: RUNE.GET,
                          number: 2,
                          children: fillWithEmpty([
                            { rune: RUNE.VAR_Z, number: 1 },
                            { rune: RUNE.ONE, number: 2 },
                          ]),
                        },
                      ]),
                    },
                    { rune: RUNE.VAR_Z, number: 4 },
                    {
                      rune: RUNE.GET,
                      number: 5,
                      children: fillWithEmpty([
                        { rune: RUNE.VAR_Y, number: 1 },
                        { rune: RUNE.ZERO, number: 2 },
                      ]),
                    },
                    { rune: RUNE.VAR_Y, number: 6 },
                    {
                      rune: RUNE.GET,
                      number: 7,
                      children: fillWithEmpty([
                        { rune: RUNE.VAR_X, number: 1 },
                        { rune: RUNE.ZERO, number: 2 },
                      ]),
                    },
                  ]),
                },
              ]),
            },
            {
              ...getBasicSpellFromRune(RUNE.FIVE),
              number: 3,
            },
          ]),
        },
      },
    ],
  },
];

const spellBookMap = {};
for (const section of spellbook) {
  for (const spell of section.spells) {
    spellBookMap[`${section.title}_${spell.name}`] = spell.spell;
  }
}
