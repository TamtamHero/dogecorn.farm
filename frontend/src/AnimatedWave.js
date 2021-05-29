// @flow
import React from "react";

export default function AnimatedWave({ height, color }) {
  return (
    <svg width="100%" height={height} fill="none">
      <path
        fill={color}
        d="
            M0 177
            C 273,183
              822,60
              1920,116

            V 0
            H 0
            V 0
            Z;"
      >
        <animate
          repeatCount="indefinite"
          attributeName="d"
          dur="21s"
          values="
            M0 177
            C 473,383
              822,60
              1920,116

            V 0
            H 0
            V 0
            Z;

            M0 177
            C 473,060
              1222,383
              1920,236

            V 0
            H 0
            V 0
            Z;

            M0 177
            C 473,383
              822,60
              1920,116

            V 0
            H 0
            V 0
            Z;
            "
        />
      </path>
    </svg>
  );
}
