import { Payload } from "../InboxProcessor";
import { ChangeStrategy } from "./ChangeStrategy";

export class SharedGoalChangesManager {
  private strategy: ChangeStrategy;

  setStrategy(strategy: ChangeStrategy) {
    this.strategy = strategy;
  }

  public async execute(payload: Payload, relId: string): Promise<void> {
    await this.strategy.execute(payload, relId);
  }
}
