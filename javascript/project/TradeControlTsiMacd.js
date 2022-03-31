class TradeControlTsiMacd {
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
    this.fastLength = [];
    this.slowLength = [];
    this.firstR = [];
    this.secondS = [];
    this.signalLength = [];
    this.testIteration = 0;
    this.uniq = function (a) {
      var seen = {};
      return a.filter(function (item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
      });
    };
  }

  continueTrading() {
    if (this.tradeInfo.length == 0) {
      for (let i = 0; i < this.numberTestArrays; i++) {
        this.fastLength.push(
          ...Array.from(
            { length: this.testSize },
            () => 1 + Math.floor(Math.random() * this.maxParameter)
          )
        );

        this.slowLength.push(
          ...Array.from(
            { length: this.testSize },
            () => 1 + Math.floor(Math.random() * this.maxParameter)
          )
        );

        this.firstR.push(
          ...Array.from(
            { length: this.testSize },
            () => 1 + Math.floor(Math.random() * this.maxParameter)
          )
        );

        this.secondS.push(
          ...Array.from(
            { length: this.testSize },
            () => 1 + Math.floor(Math.random() * this.maxParameter)
          )
        );

        this.signalLength.push(
          ...Array.from(
            { length: this.testSize },
            () => 1 + Math.floor(Math.random() * this.maxParameter)
          )
        );
      }
    } else {
      this.maxParameter = this.maxParameter / this.reducerMaxParam;

      /* this.tradeInfo.sort(function (a, b) {
        if (a.totalProfit < b.totalProfit) return 1;
        if (a.totalProfit > b.totalProfit) return -1;
        return 0;
      }); */
      this.tradeInfo.sort(function (a, b) {
        return b.totalProfit - a.totalProfit;
      });

      this.fastLength = [];
      this.slowLength = [];
      this.firstR = [];
      this.secondS = [];
      this.signalLength = [];

      for (let i = 0; i < this.numberTestArrays; i++) {
        let bestFastLength = this.tradeInfo[i].fastLength;
        let bestSlowLength = this.tradeInfo[i].slowLength;
        let bestFirstR = this.tradeInfo[i].firstR;
        let bestSecondS = this.tradeInfo[i].secondS;
        let bestSignalLength = this.tradeInfo[i].signalLength;

        this.fastLength.push(
          ...Array.from({ length: this.testSize }, () => {
            // Prevent negative/0 val, indicator params only int
            return Math.floor(
              1 +
                Math.abs(
                  bestFastLength -
                    this.maxParameter / 2 +
                    Math.random() * this.maxParameter
                )
            );
          })
        );

        this.slowLength.push(
          ...Array.from({ length: this.testSize }, () => {
            return Math.floor(
              1 +
                Math.abs(
                  bestSlowLength -
                    this.maxParameter / 2 +
                    Math.random() * this.maxParameter
                )
            );
          })
        );

        this.firstR.push(
          ...Array.from({ length: this.testSize }, () => {
            return Math.floor(
              1 +
                Math.abs(
                  bestFirstR -
                    this.maxParameter / 2 +
                    Math.random() * this.maxParameter
                )
            );
          })
        );

        this.secondS.push(
          ...Array.from({ length: this.testSize }, () => {
            return Math.floor(
              1 +
                Math.abs(
                  bestSecondS -
                    this.maxParameter / 2 +
                    Math.random() * this.maxParameter
                )
            );
          })
        );

        this.signalLength.push(
          ...Array.from({ length: this.testSize }, () => {
            return Math.floor(
              1 +
                Math.abs(
                  bestSignalLength -
                    this.maxParameter / 2 +
                    Math.random() * this.maxParameter
                )
            );
          })
        );
      }
    }
    // Filter duplicates
    this.fastLength = this.uniq(this.fastLength);
    this.slowLength = this.uniq(this.slowLength);
    this.firstR = this.uniq(this.firstR);
    this.secondS = this.uniq(this.secondS);
    this.signalLength = this.uniq(this.signalLength);

    // will log one more element than required
    console.log(
      this.fastLength,
      "\n",
      this.slowLength,
      "\n",
      this.firstR,
      "\n",
      this.secondS,
      "\n",
      this.signalLength,
      "\n"
    );
    if (this.testIteration == this.maxTestIteration) {
      return false;
    }
    this.testIteration++;

    return true;
  }
}

export { TradeControlTsiMacd };
