import csv from "csvtojson";
import fs from "fs";

// convert csv to json
function csvToJson(csvFilePath) {
  return new Promise((resolve, reject) => {
    csv({
      delimiter: "\t",
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

let targetFile = "fx/EURUSD_M30";

csvToJson(`./data/${targetFile}.csv`).then((jsonObj) => {
  saveJsonToFile(jsonObj, `./data/${targetFile}.json`);
});
