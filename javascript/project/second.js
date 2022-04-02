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
let l = (text) => {
  console.log(text);
};

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

let atr = new Atr();
let tsi_macd = new TsiMacd();
let kama = new Kama();
let rex = new Rex();
let volatilityRange = new VolatilityRange();
let vqh = new Vqh();
let data = new MarketData("fx", "EURUSD_H4");

atr.calculate([data.high, data.low, data.close], 14);
tsi_macd.calculate(8, 21, 8, 5, 9, [data.close]);
kama.calculate([data.close], 21);
rex.calculate(14, 14, [data.close, data.open, data.low, data.high]);
volatilityRange.calculate(8, 13, 6, 100, -10, 10, [data.close]);
vqh.calculate(7, 2, 0.00001, [data.high, data.low, data.open, data.close]);

/* let tsiSignal = "";
let kamaSignal = "";
let rexSignal = "";
let volatilityRangeSignal = false;
let vqhSignal = "";

let plotDate = [];
let plotVqh = [];

let pc = new PositionControl();

let tradeInfo = [];
for (let i = 0; i < data.date.length; i++) {
  // last bar of dataset => unable to close
  if (data.date.length == i + 1) continue;

  // Reset signals on new bar
  tsiSignal = "";
  kamaSignal = "";
  rexSignal = "";
  volatilityRangeSignal = false;
  vqhSignal = "";

  // Not definitive signal
  if (tsi_macd.getValue(i)[0] == tsi_macd.getValue(i)[1]) {
    continue;
  } else if (vqh.getValue(i) == 0) {
    continue;
  } else if (rex.getValue(i)[0] == rex.getValue(i)[1]) {
    continue;
  }

  // Evaluate signals for entry
  if (tsi_macd.getValue(i)[0] > tsi_macd.getValue(i)[1]) {
    tsiSignal = "buy";
  } else if (tsi_macd.getValue(i)[0] < tsi_macd.getValue(i)[1]) {
    tsiSignal = "sell";
  }

  if (vqh.getValue(i) == 1) {
    vqhSignal = "buy";
  } else if (vqh.getValue(i) == -1) {
    vqhSignal = "sell";
  }

  if (volatilityRange.getValue(i)[0] > volatilityRange.getValue(i)[1]) {
    volatilityRangeSignal = true;
  }

  // Evaluate exit indicators
  if (rex.getValue(i)[0] > rex.getValue(i)[1]) {
    rexSignal = "buy";
  } else if (rex.getValue(i)[0] < rex.getValue(i)[1]) {
    rexSignal = "sell";
  }

  if (pc.positionOpened == true && pc.lastTradeType() == "long") {
  }

  // Opening position
  if (
    pc.positionOpened == false &&
    tsiSignal == "buy" &&
    vqhSignal == "buy" &&
    volatilityRangeSignal == true
  ) {
    pc.openPosition(
      data.open[i + 1],
      data.date[i + 1],
      "long",
      -2 * atr.getValue(i)
    );
    pc.positionOpened = true;
  } else if (
    pc.positionOpened == false &&
    tsiSignal == "sell" &&
    vqhSignal == "sell" &&
    volatilityRangeSignal == true
  ) {
    pc.openPosition(
      data.open[i + 1],
      data.date[i + 1],
      "short",
      2 * atr.getValue(i)
    );
    pc.positionOpened = true;
  }

  // Closing positions with take profit
  if (
    pc.positionOpened == true &&
    pc.lastTradeType() == "short" &&
    rexSignal == "buy" &&
    data.open[i] < pc.lastTradeOpenPrice()
  ) {
    pc.closePosition(data.open[i + 1], data.date[i + 1]);
    pc.positionOpened = false;
  } else if (
    pc.positionOpened == true &&
    pc.lastTradeType() == "long" &&
    rexSignal == "sell" &&
    data.open[i] > pc.lastTradeOpenPrice()
  ) {
    pc.closePosition(data.open[i + 1], data.date[i + 1]);
    pc.positionOpened = false;
  }

  // Close position with stop loss
  if (
    pc.positionOpened == true &&
    pc.lastTradeType() == "short" &&
    data.high[i] > pc.getLastStopLoss()
  ) {
    pc.closePosition(data.open[i + 1], data.date[i + 1]);
    pc.positionOpened = false;
  } else if (
    pc.positionOpened == true &&
    pc.lastTradeType() == "long" &&
    data.low[i] < pc.getLastStopLoss()
  ) {
    pc.closePosition(data.open[i + 1], data.date[i + 1]);
    pc.positionOpened = false;
  }
} */
let tsiSignal = "";
let kamaSignal = "";
let rexSignal = "";
let volatilityRangeSignal = false;
let vqhSignal = "";
let atrTakeProfit = false;

let plotDate = [];
let plotVqh = [];

let pc = new PositionControl({
  leverage: 10,
  balance: 1000,
  riskFactor: 0.02,
});

let indicatorData = [];

let tradeInfo = [];
for (let i = 0; i < data.date.length; i++) {
  if (i > 22000) {
    plotDate.push(data.date[i]);
    plotVqh.push(vqh.getValue(i));
  }
  // last bar of dataset => unable to close
  if (data.date.length == i + 1) continue;

  // Reset signals on new bar
  tsiSignal = "";
  kamaSignal = "";
  rexSignal = "";
  volatilityRangeSignal = false;
  vqhSignal = "";
  atrTakeProfit = false;

  // Not definitive signal
  if (tsi_macd.getValue(i)[0] == tsi_macd.getValue(i)[1]) {
    continue;
  } else if (vqh.getValue(i) == 0) {
    continue;
  } else if (rex.getValue(i)[0] == rex.getValue(i)[1]) {
    continue;
  }

  // Evaluate signals for entry
  if (tsi_macd.getValue(i)[0] > tsi_macd.getValue(i)[1]) {
    tsiSignal = "buy";
  } else if (tsi_macd.getValue(i)[0] < tsi_macd.getValue(i)[1]) {
    tsiSignal = "sell";
  }

  if (vqh.getValue(i) == 1 && vqh.getValue(i - 2) == -1) {
    vqhSignal = "buy";
  } else if (vqh.getValue(i) == -1 && vqh.getValue(i - 2) == 1) {
    vqhSignal = "sell";
  }

  if (volatilityRange.getValue(i)[0] > volatilityRange.getValue(i)[1]) {
    volatilityRangeSignal = true;
  }

  // Evaluate exit indicators
  // l(pc.positionOpened && pc.getLastTakeProfit());
  if (
    pc.positionOpened == true &&
    pc.getIfHalfAlreadyClosed() == false &&
    pc.lastTradeType() == "long" &&
    pc.getLastTakeProfit() < data.high[i]
  ) {
    atrTakeProfit = true;
  } else if (
    pc.positionOpened == true &&
    pc.getIfHalfAlreadyClosed() == false &&
    pc.lastTradeType() == "short" &&
    pc.getLastTakeProfit() > data.low[i]
  ) {
    atrTakeProfit = true;
  }

  if (rex.getValue(i)[0] > rex.getValue(i)[1]) {
    rexSignal = "buy";
  } else if (rex.getValue(i)[0] < rex.getValue(i)[1]) {
    rexSignal = "sell";
  }

  // Opening position
  if (
    pc.positionOpened == false &&
    tsiSignal == "buy" &&
    vqhSignal == "buy" &&
    volatilityRangeSignal == true
  ) {
    /* indicatorData.push({
      Date: data.date[i],
      tsi_macd_main: tsi_macd.getValue(i)[0],
      tsi_macd_signal: tsi_macd.getValue(i)[1],
      vqh: vqh.getValue(i),
      rex_line: rex.getValue(i)[0],
      rex_signal: rex.getValue(i)[1],

      voli_hist: volatilityRange.getValue(i)[0],
      voli_line: volatilityRange.getValue(i)[1],
    }); */
    pc.openPosition(
      data.open[i + 1],
      data.date[i + 1],
      "long",
      -2 * atr.getValue(i),
      atr.getValue(i) // single
    );
    pc.positionOpened = true;
  } else if (
    pc.positionOpened == false &&
    tsiSignal == "sell" &&
    vqhSignal == "sell" &&
    volatilityRangeSignal == true
  ) {
    pc.openPosition(
      data.open[i + 1],
      data.date[i + 1],
      "short",
      2 * atr.getValue(i),
      -atr.getValue(i) // single
    );
    pc.positionOpened = true;
  }

  // Closing Half positions with take profit
  if (
    pc.positionOpened == true &&
    pc.lastTradeType() == "short" &&
    atrTakeProfit == true
  ) {
    pc.closeHalfPosition(data.open[i + 1], data.date[i + 1]);
  } else if (
    pc.positionOpened == true &&
    pc.lastTradeType() == "long" &&
    atrTakeProfit == true
  ) {
    pc.closeHalfPosition(data.open[i + 1], data.date[i + 1]);
  }

  // Close Full Position with TP
  if (
    pc.positionOpened == true &&
    pc.lastTradeType() == "short" &&
    rexSignal == "buy" &&
    data.open[i] < pc.lastTradeOpenPrice()
  ) {
    pc.closePosition(data.open[i + 1], data.date[i + 1]);
    pc.positionOpened = false;
  } else if (
    pc.positionOpened == true &&
    pc.lastTradeType() == "long" &&
    rexSignal == "sell" &&
    data.open[i] > pc.lastTradeOpenPrice()
  ) {
    pc.closePosition(data.open[i + 1], data.date[i + 1]);
    pc.positionOpened = false;
  }

  // Close position with stop loss
  if (
    pc.positionOpened == true &&
    pc.lastTradeType() == "short" &&
    data.high[i] > pc.getLastStopLoss()
  ) {
    if (pc.getLastOpenPrice() == pc.getLastStopLoss()) {
      pc.closePosition(pc.getLastOpenPrice(), data.date[i]);
    } else {
      pc.closePosition(data.open[i + 1], data.date[i + 1]);
    }
    pc.positionOpened = false;
  } else if (
    pc.positionOpened == true &&
    pc.lastTradeType() == "long" &&
    data.low[i] < pc.getLastStopLoss()
  ) {
    if (pc.getLastOpenPrice() == pc.getLastStopLoss()) {
      pc.closePosition(pc.getLastOpenPrice(), data.date[i]);
    } else {
      pc.closePosition(data.open[i + 1], data.date[i + 1]);
    }
    pc.positionOpened = false;
  }
}
tradeInfo.push(
  {
    DATA: "TOTAL_PROFIT_REPORT",
    totalProfit: pc.totalProfit,
    numberOfPostions: pc.numberOfPositions,
  },
  pc.trades
);
saveJsonToFile(pc.trades, "../../python/trades_check.json");
saveJsonToFile(indicatorData, "indicators_check.json");

/* let lastOpenedIndex = 0;

let tradeInfo = [];

for (let barPosLen = 1; barPosLen <= 1; barPosLen++) {
  let pc = new PositionControl({
    leverage: 10,
    balance: 1000,
    riskFactor: 0.02,
  });
  for (let i = 0; i < data.date.length; i++) {
    // last bar of dataset => unable to close
    if (data.date.length == i + 1) continue;

    // initialize position
    if (pc.positionOpened == false) {
      pc.openPosition(data.open[i], data.date[i], "long", 0, 0);
      lastOpenedIndex = 0;
      pc.positionOpened = true;
    }

    // Continue profitable pos
    if (
      pc.positionOpened == true &&
      i - lastOpenedIndex > barPosLen &&
      pc.lastTradeType() == "long" &&
      pc.getLastOpenPrice() - data.open[i] < 0
    ) {
      pc.closePosition(data.open[i], data.date[i]);
      pc.openPosition(data.open[i], data.date[i], "long", 0, 0);
      lastOpenedIndex = i;
    } else if (
      pc.positionOpened == true &&
      i - lastOpenedIndex > barPosLen &&
      pc.lastTradeType() == "short" &&
      pc.getLastOpenPrice() - data.open[i] > 0
    ) {
      pc.closePosition(data.open[i], data.date[i]);
      pc.openPosition(data.open[i], data.date[i], "short", 0, 0);
      lastOpenedIndex = i;
    }

    // Reverse unprofitable pos
    if (
      pc.positionOpened == true &&
      i - lastOpenedIndex > barPosLen &&
      pc.lastTradeType() == "long" &&
      pc.getLastOpenPrice() - data.open[i] > 0
    ) {
      pc.closePosition(data.open[i], data.date[i]);
      pc.openPosition(data.open[i], data.date[i], "short", 0, 0);
      lastOpenedIndex = i;
    } else if (
      pc.positionOpened == true &&
      i - lastOpenedIndex > barPosLen &&
      pc.lastTradeType() == "short" &&
      pc.getLastOpenPrice() - data.open[i] < 0
    ) {
      pc.closePosition(data.open[i], data.date[i]);
      pc.openPosition(data.open[i], data.date[i], "long", 0, 0);
      lastOpenedIndex = i;
    }
  }
  tradeInfo.push(
    {
      DATA: "TOTAL_PROFIT_REPORT",
      totalProfit: pc.totalProfit,
      numberOfPostions: pc.numberOfPositions,
      barPosLen,
    }
    // pc.trades
  );
} 

tradeInfo.sort(function (a, b) {
  if (a.totalProfit < b.totalProfit) return 1;
  if (a.totalProfit > b.totalProfit) return -1;
  return 0;
});
saveJsonToFile(tradeInfo, "trades_check.json");
*/
