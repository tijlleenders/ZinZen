import React from "react";

interface GoalTimingProps {
  startTime: string | null;
  endTime: string | null;
  showTaskOptions: boolean;
  is24HourFormat: boolean;
}

export const GoalTiming: React.FC<GoalTimingProps> = ({
  startTime,
  endTime,
  showTaskOptions,
  is24HourFormat = true,
}) => {
  const formatTime = (time: string) => {
    let hours = parseInt(time, 10);
    let ampm = "AM";

    if (!is24HourFormat) {
      if (hours >= 12) {
        ampm = "PM";
        hours = hours > 12 ? hours - 12 : hours;
      }
      hours = hours === 0 ? 12 : hours;
    }

    const formattedHours = is24HourFormat ? `${hours < 10 ? `0${hours}` : hours}` : `${hours}`;

    return {
      formattedHours,
      ampm: !is24HourFormat ? `00 ${ampm}` : "00",
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
