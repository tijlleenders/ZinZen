import { db } from "@src/models";
import { ExportStrategy } from "@src/types/export";

export class JsonExportStrategy implements ExportStrategy {
  async export(): Promise<void> {
    const file = await db.export({ prettyJson: true });
    const blob = new Blob([file], { type: "application/json" });
    await this.downloadFile(blob);
  }

  getFileName(): string {
    return `ZinZenBackup-${new Date().toLocaleDateString()}.json`;
  }

  private async downloadFile(blob: Blob): Promise<void> {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = this.getFileName();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
