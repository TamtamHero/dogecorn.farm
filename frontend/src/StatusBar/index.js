import React, { useState, useCallback, useEffect } from "react";
import "./index.css";
import { getFormattedBalance } from "../helpers.js";
import logo from "../doge-logo.svg";
import polygonLogo from "../logo.svg";

function StatusBar({ account, maticBalance, dogeBalance, onClick }) {
  const [isLoading, setLoading] = useState(false);
  const [accountAddr, setAccountAddr] = useState("");

  const onTriggerRun = useCallback(() => {
    if (!account) {
      setLoading(true);
      onClick().then(() => {
        setLoading(false);
      });
    }
  }, [onClick, account]);

  useEffect(() => {
    if (account) {
      setAccountAddr(
        account.slice(0, 4) +
          "..." +
          account.slice(account.length - 4, account.length)
      );
    }
  }, [account]);

  return (
    <div className="status-bar-wrapper">
      <div className="doge-balance" hidden={!dogeBalance}>
        <img src={logo} className="logo" alt="doge-logo" />
        <div className="amount">{getFormattedBalance(dogeBalance)}</div>
      </div>
      <div className="polygon-status">
        <div className="polygon-balance" hidden={!maticBalance}>
          <img src={polygonLogo} className="logo" alt="polygon-logo" />
          <div className="amount">{getFormattedBalance(maticBalance)}</div>
        </div>
        <button
          className="connect-button"
          disabled={isLoading | (accountAddr !== "")}
          onClick={isLoading ? null : onTriggerRun}
          style={{
            cursor: isLoading | (accountAddr !== "") ? "default" : "pointer",
          }}
        >
          <div className="connect-button-content">
            {accountAddr
              ? accountAddr
              : isLoading
              ? "Loading…"
              : "Connect wallet"}
          </div>
        </button>
      </div>
    </div>
  );
}

export default StatusBar;
