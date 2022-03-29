import Walk from "random-walk";
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

let totalRuns = 1; // 10 runs together
let runDuration = 10; // 1200 = ~65k records
let paramBase = 1; // Starting price (from fakeDataParameters.js)
let paramScale = 100; // Volatility (from fakeDataParameters.js)

for (let i = 0; i < totalRuns; i++) {
  const walk = new Walk();

  let params = {
    pseudo: false, // Boolean: false = real random numbers (default), or true = psuedo random numbers
    rate: { min: 1, max: 1 }, // Desired rate in milliseconds: 100 (default) or {min: 50, max: 100} to randomly vary the rate
    type: "normal", // "normal" (default), "positive", "negative"
    base: paramBase, // 0 (default). Starting value. Can be any number.
    scale: paramScale, // 100 is normal (default), > 100 is less volatile, < 100 is more volatile
  };

  let generatedData = [];
  let time = 0;

  setTimeout(() => {
    saveJsonToFile(generatedData, `./fakedata/generatedData-${i}.json`)
      .then(() => {
        console.log("Written to file");
      })
      .catch((err) => {
        console.log(err);
      });
  }, runDuration * 1000);

  let even = false;
  walk.on("result", (result) => {
    if (even == true) {
      even = false;

      generatedData.push({
        Time: time,
        Open: result,
      });
      time++;
    } else if (even == false) {
      even = true;
    }
  });

  walk.get("walk", params);
}
