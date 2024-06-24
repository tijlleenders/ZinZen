export interface IFeelingItem {
  id?: number;
  content: string;
  category: string;
  date: Date;
  note?: string;
}

export type TFeelingsObject = { [id: string]: IFeelingItem[] };
