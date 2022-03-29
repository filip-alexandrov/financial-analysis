import { readFile } from "fs/promises";

const eur4h = JSON.parse(
  await readFile(new URL("../data/fx/EURUSD_H4.json", import.meta.url))
);

let totalVolatility = 0;
for (let i = 0; i < eur4h.length; i++) {
  if (i == 0) {
    continue;
  }
  // console.log(eur4h[i].Open);
  totalVolatility += Math.abs(eur4h[i].Open - eur4h[i - 1].Open);
}

console.log("Open-to-LastOpen avg: ", totalVolatility / eur4h.length);
