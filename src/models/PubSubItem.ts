export type typeOfSub = "shared" | "collaboration" | "publicGroup";
export interface ISubscriber {
    subId: string,
    type: typeOfSub
}
export interface PubSubItem {
    id: string,
    subscribers: ISubscriber[],
}
