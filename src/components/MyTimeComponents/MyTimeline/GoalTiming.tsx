import React from "react";

interface GoalTimingProps {
  startTime: string | null;
  endTime: string | null;
}

export const GoalTiming: React.FC<GoalTimingProps> = ({ startTime, endTime }) => {
  return (
    <div className="MTL-goalTiming">
      {startTime ? (
        <>
          <span>{parseInt(startTime, 10)}</span>
          <sup>00</sup>
        </>
      ) : (
        ""
      )}
      <span>&nbsp;-&nbsp;</span>
      {endTime ? (
        <>
          <span>{parseInt(endTime, 10)}</span>
          <sup>00</sup>
        </>
      ) : (
        ""
      )}
    </div>
  );
};
