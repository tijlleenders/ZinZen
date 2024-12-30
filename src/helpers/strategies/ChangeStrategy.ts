import { Payload } from "@src/models/InboxItem";

export interface ChangeStrategy {
  execute(payload: Payload, relId: string): Promise<void>;
}
