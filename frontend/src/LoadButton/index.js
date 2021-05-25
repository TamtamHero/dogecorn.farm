import React, { useState, useEffect, useCallback } from "react";
import "./index.css";

function LoadButton({ text, loadingText, disabled, hidden, onClick }) {
  const [isLoading, setLoading] = useState(false);
  const [opacity, setOpacity] = useState(1);

  const onTriggerRun = useCallback(() => {
    setLoading(true);
    onClick().then(() => {
      setLoading(false);
    });
  }, [onClick]);

  useEffect(() => {
    setOpacity(isLoading | disabled ? 0.5 : 1);
  }, [isLoading, disabled]);

  return (
    <div
      className="load-button"
      disabled={isLoading | disabled}
      onMouseEnter={() => !disabled && setOpacity(0.8)}
      onMouseLeave={() => !disabled && setOpacity(1)}
      style={{
        display: hidden ? "none" : true,
        opacity: disabled | isLoading ? 0.5 : 1,
        cursor: disabled ? "default" : "pointer",
      }}
    >
      <div
        className="button-background"
        style={{
          opacity: opacity,
        }}
      ></div>
      <div
        className="button-text"
        onClick={isLoading | disabled ? null : onTriggerRun}
      >
        {isLoading ? loadingText || "Loading…" : text}
      </div>
    </div>
  );
}

export default LoadButton;
