import tulind from "tulind";
import { create, all } from "mathjs";

class Atr {
  constructor() {
    const config = {};
    this.math = create(all, config);
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

    return result;
  }
}

export default Atr;
