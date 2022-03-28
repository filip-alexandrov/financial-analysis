import tulind from "tulind";
import { create, all } from "mathjs";

const config = {};
const math = create(all, config);

let close = [
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
];

let date = [
  "2021-12-31T05:00:00.000Z",
  "2022-01-03T05:00:00.000Z",
  "2022-01-04T05:00:00.000Z",
  "2022-01-05T05:00:00.000Z",
  "2022-01-06T05:00:00.000Z",
  "2022-01-07T05:00:00.000Z",
  "2022-01-10T05:00:00.000Z",
  "2022-01-11T05:00:00.000Z",
  "2022-01-12T05:00:00.000Z",
  "2022-01-13T05:00:00.000Z",
  "2022-01-14T05:00:00.000Z",
  "2022-01-18T05:00:00.000Z",
  "2022-01-19T05:00:00.000Z",
  "2022-01-20T05:00:00.000Z",
  "2022-01-21T05:00:00.000Z",
  "2022-01-24T05:00:00.000Z",
  "2022-01-25T05:00:00.000Z",
  "2022-01-26T05:00:00.000Z",
  "2022-01-27T05:00:00.000Z",
  "2022-01-28T05:00:00.000Z",
  "2022-01-31T05:00:00.000Z",
  "2022-02-01T05:00:00.000Z",
  "2022-02-02T05:00:00.000Z",
  "2022-02-03T05:00:00.000Z",
  "2022-02-04T05:00:00.000Z",
  "2022-02-07T05:00:00.000Z",
  "2022-02-08T05:00:00.000Z",
  "2022-02-09T05:00:00.000Z",
  "2022-02-10T05:00:00.000Z",
  "2022-02-11T05:00:00.000Z",
  "2022-02-14T05:00:00.000Z",
  "2022-02-15T05:00:00.000Z",
  "2022-02-16T05:00:00.000Z",
  "2022-02-17T05:00:00.000Z",
  "2022-02-18T05:00:00.000Z",
  "2022-02-22T05:00:00.000Z",
  "2022-02-23T05:00:00.000Z",
  "2022-02-24T05:00:00.000Z",
  "2022-02-25T05:00:00.000Z",
  "2022-02-28T05:00:00.000Z",
  "2022-03-01T05:00:00.000Z",
  "2022-03-02T05:00:00.000Z",
  "2022-03-03T05:00:00.000Z",
  "2022-03-04T05:00:00.000Z",
  "2022-03-07T05:00:00.000Z",
  "2022-03-08T05:00:00.000Z",
  "2022-03-09T05:00:00.000Z",
  "2022-03-10T05:00:00.000Z",
  "2022-03-11T05:00:00.000Z",
  "2022-03-14T04:00:00.000Z",
  "2022-03-15T04:00:00.000Z",
  "2022-03-16T04:00:00.000Z",
  "2022-03-17T04:00:00.000Z",
  "2022-03-18T04:00:00.000Z",
  "2022-03-21T04:00:00.000Z",
  "2022-03-22T04:00:00.000Z",
  "2022-03-23T04:00:00.000Z",
  "2022-03-24T04:00:00.000Z",
  "2022-03-25T04:00:00.000Z",
  "2022-03-25T04:00:00.000Z",
];

class Kama {
  calculate(close, period) {
    let result = [];
    tulind.indicators.kama.indicator([close], [period], function (err, res) {
      for (let i = 0; i < tulind.indicators.kama.start([period]); i++) {
        result.push(0);
      }
      result.push(...res[0]);
    });
    return math.matrixFromColumns(date, result);
  }
}

let period = 21;

let kama = new Kama();
console.log(kama.calculate(close, period));