import Atr from "./indicators/atr.js";
import TsiMacd from "./indicators/tsi_macd.js";
import Kama from "./indicators/kama.js";
import Rex from "./indicators/rex.js";
import VolatilityRange from "./indicators/VolatilityRange.js";
import Vqh from "./indicators/vqh.js";
import MarketData from "./MarketData.js";
import { PositionControl, TradeControlVQH } from "./TradeControlVQH.js";
import { TradeControlTsiMacd } from "./TradeControlTsiMacd.js";

import fs from "fs";
import { create, all } from "mathjs";
const config = {};
const math = create(all, config);
import cliProgress from "cli-progress";

let atr = new Atr();
let tsi_macd = new TsiMacd();
let kama = new Kama();
let rex = new Rex();
let volatilityRange = new VolatilityRange();
let vqh = new Vqh();
let data = new MarketData("fx", "EURUSD_H4");

// console.log(atr.calculate([high, low, close], 14));
// console.log(tsi_macd.calculate(8, 21, 8, 5, 9, [close]));
// console.log(kama.calculate([close], 21));
// console.log(rex.calculate(14, 14, [close, open, low, high]));
// console.log(volatilityRange.calculate(8, 13, 6, 100, -10, 10, [close]));
/* console.log(
  math.matrixFromColumns(
    date,
    vqh.calculate(7, 2, 0.00001, [high, low, open, close])
  )
); */

/* atr.calculate([data.high, data.low, data.close], 14);
tsi_macd.calculate(8, 21, 8, 5, 9, [data.close]);
kama.calculate([data.close], 21);
rex.calculate(14, 14, [data.close, data.open, data.low, data.high]);
volatilityRange.calculate(8, 13, 6, 100, -10, 10, [data.close]);
vqh.calculate(7, 2, 0.00001, [data.high, data.low, data.open, data.close]);

console.log(atr.getValue(data.high.length - 1)); */

let tcTsiMacd = new TradeControlTsiMacd({
  maxParameter: 50,
  reducerMaxParam: 5,
  maxTestIteration: 5,
  numberTestArrays: 2,
  testSize: 2,
});

while (tcTsiMacd.continueTrading() == true) {
  let iterationCounter = 0;
  console.log("Progress on iteration: ", tcTsiMacd.testIteration);

  const progressBar = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic
  );
  progressBar.start(tcTsiMacd.totalIterations(), 0);

  for (let testFastLength of tcTsiMacd.fastLength) {
    for (let testSlowLength of tcTsiMacd.slowLength) {
      for (let testFirstR of tcTsiMacd.firstR) {
        for (let testSecondS of tcTsiMacd.secondS) {
          for (let testSignalLength of tcTsiMacd.signalLength) {
            tsi_macd.calculate(
              testFastLength,
              testSlowLength,
              testFirstR,
              testSecondS,
              testSignalLength,
              [data.close]
            );

            let pc = new PositionControl();

            for (let i = 0; i < data.date.length; i++) {
              if (tsi_macd.getValue(i)[0] == tsi_macd.getValue(i)[1]) {
                continue;
              }

              if (pc.positionOpened == false) {
                if (tsi_macd.getValue(i)[0] > tsi_macd.getValue(i)[1]) {
                  pc.openPosition(data.open[i + 1], data.date[i + 1], "long");
                  pc.positionOpened = true;
                  continue;
                } else if (tsi_macd.getValue(i)[0] < tsi_macd.getValue(i)[1]) {
                  pc.openPosition(data.open[i + 1], data.date[i + 1], "short");
                  pc.positionOpened = true;
                  continue;
                }
              }

              if (
                pc.positionOpened == true &&
                pc.lastTradeType() == "short" &&
                tsi_macd.getValue(i)[0] > tsi_macd.getValue(i)[1]
              ) {
                pc.closePosition(data.open[i + 1], data.date[i + 1]);
                pc.openPosition(data.open[i + 1], data.date[i + 1], "long");
                continue;
              } else if (
                pc.positionOpened == true &&
                pc.lastTradeType() == "long" &&
                tsi_macd.getValue(i)[0] < tsi_macd.getValue(i)[1]
              ) {
                pc.positionOpened == true &&
                  pc.closePosition(data.open[i + 1], data.date[i + 1]);
                pc.openPosition(data.open[i + 1], data.date[i + 1], "short");
                continue;
              }
            }
            if (math.isNaN(pc.totalProfit)) {
              pc.totalProfit = 0;
            }

            tcTsiMacd.tradeInfo.push({
              DATA: "TOTAL_PROFIT_REPORT",
              totalProfit: pc.totalProfit,
              numberOfPostions: pc.numberOfPositions,
              fastLength: testFastLength,
              slowLength: testSlowLength,
              firstR: testFirstR,
              secondS: testSecondS,
              signalLength: testSignalLength,
              onIteration: tcTsiMacd.testIteration,
            });

            iterationCounter++;
            progressBar.update(iterationCounter);
          }
        }
      }
    }
  }
  progressBar.stop();
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
saveJsonToFile(tcTsiMacd.tradeInfo, "trades_check.json");
/* let tcVQH = new TradeControlVQH({
  maxParameter: 50,
  reducerMaxParam: 2,
  maxTestIteration: 7,
  numberTestArrays: 3,
  testSize: 3,
});

while (tcVQH.continueTradingVQH() == true) {
  for (let vqhTestLength of tcVQH.vqhLength) {
    for (let vqhTestFilter of tcVQH.vqhFilter) {
      vqh.calculate(vqhTestLength, vqhTestFilter, 0.00001, [
        data.high,
        data.low,
        data.open,
        data.close,
      ]);

      let pc = new PositionControl();

      for (let i = 0; i < data.date.length; i++) {
        if (vqh.getValue(i) == 0) {
          continue;
        }

        if (
          vqh.getValue(i) != vqh.getValue(i - 1) &&
          pc.positionOpened == false
        ) {
          if (vqh.getValue(i) == 1) {
            pc.openPosition(data.open[i + 1], data.date[i + 1], "long");
            pc.positionOpened = true;
            continue;
          } else if (vqh.getValue(i) == -1) {
            pc.openPosition(data.open[i + 1], data.date[i + 1], "short");
            pc.positionOpened = true;
            continue;
          }
        }

        if (
          vqh.getValue(i) != vqh.getValue(i - 1) &&
          pc.positionOpened == true
        ) {
          if (vqh.getValue(i) == 1) {
            pc.closePosition(data.open[i + 1], data.date[i + 1]);
            pc.openPosition(data.open[i + 1], data.date[i + 1], "long");
            continue;
          } else if (vqh.getValue(i) == -1) {
            pc.closePosition(data.open[i + 1], data.date[i + 1]);
            pc.openPosition(data.open[i + 1], data.date[i + 1], "short");
            continue;
          }
        }
      }

      tcVQH.tradeInfo.push({
        DATA: "TOTAL_PROFIT_REPORT",
        totalProfit: pc.totalProfit,
        numberOfPostions: pc.numberOfPositions,
        vqhLength: vqhTestLength,
        vqhFilter: vqhTestFilter,
        onIteration: tcVQH.testIteration,
      });
    }
  }
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
saveJsonToFile(tcVQH.tradeInfo, "trades_check.json");
 */
