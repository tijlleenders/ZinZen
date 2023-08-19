import { Select } from "antd";
import React from "react";

interface ICustomDatePicker {
  label: string;
  dateValue: string;
  timeValue: number;
  handleDateChange: (value: string) => void;
  handleTimeChange: (value: number) => void;
}
const CustomDatePicker: React.FC<ICustomDatePicker> = ({
  label,
  dateValue,
  timeValue,
  handleDateChange,
  handleTimeChange,
}) => {
  return (
    <div
      style={{
        paddingTop: 25,
        position: "relative",
        display: "flex",
        gap: 12,
        alignItems: "center",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 0,
          fontWeight: 500,
        }}
      >
        {label}
      </span>
      <input
        type="date"
        value={dateValue}
        onChange={(e) => {
          handleDateChange(e.target.value);
        }}
        className="datepicker"
      />
      <span>at</span>
      <Select
        value={timeValue || 0}
        placeholder="Select Time"
        onChange={handleTimeChange}
        options={[...Array(24).keys()].map((hr) => ({
          value: hr,
          label: `${hr > 9 ? "" : "0"}${hr}:00`,
        }))}
      />
    </div>
  );
};

export default CustomDatePicker;
