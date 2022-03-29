import tulind from "tulind";
import { create, all } from "mathjs";

class Rex {
  constructor() {
    const config = {};
    this.math = create(all, config);
  }
  calculate(smoothing, smoothingSig, [close, open, low, high]) {
    let tvb = this.math
      .chain(close)
      .multiply(3)
      .subtract(open)
      .subtract(low)
      .subtract(high)
      .done();

    let rex = [];
    tulind.indicators.sma.indicator([tvb], [smoothing], function (err, res) {
      for (let i = 0; i < tulind.indicators.sma.start([smoothing]); i++) {
        rex.push(0);
      }
      rex.push(...res[0]);
    });

    let sig = [];
    tulind.indicators.sma.indicator([rex], [smoothingSig], function (err, res) {
      for (let i = 0; i < tulind.indicators.sma.start([smoothingSig]); i++) {
        sig.push(0);
      }
      sig.push(...res[0]);
    });

    return this.math.matrixFromColumns(rex, sig);
  }
}

export default Rex;
