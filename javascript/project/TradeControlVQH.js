class TradeControlVQH {
  constructor({
    maxParameter,
    reducerMaxParam,
    maxTestIteration,
    numberTestArrays,
    testSize,
  }) {
    this.tradeInfo = [];
    this.maxParameter = maxParameter; // initial max range
    this.reducerMaxParam = reducerMaxParam; // reduce range by factor
    this.maxTestIteration = maxTestIteration; // Tests to be performed
    // if numberTestArrays == testSize, exec time is const
    this.numberTestArrays = numberTestArrays; // independent random arrays in each test (#topValues)
    this.testSize = testSize; // random elements in each array

    // Utilities
    this.vqhLength = [];
    this.vqhFilter = [];
    this.testIteration = 0;
    this.uniq = function (a) {
      var seen = {};
      return a.filter(function (item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
      });
    };
  }

  continueTradingVQH() {
    if (this.tradeInfo.length == 0) {
      for (let i = 0; i < this.numberTestArrays; i++) {
        this.vqhLength.push(
          ...Array.from(
            { length: this.testSize },
            () => 1 + Math.floor(Math.random() * this.maxParameter)
          )
        );

        this.vqhFilter.push(
          ...Array.from(
            { length: this.testSize },
            () => 1 + Math.floor(Math.random() * this.maxParameter)
          )
        );
      }
    } else {
      this.maxParameter = this.maxParameter / this.reducerMaxParam;

      this.tradeInfo.sort(function (a, b) {
        if (a.totalProfit < b.totalProfit) return 1;
        if (a.totalProfit > b.totalProfit) return -1;
        return 0;
      });

      this.vqhLength = [];
      this.vqhFilter = [];

      for (let i = 0; i < this.numberTestArrays; i++) {
        let bestVqhLength = this.tradeInfo[i].vqhLength;
        let bestVqhFilter = this.tradeInfo[i].vqhFilter;

        this.vqhLength.push(
          ...Array.from({ length: this.testSize }, () => {
            // Prevent negative/0 val, indicator params only int
            return Math.floor(
              1 +
                Math.abs(
                  bestVqhLength -
                    this.maxParameter / 2 +
                    Math.random() * this.maxParameter
                )
            );
          })
        );

        this.vqhFilter.push(
          ...Array.from({ length: this.testSize }, () => {
            return Math.floor(
              1 +
                Math.abs(
                  bestVqhFilter -
                    this.maxParameter / 2 +
                    Math.random() * this.maxParameter
                )
            );
          })
        );
      }
    }
    // Filter duplicates
    this.vqhLength = this.uniq(this.vqhLength);
    this.vqhFilter = this.uniq(this.vqhFilter);

    // will log one more element than required
    console.log(this.vqhLength, "\t", this.vqhFilter);
    if (this.testIteration == this.maxTestIteration) {
      return false;
    }
    this.testIteration++;

    return true;
  }
}

class PositionControl {
  constructor() {
    this.totalProfit = 0;
    this.numberOfPositions = 0;
    this.trades = [];
    this.positionOpened = false;
  }

  calculateProfit(lastTradeIndex) {
    if (this.trades[lastTradeIndex].tradeType == "long") {
      this.trades[lastTradeIndex].profit =
        this.trades[lastTradeIndex].closed - this.trades[lastTradeIndex].opened;
      this.totalProfit += this.trades[lastTradeIndex].profit;
      this.numberOfPositions++;
    } else if (this.trades[lastTradeIndex].tradeType == "short") {
      this.trades[lastTradeIndex].profit =
        this.trades[lastTradeIndex].opened - this.trades[lastTradeIndex].closed;
      this.totalProfit += this.trades[lastTradeIndex].profit;
      this.numberOfPositions++;
    }
  }

  openPosition(nextBarOpenPrice, nextBarDate, tradeType) {
    this.trades.push({
      openDate: nextBarDate,
      opened: nextBarOpenPrice,
      tradeType,
    });
  }

  closePosition(nextBarOpenPrice, nextBarDate) {
    let lastTradeIndex = this.trades.length - 1;

    this.trades[lastTradeIndex]["closed"] = nextBarOpenPrice;
    this.trades[lastTradeIndex]["closedDate"] = nextBarDate;
    this.calculateProfit(lastTradeIndex);
  }
  lastTradeType() {
    let lastTradeIndex = this.trades.length - 1;
    return this.trades[lastTradeIndex].tradeType;
  }
}

export { TradeControlVQH, PositionControl };
