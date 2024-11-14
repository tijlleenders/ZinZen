export interface ExportStrategy {
  export(): Promise<void>;
  getFileName(): string;
}
