import React, { useState, useEffect } from "react";
import "./index.css";
import { BN } from "bn.js";
import { getFormattedBalance } from "../helpers.js";
import { Decimal } from "decimal.js";

function AmountInputField({ balance, decimals }) {
  const [amount, setAmount] = useState("0");

  const onChange = (event) => {
    let input = event.target.value.replace(/[^\d.]/g, "");
    if (input.length) {
      const amount_wei = new Decimal(input).mul(new Decimal(10).pow(decimals));
      const amount_BN = new BN(amount_wei.toFixed(0), 10);
      const balance_BN = new BN(balance, 10);

      if (amount_BN.lte(balance_BN)) {
        setAmount(input);
      } else {
        console.log("Not enough funds.");
      }
    } else {
      setAmount("");
    }
  };

  const setMax = () => {
    const max = new Decimal(balance).div(new Decimal(10).pow(decimals));
    setAmount(max.toFixed(decimals));
  };

  const onSelect = () => {
    if (amount === "0") {
      setAmount("");
    }
  };

  const onBlur = () => {
    if (amount === "") {
      setAmount("0");
    }
  };

  return (
    <>
      <div className="balance">Available: {getFormattedBalance(balance)}</div>
      <div className="amount-field-wrapper">
        <input
          value={amount}
          onChange={onChange}
          onSelect={onSelect}
          onBlur={onBlur}
        />
        <div className="max-button" onClick={setMax}>
          <span>Max</span>
        </div>
      </div>
    </>
  );
}

export default AmountInputField;
