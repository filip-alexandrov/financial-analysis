import fs from "fs";
class MarketData {
  constructor(category, ticker) {
    const json = JSON.parse(
      fs.readFileSync(
        new URL(`./data/${category}/${ticker}.json`, import.meta.url)
      )
    );

    this.date = [];
    this.open = [];
    this.close = [];
    this.high = [];
    this.low = [];

    for (let item of json) {
      this.date.push(item.Time);
      this.open.push(parseFloat(item.Open));
      this.close.push(parseFloat(item.Close));
      this.high.push(parseFloat(item.High));
      this.low.push(parseFloat(item.Low));
    }
  }

  /*   date(index) {
    return this.date[index];
  }
  openPrice(index) {
    return this.open[index];
  }
  closePrice(index) {
    return this.close[index];
  }
  highPrice(index) {
    return this.high[index];
  }
  lowPrice(index) {
    return this.low[index];
  }
  volume(index) {
    return this.volume[index];
  } */
}

export default MarketData;
