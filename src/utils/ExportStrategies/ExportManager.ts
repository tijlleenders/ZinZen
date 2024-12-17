/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExportStrategy } from "@src/Interfaces/ExportStrategy";

export class ExportManager {
  private strategy: ExportStrategy;

  constructor(strategy: ExportStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: ExportStrategy) {
    this.strategy = strategy;
  }

  async export(options?: Record<string, any>): Promise<void> {
    await this.strategy.export(options);
  }
}
