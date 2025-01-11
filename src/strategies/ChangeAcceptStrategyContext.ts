import { ChangeAcceptParams, ChangeAcceptStrategy } from "@src/Interfaces/ChangeAccept";

export class ChangeAcceptStrategyContext {
  private strategy: ChangeAcceptStrategy;

  setStrategy(strategy: ChangeAcceptStrategy) {
    this.strategy = strategy;
  }

  async executeStrategy(params: ChangeAcceptParams) {
    await this.strategy.execute(params);
  }
}
