import { readFile } from "fs/promises";

const json = JSON.parse(
  await readFile(new URL("./data/fx/EURUSD_H4.json", import.meta.url))
);
// console.log(json[0]);

for (let item of json) {
  console.log(item.Time);
}
