import React from "react";

interface GoalTimingProps {
  startTime: string | null;
  endTime: string | null;
}

export const GoalTiming: React.FC<GoalTimingProps> = ({ startTime, endTime }) => {
  const renderTime = (time: string) => (
    <>
      <span>{parseInt(time, 10)}</span>
      <sup>00</sup>
    </>
  );

  return (
    <div className="MTL-goalTiming">
      {startTime && renderTime(startTime)}
      {startTime && endTime && <span> - </span>}
      {endTime && renderTime(endTime)}
    </div>
  );
};
