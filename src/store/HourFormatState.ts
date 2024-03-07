import { atom } from "recoil";

const getHourFormatValue = () => {
  const mode = localStorage.getItem("hourFormat");
  if (mode && (mode === "24" || mode === "12")) {
    return mode;
  }
  return "24";
};

export const is24HourFormat = atom({
  key: "hourFormat",
  default: getHourFormatValue() === "24",
});
