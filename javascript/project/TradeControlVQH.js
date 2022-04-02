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

class Bank {
  constructor({ leverage, balance, riskFactor }) {
    this.leverage = leverage;
    this.balance = balance;
    this.riskFactor = riskFactor;
  }
  getBalance() {
    return this.balance;
  }

  calcInvestmentSize(priceLevel, stopLoss) {
    let maxLoss = Math.abs(priceLevel - stopLoss) * this.leverage;
    let tradeMultiplier = (this.riskFactor * this.balance) / maxLoss;
    return tradeMultiplier;
  }

  calcProfit(change, tradeMultiplier) {
    let fullProfit = change * this.leverage * tradeMultiplier;
    this.balance = this.balance + fullProfit;
    return fullProfit;
  }
}

class PositionControl extends Bank {
  constructor({ leverage, balance, riskFactor }) {
    super({ leverage, balance, riskFactor });

    this.totalProfit = 0;
    this.numberOfPositions = 0;
    this.trades = [];
    this.positionOpened = false;
  }

  calculateProfit(lastTradeIndex) {
    if (this.trades[lastTradeIndex].tradeType == "long") {
      let change =
        this.trades[lastTradeIndex].closed - this.trades[lastTradeIndex].opened;
      let profit = super.calcProfit(
        change,
        this.trades[lastTradeIndex].tradeMultiplier
      );

      this.trades[lastTradeIndex].secondHalfProfit = profit;
      this.trades[lastTradeIndex].endBalance = super.getBalance();

      this.totalProfit += profit;
      this.numberOfPositions++;
    } else if (this.trades[lastTradeIndex].tradeType == "short") {
      let change =
        this.trades[lastTradeIndex].opened - this.trades[lastTradeIndex].closed;
      let profit = super.calcProfit(
        change,
        this.trades[lastTradeIndex].tradeMultiplier
      );

      this.trades[lastTradeIndex].secondHalfProfit = profit;
      this.trades[lastTradeIndex].endBalance = super.getBalance();

      this.totalProfit += profit;
      this.numberOfPositions++;
    }
  }

  openPosition(nextBarOpenPrice, nextBarDate, tradeType, stopLoss, takeProfit) {
    stopLoss = parseFloat(nextBarOpenPrice) + parseFloat(stopLoss);
    takeProfit = nextBarOpenPrice + takeProfit;
    let tradeMultiplier = super.calcInvestmentSize(nextBarOpenPrice, stopLoss);

    this.trades.push({
      openDate: nextBarDate,
      opened: nextBarOpenPrice,
      tradeType,
      stopLoss,
      takeProfit,
      startBalance: super.getBalance(),
      tradeMultiplier: tradeMultiplier,
      closedHalfWithAtr: false,
    });
  }

  closeHalfPosition(nextBarOpenPrice, nextBarDate) {
    let lastTradeIndex = this.trades.length - 1;

    this.trades[lastTradeIndex]["closedHalfWithAtr"] = true;
    this.trades[lastTradeIndex]["closedHalfPosition"] = nextBarOpenPrice;
    this.trades[lastTradeIndex]["closedHalfDate"] = nextBarDate;
    this.calculateHalfProfit(lastTradeIndex);
  }

  calculateHalfProfit(lastTradeIndex) {
    if (this.trades[lastTradeIndex].tradeType == "long") {
      this.trades[lastTradeIndex].tradeMultiplier /= 2;
      let change =
        this.trades[lastTradeIndex].closedHalfPosition -
        this.trades[lastTradeIndex].opened;
      console.log(change);
      let profit = super.calcProfit(
        change,
        this.trades[lastTradeIndex].tradeMultiplier
      );

      this.trades[lastTradeIndex].profitFromHalfPosition = profit;
      this.trades[lastTradeIndex].balanceAfterHalfPos = super.getBalance();

      this.trades[lastTradeIndex].stopLoss = this.trades[lastTradeIndex].opened;
      this.totalProfit += profit;
    } else if (this.trades[lastTradeIndex].tradeType == "short") {
      this.trades[lastTradeIndex].tradeMultiplier /= 2;
      let change =
        this.trades[lastTradeIndex].opened -
        this.trades[lastTradeIndex].closedHalfPosition;
      let profit = super.calcProfit(
        change,
        this.trades[lastTradeIndex].tradeMultiplier
      );

      this.trades[lastTradeIndex].profitFromHalfPosition = profit;
      this.trades[lastTradeIndex].balanceAfterHalfPos = super.getBalance();

      this.trades[lastTradeIndex].stopLoss = this.trades[lastTradeIndex].opened;
      this.totalProfit += profit;
    }
  }

  closePosition(nextBarOpenPrice, nextBarDate) {
    let lastTradeIndex = this.trades.length - 1;

    this.trades[lastTradeIndex]["closed"] = nextBarOpenPrice;
    this.trades[lastTradeIndex]["closedDate"] = nextBarDate;
    this.calculateProfit(lastTradeIndex);
  }

  lastTradeType() {
    if (this.trades.length == 0) return "no trades";
    let lastTradeIndex = this.trades.length - 1;
    return this.trades[lastTradeIndex].tradeType;
  }

  lastTradeOpenPrice() {
    let lastTradeIndex = this.trades.length - 1;
    return this.trades[lastTradeIndex].opened;
  }

  getLastStopLoss() {
    let lastTradeIndex = this.trades.length - 1;
    return this.trades[lastTradeIndex].stopLoss;
  }

  getLastTakeProfit() {
    let lastTradeIndex = this.trades.length - 1;
    return this.trades[lastTradeIndex].takeProfit;
  }

  getLastOpenPrice() {
    let lastTradeIndex = this.trades.length - 1;
    return this.trades[lastTradeIndex].opened;
  }

  getIfHalfAlreadyClosed() {
    let lastTradeIndex = this.trades.length - 1;
    return this.trades[lastTradeIndex].closedHalfWithAtr;
  }
}

export { TradeControlVQH, PositionControl, Bank };
