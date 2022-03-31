import tulind from "tulind";
import { create, all } from "mathjs";

class TsiMacd {
  constructor() {
    const config = {};
    this.math = create(all, config);
    this.tsiMacdValue;
    this.tsiValues;
    this.tsiSignalValues;
  }
  calculate(fastLength, slowLength, firstR, secondS, signalLength, [close]) {
    let smaSignal = false;

    let fastEmaClose = [];
    let slowEmaClose = [];

    // vectors formatted by default
    tulind.indicators.ema.indicator([close], [fastLength], function (err, res) {
      fastEmaClose.push(...res[0]);
    });
    tulind.indicators.ema.indicator([close], [slowLength], function (err, res) {
      slowEmaClose.push(...res[0]);
    });

    let macd = this.math.subtract(fastEmaClose, slowEmaClose);

    let macdChange = [];
    tulind.indicators.lag.indicator([macd], [1], function (err, res) {
      macdChange = [0, ...res[0]];
    });
    macdChange = this.math.subtract(macd, macdChange);

    let absMacdChange = this.math.abs(macdChange);

    let emaMacdChange = [];
    let emaAbsMacdChange = [];

    tulind.indicators.ema.indicator(
      [macdChange],
      [firstR],
      function (err, res) {
        tulind.indicators.ema.indicator(
          [res[0]],
          [secondS],
          function (err, res) {
            emaMacdChange.push(...res[0]);
          }
        );
      }
    );
    tulind.indicators.ema.indicator(
      [absMacdChange],
      [firstR],
      function (err, res) {
        tulind.indicators.ema.indicator(
          [res[0]],
          [secondS],
          function (err, res) {
            emaAbsMacdChange.push(...res[0]);
          }
        );
      }
    );

    let tsi = this.math.multiply(
      100,
      this.math.dotDivide(emaMacdChange, emaAbsMacdChange)
    );
    tsi = tsi.map((el) => {
      if (this.math.isNaN(el)) {
        return 0;
      }
      return el;
    });

    let signal = [];
    tulind.indicators.ema.indicator([tsi], [signalLength], function (err, res) {
      signal.push(...res[0]);
    });

    this.tsiMacdValue = this.math.matrixFromColumns(tsi, signal);
    this.tsiValues = tsi;
    this.tsiSignalValues = signal;
  }

  getValue(index) {
    return [this.tsiValues[index], this.tsiSignalValues[index]];
    // return [this.tsiMacdValue[0][index], this.tsiMacdValue[1][index]];
  }
}

export default TsiMacd;

/* // sourced to close price
let fastLength = 8;
let slowLength = 21;
let firstR = 8;
let secondS = 5;
let signalLength = 9;

let smaSignal = false;

let fastEmaClose = [];
let slowEmaClose = [];

// vectors formatted by default
tulind.indicators.ema.indicator([close], [fastLength], function (err, res) {
  fastEmaClose.push(...res[0]);
});
tulind.indicators.ema.indicator([close], [slowLength], function (err, res) {
  slowEmaClose.push(...res[0]);
});

let macd = math.subtract(fastEmaClose, slowEmaClose);

let macdChange = [];
tulind.indicators.lag.indicator([macd], [1], function (err, res) {
  macdChange = math.subtract(macd, [0, ...res[0]]);
});

let absMacdChange = math.abs(macdChange);

let emaMacdChange = [];
let emaAbsMacdChange = [];

tulind.indicators.ema.indicator([macdChange], [firstR], function (err, res) {
  tulind.indicators.ema.indicator([res[0]], [secondS], function (err, res) {
    emaMacdChange.push(...res[0]);
  });
});
tulind.indicators.ema.indicator([absMacdChange], [firstR], function (err, res) {
  tulind.indicators.ema.indicator([res[0]], [secondS], function (err, res) {
    emaAbsMacdChange.push(...res[0]);
  });
});

let tsi = math.multiply(100, math.dotDivide(emaMacdChange, emaAbsMacdChange));
tsi = tsi.map((el) => {
  if (math.isNaN(el)) {
    return 0;
  }
  return el;
});

let signal = [];
tulind.indicators.ema.indicator([tsi], [signalLength], function (err, res) {
  signal.push(...res[0]);
});

// console.log(emaMacdChange, emaAbsMacdChange);
console.log(math.matrixFromColumns(tsi, signal).length); */
