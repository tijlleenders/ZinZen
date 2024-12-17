/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ExportStrategy {
  export(options?: Record<string, any>): Promise<void>;
}
