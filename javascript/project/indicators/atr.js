import tulind from "tulind";
import { create, all } from "mathjs";

class Atr {
  constructor() {
    const config = {};
    this.math = create(all, config);
    this.atrValue;
  }

  calculate([high, low, close], period) {
    let result = [];
    tulind.indicators.atr.indicator(
      [high, low, close],
      [period],
      function (err, res) {
        for (let i = 0; i < tulind.indicators.atr.start([period]); i++) {
          result.push(0);
        }
        result.push(...res[0]);
      }
    );

    this.atrValue = result;
    return;
  }

  getValue(index) {
    return this.atrValue[index];
  }
}

export default Atr;
