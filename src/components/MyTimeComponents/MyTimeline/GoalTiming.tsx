import React from "react";

interface GoalTimingProps {
  startTime: string | null;
  endTime: string | null;
  showTaskOptions: boolean;
}

export const GoalTiming: React.FC<GoalTimingProps> = ({ startTime, endTime, showTaskOptions }) => {
  const renderTime = (time: string) => (
    <p>
      {parseInt(time, 10)} <sup>00</sup>
    </p>
  );

  return (
    <div className="MTL-goalTiming">
      {startTime && renderTime(startTime)}
      {endTime && showTaskOptions && renderTime(endTime)}
    </div>
  );
};
