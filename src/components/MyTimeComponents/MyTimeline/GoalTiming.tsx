import React from "react";

interface GoalTimingProps {
  startTime: string | null;
  endTime: string | null;
}

export const GoalTiming: React.FC<GoalTimingProps> = ({ startTime, endTime }) => {
  const renderTime = (time: string | null) =>
    time ? (
      <>
        <span>{parseInt(time, 10)}</span>
        <sup>00</sup>
      </>
    ) : null;

  return (
    <div className="MTL-goalTiming">
      {renderTime(startTime)}
      {startTime && endTime && <span> - </span>}
      {renderTime(endTime)}
    </div>
  );
};
