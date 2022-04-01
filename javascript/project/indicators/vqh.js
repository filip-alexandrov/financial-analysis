import tulind from "tulind";

/* const json = JSON.parse(
  await readFile(new URL("../data/fx/EURUSD_H4.json", import.meta.url))
);

let date = [];
let open = [];
let high = [];
let low = [];
let close = [];
let volume = [];

for (let item of json) {
  date.push(item.Time);
  open.push(item.Open);
  high.push(item.High);
  low.push(item.Low);
  close.push(item.Close);
  volume.push(item.Volume);
} */

class Vqh {
  constructor() {
    this.vqhValue;
  }
  calculate(vqh_length, vqh_filter, ticker_size, [high, low, open, close]) {
    let vqi = [];
    let trend = [];

    let cHigh = [];
    let cLow = [];
    let cOpen = [];
    let cClose = [];
    let pClose = [];
    let sumVqi = [];

    let result = [];
    for (let i = 0; i < tulind.indicators.wma.start([vqh_length]); i++) {
      cHigh.push(0);
      cLow.push(0);
      cOpen.push(0);
      cClose.push(0);
      pClose.push(0);

      vqi.push(0);
      trend.push(0);
      sumVqi.push(0);
      result.push(0);
    }

    tulind.indicators.wma.indicator(
      [high],
      [vqh_length],
      function (err, results) {
        cHigh.push(...results[0]);
      }
    );

    tulind.indicators.wma.indicator(
      [low],
      [vqh_length],
      function (err, results) {
        cLow.push(...results[0]);
      }
    );

    tulind.indicators.wma.indicator(
      [open],
      [vqh_length],
      function (err, results) {
        cOpen.push(...results[0]);
      }
    );

    tulind.indicators.wma.indicator(
      [close],
      [vqh_length],
      function (err, results) {
        cClose.push(...results[0]);
      }
    );

    tulind.indicators.lag.indicator([close], [1], function (err, result) {
      tulind.indicators.wma.indicator(
        [result[0]],
        [vqh_length],
        function (err, results) {
          pClose.push(result[0][0], ...results[0]);
        }
      );
    });

    for (let i = vqh_length - 1; i < open.length; i++) {
      /*  current Done Bar = i;
        previous Done Bar = i - 1; */

      let vqiCalc =
        cHigh[i] - cLow[i] != 0 &&
        Math.max(cHigh[i], pClose[i]) - Math.min(cLow[i], pClose[i]) != 0
          ? ((cClose[i] - pClose[i]) /
              (Math.max(cHigh[i], pClose[i]) - Math.min(cLow[i], pClose[i])) +
              (cClose[i] - cOpen[i]) / (cHigh[i] - cLow[i])) *
            0.5
          : vqi[i - 1];

      // Skip jump from 0 to actual price, when first run
      if (vqh_length - 1 == i) {
        trend.push(0);
        vqi.push(0);
        sumVqi.push(0);
        result.push(0);
        continue;
      }

      vqi.push(
        Math.abs(vqiCalc) *
          ((cClose[i] - pClose[i] + cClose[i] - cOpen[i]) * 0.5)
      );

      sumVqi.push(vqi.reduce((partialSum, a) => partialSum + a, 0));
      if (vqi.length > 1000) vqi.shift();

      let toAdd = sumVqi[i] - sumVqi[i - 1] > 0 ? 1 : -1;
      trend.push(
        Math.abs(sumVqi[i - 1] - sumVqi[i]) >= 0 &&
          Math.abs(sumVqi[i - 1] - sumVqi[i]) <= vqh_filter * ticker_size * 10
          ? trend[i - 1]
          : toAdd
      );
      result.push(trend[i]);
    }
    this.vqhValue = result;
    return;
  }

  getValue(index) {
    return this.vqhValue[index];
  }
}

export default Vqh;

/* let tradeInfo = [];
let vqhTestLengthValues = [7, 2, 5, 10, 20, 30, 50];
let vqhTestFilterValues = [2, 1, 5, 10, 20, 30, 50];

for (let vqhTestLength of vqhTestLengthValues) {
  for (let vqhTestFilter of vqhTestFilterValues) {
    let vqh_length = vqhTestLength; // Default
    let vqh_filter = vqhTestFilter; // Default
    let ticker_size = 0.00001;

    let vqh = new Vqh();
    let vqhIndicator = vqh.calculate(vqh_length, vqh_filter, ticker_size, [
      high,
      low,
      open,
      close,
    ]);

    let marketData = [];
    for (let i = 0; i < date.length; i++) {
      marketData.push({
        date: date[i],
        open: open[i],
        close: close[i],
        high: high[i],
        low: low[i],
        vqh: vqhIndicator[i],
      });
    }

    let totalProfit = 0;
    let numberOfPostions = 0;
    function calculateProfit(trades, lastTradeIndex) {
      if (trades[lastTradeIndex].tradeType == "long") {
        trades[lastTradeIndex].profit =
          trades[lastTradeIndex].closed - trades[lastTradeIndex].opened;
        totalProfit += trades[lastTradeIndex].profit;
        numberOfPostions++;
      } else if (trades[lastTradeIndex].tradeType == "short") {
        trades[lastTradeIndex].profit =
          trades[lastTradeIndex].opened - trades[lastTradeIndex].closed;
        totalProfit += trades[lastTradeIndex].profit;
        numberOfPostions++;
      }
    }

    function openPosition(trades, marketData, i, tradeType) {
      trades.push({
        openDate: marketData[i + 1].date,
        opened: marketData[i + 1].open,
        tradeType,
      });
    }
    function closePosition(trades, marketData, i, lastTradeIndex) {
      trades[lastTradeIndex]["closed"] = marketData[i + 1].open;
      trades[lastTradeIndex]["closedDate"] = marketData[i + 1].date;
      calculateProfit(trades, lastTradeIndex);
    }

    let trades = [];
    let positionOpened = false;
    for (let i = 0; i < date.length; i++) {
      if (marketData[i].vqh == 0) {
        continue;
      }

      if (
        marketData[i].vqh != marketData[i - 1].vqh &&
        positionOpened == false
      ) {
        if (marketData[i].vqh == 1) {
          openPosition(trades, marketData, i, "long");
          positionOpened = true;
          continue;
        } else if (marketData[i].vqh == -1) {
          openPosition(trades, marketData, i, "short");
          positionOpened = true;
          continue;
        }
      }

      if (
        marketData[i].vqh != marketData[i - 1].vqh &&
        positionOpened == true
      ) {
        let lastTradeIndex = trades.length - 1;

        if (marketData[i].vqh == 1) {
          closePosition(trades, marketData, i, lastTradeIndex);
          openPosition(trades, marketData, i, "long");
          continue;
        } else if (marketData[i].vqh == -1) {
          closePosition(trades, marketData, i, lastTradeIndex);
          openPosition(trades, marketData, i, "short");
          continue;
        }
      }
    }

    tradeInfo.push({
      DATA: "TOTAL_PROFIT_REPORT",
      totalProfit,
      vqh_length,
      vqh_filter,
      ticker_size,
      numberOfPostions,
    });
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
saveJsonToFile(tradeInfo, "trades.json");
 */
