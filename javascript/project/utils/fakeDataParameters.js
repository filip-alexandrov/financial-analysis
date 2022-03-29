// Open-to-LastOpen should be equal to realData's Open-to-LastOpen
import Walk from "random-walk";
import fs from "fs";

// Parameters to optimize:
let paramBase = 1.1; // Starting price
let paramScale = 140; // Volatility
let beginLogging = 200; // Start logging after 200 records

const walk = new Walk();

let params = {
  pseudo: false, // Boolean: false = real random numbers (default), or true = psuedo random numbers
  rate: { min: 1, max: 1 }, // Desired rate in milliseconds: 100 (default) or {min: 50, max: 100} to randomly vary the rate
  type: "normal", // "normal" (default), "positive", "negative"
  base: paramBase, // 0 (default). Starting value. Can be any number.
  scale: paramScale, // 100 is normal (default), > 100 is less volatile, < 100 is more volatile
};

let generatedData = [];
generatedData.push({
  Time: -1,
  Open: paramBase,
  Difference: 0,
});
let time = 0;

setInterval(() => {
  if (generatedData.length > beginLogging) {
    let sum = generatedData.reduce((acc, curr) => {
      return acc + Math.abs(curr.Difference);
    }, 0);
    console.log("Open-to-LastOpen avg: ", sum / generatedData.length);
  }
}, 1000);

let even = false;
walk.on("result", (result) => {
  if (even == true) {
    even = false;
    // console.log(result);

    generatedData.push({
      Time: time,
      Open: result,
      Difference: generatedData[generatedData.length - 1].Open - result,
    });
    time++;
  } else if (even == false) {
    even = true;
  }
});

walk.get("walk", params);
