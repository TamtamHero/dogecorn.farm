import React, { useState, useEffect } from "react";
import AmountInputField from "../AmountInputField";
import "./index.css";

function StakeCard({ pool }) {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (pool.balance) {
      setBalance(pool.balance);
    }
  }, [pool.balance]);

  return (
    <div
      className={
        pool.incentive ? "card-border--rainbow" : "card-border--normal"
      }
    >
      <div className="card">
        <div className={"title"}>{pool.title}</div>
        <div className={"description"}>{pool.description}</div>
        <AmountInputField
          balance={balance}
          decimals={pool.decimals}
        ></AmountInputField>
      </div>
    </div>
  );
}

export default StakeCard;
