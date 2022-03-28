var yahooFinance = require("yahoo-finance");

let open = [];
let high = [];
let low = [];
let close = [];
let volume = [];
let date = [];

yahooFinance.historical(
  {
    symbol: "TSlA",
    from: "2022-01-01",
    to: "2022-03-27",
    period: "d",
  },
  function (err, quotes) {
    const reversed = quotes.reverse();
    for (quote of reversed) {
      open.push(quote.open);
      high.push(quote.high);
      low.push(quote.low);
      close.push(quote.close);
      volume.push(quote.volume);
      date.push(quote.date);
    }
    console.log(open);
    console.log(high);
    console.log(low);
    console.log(close);
    console.log(date);
  }
);
