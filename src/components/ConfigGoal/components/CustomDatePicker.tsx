import React from "react";

interface ICustomDatePicker {
  label?: string;
  dateValue: string;
  handleDateChange: (value: string) => void;
  disablePastDates?: boolean;
}

const CustomDatePicker: React.FC<ICustomDatePicker> = ({ label, dateValue, handleDateChange, disablePastDates }) => {
  const todayDate = new Date().toISOString().slice(0, 10);

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        gap: 12,
        alignItems: "center",
        fontSize: 12,
      }}
    >
      {label && (
        <span
          style={{
            position: "absolute",
            top: 0,
            fontWeight: 500,
          }}
        >
          {label}
        </span>
      )}
      <input
        type="date"
        style={{
          boxShadow: "var(--shadow)",
          backgroundColor: "var(--secondary-background)",
        }}
        value={dateValue}
        onChange={(e) => handleDateChange(e.target.value)}
        min={disablePastDates ? todayDate : undefined}
        className="datepicker"
      />
    </div>
  );
};

export default CustomDatePicker;
