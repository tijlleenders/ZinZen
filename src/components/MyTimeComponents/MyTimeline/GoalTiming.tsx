import React from "react";

interface GoalTimingProps {
  startTime: string | null;
  endTime: string | null;
  showTaskOptions: boolean;
  displayEndTime: boolean;
}

export const GoalTiming: React.FC<GoalTimingProps> = ({ startTime, endTime, showTaskOptions, displayEndTime }) => {
  const renderTime = (time: string, className: string) => (
    <p className={className}>
      {parseInt(time, 10)} <sup>00</sup>
    </p>
  );

  return (
    <div className="MTL-goalTiming">
      {startTime && renderTime(startTime, "MTL-startTime")}
      {endTime && displayEndTime && showTaskOptions && renderTime(endTime, "MTL-endTime")}
    </div>
  );
};
