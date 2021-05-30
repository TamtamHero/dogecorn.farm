import React, { useState } from "react";
import "./index.css";
import StakeCard from "../StakeCard";

function Launchpad({ accountManager, pools, onUpdate }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="PadWrapper">
      <div className="tabs">
        <div
          onClick={() => setActiveTab(0)}
          className={`tab ${activeTab === 0 ? "active" : ""}`}
        >
          {"EARN"}
        </div>
        <div
          onClick={() => setActiveTab(1)}
          className={`tab ${activeTab === 1 ? "active" : ""}`}
        >
          {"FARM"}
        </div>
      </div>
      {activeTab === 0 ? (
        <div className="Pad">
          <div>
            <div className="cardholder">
              {pools
                .filter((pool) => pool.type === "doge")
                .map((pool) => (
                  <StakeCard
                    key={pool.title}
                    accountManager={accountManager}
                    pool={pool}
                    onUpdate={onUpdate}
                  ></StakeCard>
                ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="Pad">
          <div>
            <div className="cardholder">
              {pools
                .filter((pool) => pool.type === "farm")
                .map((pool) => (
                  <StakeCard
                    key={pool.title}
                    accountManager={accountManager}
                    pool={pool}
                    onUpdate={onUpdate}
                  ></StakeCard>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Launchpad;
