import React from "react";
import { Select } from "antd";
import { useTranslation } from "react-i18next";

interface ICustomDatePicker {
  label?: string;
  dateValue: string;
  timeValue: number;
  handleDateChange: (value: string) => void;
  handleTimeChange?: (value: number) => void;
  showTime?: boolean;
  disablePastDates?: boolean;
}

const CustomDatePicker: React.FC<ICustomDatePicker> = ({
  label,
  dateValue,
  timeValue,
  handleDateChange,
  handleTimeChange,
  showTime,
  disablePastDates,
}) => {
  const { t } = useTranslation();

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
        }}
        value={dateValue}
        onChange={(e) => handleDateChange(e.target.value)}
        min={disablePastDates ? todayDate : undefined}
        className="datepicker"
      />
      {showTime && (
        <>
          <span>{t("at")}</span>
          <Select
            className="timepicker"
            value={timeValue || 0}
            placeholder="Select Time"
            onChange={handleTimeChange}
            options={[...Array(24).keys()].map((hr) => ({
              value: hr,
              label: `${hr > 9 ? "" : "0"}${hr}:00`,
            }))}
          />
        </>
      )}
    </div>
  );
};

export default CustomDatePicker;
