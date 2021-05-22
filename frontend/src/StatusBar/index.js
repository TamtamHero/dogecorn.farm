import React, { useState, useCallback, useEffect } from "react";
import "./index.css";

function StatusBar({ color, account, balance, onClick }) {
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
      setAccountAddr(account[0].slice(0, 8) + "...");
    }
  }, [account]);

  return (
    <button
      className="ConnectButton"
      disabled={isLoading | (accountAddr !== "")}
      onClick={isLoading ? null : onTriggerRun}
      style={{
        margin: "10px",
        backgroundColor: color,
      }}
    >
      {accountAddr ? accountAddr : isLoading ? "Loading…" : "Connect wallet"}
    </button>
  );
}

export default StatusBar;
