import React, { useState, useCallback, useEffect } from "react";
import "./index.css";
import { getFormattedBalance } from "../helpers.js";
import logo from "../doge-logo.svg";
import polygonLogo from "../logo.svg";

function StatusBar({ account, maticBalance, dogeBalance, onClick }) {
  const [isLoading, setLoading] = useState(false);
  const [accountAddr, setAccountAddr] = useState("");

  const onTriggerRun = useCallback(() => {
    if (account === "Not connected") {
      setLoading(true);
      onClick().then(() => {
        setLoading(false);
      });
    }
  }, [onClick, account]);

  useEffect(() => {
    if (account !== "Not connected") {
      setAccountAddr(
        account[0].slice(0, 4) +
          "..." +
          account[0].slice(account[0].length - 4, account[0].length)
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
