import React, { useState } from "react";
import "./index.css";
import StakeCard from "../StakeCard";

function Launchpad({ pools }) {
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
              {pools.earn.map((pool) => (
                <StakeCard key={pool.title} pool={pool}></StakeCard>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="Pad">
          <div>
            <div className="cardholder">
              {pools.farm.map((pool) => (
                <StakeCard
                  key={pool.title}
                  title={pool.title}
                  description={pool.description}
                  rainbow={pool.incentive}
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
