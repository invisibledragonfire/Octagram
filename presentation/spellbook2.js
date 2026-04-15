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

const spellbook = [
  {
    title: "runes",
    spells: Object.values(RUNE).map((rune) => ({
      name: rune,
      spell: getBasicSpellFromRune(rune),
    })),
  },
];

const spellBookMap = {};
for (const section of spellbook) {
  for (const spell of section.spells) {
    spellBookMap[`${section.title}_${spell.name}`] = spell.spell;
  }
}
