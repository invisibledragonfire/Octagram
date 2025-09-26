function parseRunes(getRunesFunction) {
  console.log("test");
  const { main, nodes } = getRunesFunction();
  console.log("parsing", main, nodes);

  const result = runeMap[main].value(nodes.map((node) => runeMap[node].value));
  console.log(result);
  const resultElement = document.getElementById("spell-result");
  resultElement.innerText = result;
}

runeMap = {
  0: { type: "nothing", value: null },

  //numbers
  4: { type: "number", value: 1 },
  4489250: { type: "number", value: 2 },
  22: { type: "number", value: 3 },
  65554: { type: "number", value: 4 },
  335905: { type: "number", value: 5 },
  524310: { type: "number", value: 6 },
  32904: { type: "number", value: 7 },
  599073: { type: "number", value: 8 },
  10748225: { type: "number", value: 9 },

  //arithmatic
  2052: {
    type: "number",
    value: (nodes) => nodes.reduce((sum, add) => sum + add),
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
