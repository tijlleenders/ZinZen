import { Payload } from "../InboxProcessor";

export interface ChangeStrategy {
  execute(payload: Payload, relId: string): Promise<void>;
}
