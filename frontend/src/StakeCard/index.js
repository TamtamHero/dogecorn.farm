import React, { useState } from "react";
import "./index.css";

function StakeCard({ title, description, rainbow }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className={rainbow ? "card-border--rainbow" : "card-border--normal"}>
      <div className="card">
        <span>{title}</span>
        <div className={"button"}>
          <span>{description}</span>
        </div>
      </div>
    </div>
  );
}

export default StakeCard;
