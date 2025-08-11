import React from "react";
import { useTranslation } from "react-i18next";
import CustomDatePicker from "./components/CustomDatePicker";

interface DueDateProps {
  dateValue: string;
  handleDateChange: (newDate: string) => void;
}

const DueDate = ({ dateValue, handleDateChange }: DueDateProps) => {
  const { t } = useTranslation();

  return (
    <>
      <span>{t("dueDate")}</span>
      <CustomDatePicker
        dateValue={dateValue}
        handleDateChange={(newDate) => {
          handleDateChange(newDate);
        }}
        disablePastDates
      />
    </>
  );
};

export default DueDate;
