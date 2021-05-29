import React, { useState, useEffect } from "react";
import AmountInputField from "../AmountInputField";
import LoadButton from "../LoadButton";
import { BN } from "bn.js";
import { getFormattedBalance } from "../helpers.js";
import "./index.css";

function StakeMenu({ accountManager, pool, onUpdate }) {
  const [deposable, setDeposable] = useState(false);
  const [withdrawable, setWithdrawable] = useState(false);
  const [harvestable, setHarvestable] = useState(false);

  useEffect(() => {
    if (pool.balance) {
      const balance_BN = new BN(pool.balance, 10);
      setDeposable(!balance_BN.isZero());
    }
    if (pool.deposited) {
      const deposited_BN = new BN(pool.deposited, 10);
      setWithdrawable(!deposited_BN.isZero());
    }
    if (pool.harvest) {
      const harvest_BN = new BN(pool.harvest, 10);
      setHarvestable(!harvest_BN.isZero());
    }
  }, [pool]);

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
          onClick={async () => {
            await accountManager.deposit(pool.pid, pool.balance);
            onUpdate();
          }}
        ></LoadButton>
        <LoadButton
          text="Withdraw"
          loadingText="Withdrawing..."
          disabled={!accountManager.connected || !withdrawable}
          onClick={async () => {
            await accountManager.withdraw(pool.pid, pool.deposited);
            onUpdate();
          }}
        ></LoadButton>
        <LoadButton
          text={"Harvest" + ( harvestable ? " " + getFormattedBalance(pool.harvest) : "") }
          loadingText="Harvesting..."
          disabled={!accountManager.connected || !harvestable}
          onClick={async () => {
            await accountManager.harvest(pool.pid);
            onUpdate();
          }}
        ></LoadButton>
      </div>
    </div>
    //   {/* // <AmountInputField pool={pool}></AmountInputField> */}
  );
}

export default StakeMenu;
