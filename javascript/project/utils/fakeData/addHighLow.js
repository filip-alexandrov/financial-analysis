import { readFileSync } from "fs";

class addHighLow {
  constructor(category, ticker) {
    this.data = JSON.parse(
      readFileSync(
        new URL(
          `../../data/${category}/fake/${ticker}-high-low.json`,
          import.meta.url
        )
      )
    );
    this.dataLength = this.data.length;
  }
  openHigh() {
    return this.data[Math.floor(Math.random() * this.dataLength)].OpenHigh;
  }
  openLow() {
    return this.data[Math.floor(Math.random() * this.dataLength)].OpenLow;
  }
  openClose() {
    return this.data[Math.floor(Math.random() * this.dataLength)].OpenClose;
  }
}

export default addHighLow;
