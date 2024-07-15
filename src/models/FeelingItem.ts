export interface IFeelingItem {
  id?: number;
  content: string;
  category: string;
  date: number;
  note?: string;
}

export type TFeelingsObject = { [id: string]: IFeelingItem[] };
