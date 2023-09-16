export type typeOfSub = "shared" | "collaboration" | "publicGroup" | "suggestion";
export interface ISubscriber {
  subId: string;
  type: typeOfSub;
}
export interface PubSubItem {
  id: string;
  subscribers: ISubscriber[];
}
