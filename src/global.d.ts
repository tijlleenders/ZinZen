import { IFeelingItem } from "@models";

declare module "*.png";
declare module "*.jpeg";
declare module "*.jpg";
declare module "*.svg";
declare module "*interfaces";
declare module "*ILanguage";
declare module "*FeelingsAPI";
declare module "*GoalsAPI";

export type feelingListType = {
  [key: string]: IFeelingItem[];
};
