export interface ExportStrategy {
  export(): Promise<void>;
}
