import tulind from "tulind";
import { create, all } from "mathjs";

/* let close = [
  1056.780029, 1199.780029, 1149.589966, 1088.119995, 1064.699951, 1026.959961,
  1058.119995, 1064.400024, 1106.219971, 1031.560059, 1049.609985, 1030.51001,
  995.650024, 996.27002, 943.900024, 930, 918.400024, 937.409973, 829.099976,
  846.349976, 936.719971, 931.25, 905.659973, 891.140015, 923.320007,
  907.340027, 922, 932, 904.549988, 860, 875.76001, 922.429993, 923.390015,
  876.349976, 856.97998, 821.530029, 764.039978, 800.77002, 809.869995,
  870.429993, 864.369995, 879.890015, 839.289978, 838.289978, 804.580017,
  824.400024, 858.969971, 838.299988, 795.349976, 766.369995, 801.890015,
  840.22998, 871.599976, 905.390015, 921.159973, 993.97998, 999.109985,
  1013.919983, 1010.640015, 1010.640015,
]; */

class VolatilityRange {
  constructor() {
    const config = {};
    this.math = create(all, config);
    this.volRangeValue;
  }
  calculate(
    fastMaLength,
    slowMaLength,
    lookBackPeriod,
    upLevel,
    downLevel,
    volatilityPeriod,
    [close]
  ) {
    let fastMa = [];
    let slowMa = [];
    tulind.indicators.ema.indicator(
      [close],
      [fastMaLength],
      function (err, res) {
        fastMa.push(...res[0]);
      }
    );
    tulind.indicators.ema.indicator(
      [close],
      [slowMaLength],
      function (err, res) {
        slowMa.push(...res[0]);
      }
    );

    let val = this.math.multiply(
      100,
      this.math.dotDivide(this.math.subtract(fastMa, slowMa), slowMa)
    );

    let min = [];
    let max = [];
    tulind.indicators.min.indicator(
      [val],
      [lookBackPeriod],
      function (err, res) {
        for (
          let i = 0;
          i < tulind.indicators.min.start([lookBackPeriod]);
          i++
        ) {
          min.push(0);
        }
        min.push(...res[0]);
      }
    );
    tulind.indicators.max.indicator(
      [val],
      [lookBackPeriod],
      function (err, res) {
        for (
          let i = 0;
          i < tulind.indicators.max.start([lookBackPeriod]);
          i++
        ) {
          max.push(0);
        }
        max.push(...res[0]);
      }
    );

    let range = this.math.subtract(max, min);
    let flUp = this.math.dotDivide(this.math.multiply(upLevel, range), 100);
    let flDown = this.math.dotDivide(this.math.multiply(downLevel, range), 100);
    let histo = this.math.abs(this.math.subtract(flUp, flDown));

    let bufferLine = [];
    tulind.indicators.ema.indicator(
      [histo],
      [volatilityPeriod],
      function (err, res) {
        bufferLine.push(...res[0]);
      }
    );
    // this.volRangeValue = this.math.matrixFromColumns(histo, bufferLine);
    this.volRangeValue = [histo, bufferLine];
    return;
  }

  getValue(index) {
    return [this.volRangeValue[0][index], this.volRangeValue[1][index]];
    // return [this.volRangeValue[0][index], this.volRangeValue[1][index]];
  }
}

export default VolatilityRange;

/* // sourced to close; ema / sma
let fastMaLength = 8;
let slowMaLength = 13;
let lookBackPeriod = 6;
let upLevel = 100;
let downLevel = -10;
let volatilityPeriod = 10;
 */
