import sha256 from "crypto-js/sha256";

export const generateUniqueIdForSchInput = (inputString: string) => {
  return sha256(inputString).toString();
};

export const convertDateToDay = (date: Date) => `${date.toLocaleDateString("en-us", { weekday: "long" })}`.slice(0, 3);

export function getHrFromDateString(str: string) {
  return Number(str.slice(11, 13));
}
