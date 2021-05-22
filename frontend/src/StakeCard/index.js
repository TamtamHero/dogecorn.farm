import React, { useState, useEffect } from "react";
import "./index.css";

function StakeCard({ pool }) {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    setBalance(pool.balance);
    console.log(pool.balance);
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
        <div className={"balance"}>{balance}</div>
      </div>
    </div>
  );
}

export default StakeCard;
