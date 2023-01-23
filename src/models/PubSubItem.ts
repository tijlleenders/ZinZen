export interface ISubscriber {
    relId: string,
    type: "shared" | "collaboration"
}
export interface PubSubItem {
    id: string,
    subscribers: ISubscriber[],
}
