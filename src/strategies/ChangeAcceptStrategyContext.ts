import { ChangeAcceptStrategy } from "@src/Interfaces/ChangeAccept";

export class ChangeAcceptStrategyContext {
  private strategy: ChangeAcceptStrategy;

  setStrategy(strategy: ChangeAcceptStrategy) {
    this.strategy = strategy;
  }

  async executeStrategy(params: any) {
    await this.strategy.execute(params);
  }
}
