import tulind from "tulind";
import { create, all } from "mathjs";

class Kama {
  constructor() {
    const config = {};
    this.math = create(all, config);
  }
  calculate([close], period) {
    let result = [];
    tulind.indicators.kama.indicator([close], [period], function (err, res) {
      for (let i = 0; i < tulind.indicators.kama.start([period]); i++) {
        result.push(0);
      }
      result.push(...res[0]);
    });
    return result;
  }
}

export default Kama;
