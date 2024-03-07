import React from "react";

import { useRecoilValue } from "recoil";
import { is24HourFormat } from "@src/store/HourFormatState";

interface GoalTimingProps {
  startTime: string | null;
  endTime: string | null;
  showTaskOptions: boolean;
}

export const GoalTiming: React.FC<GoalTimingProps> = ({ startTime, endTime, showTaskOptions }) => {
  const hourFormat = useRecoilValue(is24HourFormat);
  const formatTime = (time: string) => {
    let hours = parseInt(time, 10);
    let ampm = "AM";

    if (!hourFormat) {
      if (hours >= 12) {
        ampm = "PM";
        hours = hours > 12 ? hours - 12 : hours;
      }
      hours = hours === 0 ? 12 : hours;
    }

    const formattedHours = hourFormat ? `${hours < 10 ? `0${hours}` : hours}` : `${hours}`;

    return {
      formattedHours,
      ampm: !hourFormat ? `00 ${ampm}` : "00",
    };
  };

  const renderTime = (time: string, className: string) => {
    const { formattedHours, ampm } = formatTime(time);
    return (
      <p className={className}>
        {formattedHours} <sup>{ampm}</sup>
      </p>
    );
  };

  return (
    <div className="MTL-goalTiming">
      {startTime && renderTime(startTime, "MTL-startTime")}
      {endTime && showTaskOptions && renderTime(endTime, "MTL-endTime")}
    </div>
  );
};
