import { Bank, PositionControl } from "./TradeControlVQH.js";
let l = (text) => console.log(text);

let bank = new Bank({ leverage: 10, balance: 1000, riskFactor: 0.02 });

let pc = new PositionControl({ leverage: 10, balance: 1000, riskFactor: 0.02 });
pc.openPosition(1.1, "12/07", "long", -0.2, 0.2);
pc.closePosition(1.3, "13/07");
pc.openPosition(1.1, "12/07", "long", -0.2, 0.2);
pc.closePosition(1.3, "13/07");
l(pc.trades);
