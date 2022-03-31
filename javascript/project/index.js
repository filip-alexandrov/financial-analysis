import Atr from "./indicators/atr.js";
import TsiMacd from "./indicators/tsi_macd.js";
import Kama from "./indicators/kama.js";
import Rex from "./indicators/rex.js";
import VolatilityRange from "./indicators/VolatilityRange.js";
import Vqh from "./indicators/vqh.js";
import MarketData from "./MarketData.js";
import { TradeControl, PositionControl } from "./TradeControl.js";

import fs from "fs";
import { create, all } from "mathjs";
const config = {};
const math = create(all, config);

/* let open = [
  1073.439941, 1147.75, 1189.550049, 1146.650024, 1077, 1080.369995, 1000,
  1053.670044, 1078.849976, 1109.069946, 1019.880005, 1026.609985, 1041.709961,
  1009.72998, 996.340027, 904.76001, 914.200012, 952.429993, 933.359985,
  831.559998, 872.710022, 935.210022, 928.179993, 882, 897.219971, 923.789978,
  905.530029, 935, 908.369995, 909.630005, 861.570007, 900, 914.049988,
  913.26001, 886, 834.130005, 830.429993, 700.390015, 809.22998, 815.01001,
  869.679993, 872.130005, 878.77002, 849.099976, 856.299988, 795.530029,
  839.47998, 851.450012, 840.200012, 780.609985, 775.27002, 809, 830.98999,
  874.48999, 914.97998, 930, 979.940002, 1009.72998, 1008, 1008,
];

let high = [
  1082, 1201.069946, 1208, 1170.339966, 1088, 1080.930054, 1059.099976,
  1075.849976, 1114.839966, 1115.599976, 1052, 1070.790039, 1054.670044,
  1041.660034, 1004.549988, 933.51001, 951.26001, 987.690002, 935.390015, 857.5,
  937.98999, 943.700012, 931.5, 937, 936.5, 947.77002, 926.289978, 946.27002,
  943.809998, 915.960022, 898.880005, 923, 926.429993, 918.5, 886.869995,
  856.72998, 835.299988, 802.47998, 819.5, 876.859985, 889.880005, 886.47998,
  886.440002, 855.650024, 866.140015, 849.98999, 860.559998, 854.450012,
  843.799988, 800.700012, 805.570007, 842, 875, 907.849976, 942.849976,
  997.859985, 1040.699951, 1024.48999, 1021.799988, 1021.799927,
];
let low = [
  1054.589966, 1136.040039, 1123.050049, 1081.01001, 1020.5, 1010, 980,
  1038.819946, 1072.589966, 1026.540039, 1013.380005, 1016.059998, 995, 994,
  940.5, 851.469971, 903.210022, 906, 829, 792.01001, 862.049988, 905,
  889.409973, 880.52002, 881.169983, 902.710022, 894.799988, 920, 896.700012,
  850.700012, 853.150024, 893.380005, 901.210022, 874.099976, 837.609985,
  801.099976, 760.559998, 700, 782.400024, 814.710022, 853.780029, 844.27002,
  832.599976, 825.159973, 804.570007, 782.169983, 832.01001, 810.359985,
  793.77002, 756.039978, 756.570007, 802.26001, 825.719971, 867.390015,
  907.090027, 921.75, 976.400024, 988.799988, 997.320007, 997.320129,
];
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
]; */

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

let tc = new TradeControl({
  maxParameter: 50,
  reducerMaxParam: 2,
  maxTestIteration: 7,
  numberTestArrays: 3,
  testSize: 3,
});

while (tc.continueTrading() == true) {
  for (let vqhTestLength of tc.vqhLength) {
    for (let vqhTestFilter of tc.vqhFilter) {
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

      tc.tradeInfo.push({
        DATA: "TOTAL_PROFIT_REPORT",
        totalProfit: pc.totalProfit,
        numberOfPostions: pc.numberOfPositions,
        vqhLength: vqhTestLength,
        vqhFilter: vqhTestFilter,
        onIteration: tc.testIteration,
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
saveJsonToFile(tc.tradeInfo, "trades_check.json");
