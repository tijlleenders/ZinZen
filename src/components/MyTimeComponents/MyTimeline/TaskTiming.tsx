import React from "react";
import { getTimePart } from "@src/utils";

interface TaskTimingProps {
  start: string;
  deadline: string;
}

const renderTime = (time: string | null, className: string) => {
  if (!time) return null;
  return (
    <p className={className}>
      {parseInt(time, 10)} <sup>00</sup>
    </p>
  );
};

const TaskTiming: React.FC<TaskTimingProps> = ({ start, deadline }) => {
  const startTime = getTimePart(start);
  const endTime = getTimePart(deadline);

  return (
    <>
      {renderTime(startTime, "MTL-startTime")}
      {renderTime(endTime, "MTL-endTime")}
    </>
  );
};

export default React.memo(TaskTiming);
