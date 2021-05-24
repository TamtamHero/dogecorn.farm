import { BN } from "bn.js";

function getFormattedBalance(
  balance,
  ticker = "",
  decimals = 18,
  truncate = 4
) {
  let balance_BN = new BN(balance, 10);
  let decimals_BN = new BN(decimals, 10);
  let unit_BN = new BN(10, 10).pow(decimals_BN);
  let before_comma = balance_BN.div(unit_BN).toString();
  let after_comma = balance_BN.mod(unit_BN).toString();
  after_comma = after_comma.padStart(decimals, "0");
  after_comma = truncate ? after_comma.slice(0, truncate) : after_comma;
  return before_comma + "." + after_comma + (ticker.length ? " " + ticker : "");
}

export { getFormattedBalance };
