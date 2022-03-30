class TradeControl {
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

  continueTrading() {
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

    console.log(this.vqhLength, "\t", this.vqhFilter);
    if (this.testIteration == this.maxTestIteration) {
      return false;
    }
    this.testIteration++;

    return true;
  }
}

class positionControl {
  initIndicators() {}
}

export default TradeControl;
