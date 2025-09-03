import DefaultInput from "@src/common/DefaultInput";
import React from "react";
import { useTranslation } from "react-i18next";
import { roundOffHours } from "./ConfigGoal.helper";

interface DurationProps {
  value: string;
  onChange: (value: string) => void;
}

const Duration = ({ value, onChange }: DurationProps) => {
  const { t } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(roundOffHours(e.target.value));
  };

  return (
    <>
      <span>{t("duration")}</span>
      <DefaultInput
        type="number"
        value={value}
        width={20}
        textAlign="center"
        onChange={handleChange}
        customStyle={{ borderRadius: "4px", padding: "8px 8px" }}
      />
    </>
  );
};

export default Duration;
