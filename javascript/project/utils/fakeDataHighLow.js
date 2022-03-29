import { readFile } from "fs/promises";
import fs from "fs";

function saveJsonToFile(json, fileName) {
  return new Promise((resolve, reject) => {
    let jsonString = JSON.stringify(json);
    fs.writeFile(fileName, jsonString, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

let targetCategory = "fx";
let targetFile = "EURUSD_H4"; // real data file
let totalVolatility = 0;
let open_low = [];
let open_high = [];
let open_close = [];
let data = [];

const eur4h = JSON.parse(
  await readFile(
    new URL(`../data/${targetCategory}/${targetFile}.json`, import.meta.url)
  )
);

for (let i = 0; i < eur4h.length; i++) {
  data.push({
    OpenLow: eur4h[i].Open - eur4h[i].Low,
    OpenHigh: eur4h[i].Open - eur4h[i].High,
    OpenClose: eur4h[i].Open - eur4h[i].Close,
  });
}

saveJsonToFile(
  data,
  `../data/${targetCategory}/fake/${targetFile}-high-low.json`
);
