import csv from "csvtojson";
import fs from "fs";

// convert csv to json
function csvToJson(csvFilePath) {
  return new Promise((resolve, reject) => {
    csv({
      delimiter: ",",
    })
      .fromFile(csvFilePath)
      .then((jsonObj) => {
        resolve(jsonObj);
      });
  });
}

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

let targetFile = "fx/EURUSD-longM1";

csvToJson(`../data/${targetFile}.csv`).then((jsonObj) => {
  let json = [];
  jsonObj.forEach((element) => {
    json.push({
      Date: `${element["<DTYYYYMMDD>"]} ${element["<TIME>"]}`,
      Open: element["<OPEN>"],
      Close: element["<CLOSE>"],
      High: element["<HIGH>"],
      Low: element["<LOW>"],
    });
  });
  saveJsonToFile(json, `../data/${targetFile}.json`);
});
