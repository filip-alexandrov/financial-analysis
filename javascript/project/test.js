function addTradeInfoRecord(vqhLength, vqhFilter) {
  for (let vqhLen of vqhLength) {
    for (let vqhFil of vqhFilter) {
      tradeInfo.push({
        totalProfit: Math.random(),
        vqhLength: vqhLen,
        vqhFilter: vqhFil,
      });
    }
  }
}

let tradeInfo = [];
let maxParameter = 50; // initial max range
let reducerMaxParam = 4; // reduce range by factor
let maxTestIteration = 3; // Tests to be performed
let numberTestArrays = 3; // independent random arrays in each test
let testSize = 3; // random elements in each array

let vqhLength = [];
let vqhFilter = [];
let testIteration = 0;
function tradeControl() {
  if (tradeInfo.length == 0) {
    for (let i = 0; i < numberTestArrays; i++) {
      vqhLength.push(
        ...Array.from(
          { length: testSize },
          () => 1 + Math.floor(Math.random() * maxParameter)
        )
      );

      vqhFilter.push(
        ...Array.from(
          { length: testSize },
          () => 1 + Math.floor(Math.random() * maxParameter)
        )
      );
    }

    // remove
    addTradeInfoRecord(vqhLength, vqhFilter);
  } else {
    maxParameter = maxParameter / reducerMaxParam;

    tradeInfo.sort(function (a, b) {
      if (a.totalProfit < b.totalProfit) return 1;
      if (a.totalProfit > b.totalProfit) return -1;
      return 0;
    });

    vqhLength = [];
    vqhFilter = [];

    for (let i = 0; i < numberTestArrays; i++) {
      let bestVqhLength = tradeInfo[i].vqhLength;
      let bestVqhFilter = tradeInfo[i].vqhFilter;
      vqhLength.push(
        ...Array.from({ length: testSize }, () => {
          return (
            1 + bestVqhLength - maxParameter / 2 + Math.random() * maxParameter
          );
        })
      );

      vqhFilter.push(
        ...Array.from({ length: testSize }, () => {
          return (
            1 + bestVqhFilter - maxParameter / 2 + Math.random() * maxParameter
          );
        })
      );
    }
    // remove
    addTradeInfoRecord(vqhLength, vqhFilter);
  }
  console.log(vqhLength, "\t", vqhFilter);
  testIteration++;

  if (testIteration == maxTestIteration) {
    return false;
  }
  return true;
}

while (tradeControl() == true) {}

// console.log(tradeInfo);
