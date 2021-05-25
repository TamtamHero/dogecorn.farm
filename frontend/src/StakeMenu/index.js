import React, { useState, useEffect } from "react";
import AmountInputField from "../AmountInputField";
import LoadButton from "../LoadButton";
import { BN } from "bn.js";
import { getFormattedBalance } from "../helpers.js";
import "./index.css";

function StakeMenu({ accountManager, pool }) {
  const [deposable, setDeposable] = useState(false);
  const [withdrawable, setWithdrawable] = useState(false);
  const [harvestable, setHarvestable] = useState(false);

  useEffect(() => {
    if (pool.balance) {
      const balance_BN = new BN(pool.balance, 10);
      if (!balance_BN.isZero()) {
        setDeposable(true);
      }
    }
  }, [pool.balance]);

  return (
    <div className="stake-menu">
      <div className="balance">
        Available: {getFormattedBalance(pool.balance)}
        <br></br>
        Deposited: {getFormattedBalance(pool.deposited)}
      </div>
      <div className="action-buttons">
        <LoadButton
          text="Deposit"
          loadingText="Deposing..."
          disabled={!accountManager.connected || !deposable}
          onClick={() => accountManager.setTokenAllowance(pool.tokenAddress)}
        ></LoadButton>
        <LoadButton
          text="Withdraw"
          loadingText="Withdrawing..."
          disabled={!accountManager.connected || !withdrawable}
          onClick={() => accountManager.setTokenAllowance(pool.tokenAddress)}
        ></LoadButton>
        <LoadButton
          text="Harvest"
          loadingText="Harvesting..."
          disabled={!accountManager.connected || !harvestable}
          onClick={() => accountManager.setTokenAllowance(pool.tokenAddress)}
        ></LoadButton>
      </div>
    </div>
    //   {/* // <AmountInputField pool={pool}></AmountInputField> */}
  );
}

export default StakeMenu;
