import React, { useState, useEffect } from "react";
import StakeMenu from "../StakeMenu";
import LoadButton from "../LoadButton";
import { BN } from "bn.js";
import { getFormattedBalance } from "../helpers.js";
import "./index.css";

function StakeCard({ accountManager, pool }) {
  const [allowance, setAllowance] = useState(0);

  useEffect(() => {
    if (pool.allowance) {
      const allowance_BN = new BN(pool.allowance, 10);
      if (!allowance_BN.isZero()) {
        setAllowance(pool.allowance);
      }
    }
  }, [pool.allowance]);

  return (
    <div
      className={
        pool.incentive ? "card-border--rainbow" : "card-border--normal"
      }
    >
      <div className="card">
        <div className="title">{pool.title}</div>
        <div className="description">
          {
            <>
              {pool.description}
              <br></br>
              {"APY: 1456%"}
            </>
          }
        </div>
        {allowance ? (
          <StakeMenu accountManager={accountManager} pool={pool}></StakeMenu>
        ) : (
          <div className="approval-button">
            <LoadButton
              text="Allow Deposit"
              loadingText="Allowing..."
              disabled={!accountManager.connected}
              onClick={() =>
                accountManager.setTokenAllowance(pool.tokenAddress)
              }
            ></LoadButton>
          </div>
        )}
      </div>
    </div>
  );
}

export default StakeCard;
