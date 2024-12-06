import { db } from "@src/models";
import { ExportStrategy } from "@src/Interfaces/ExportStrategy";
import { downloadFile, getFileName } from "../BackupUtils";

export class JsonExportStrategy implements ExportStrategy {
  // eslint-disable-next-line class-methods-use-this
  async export(): Promise<void> {
    const file = await db.export({ prettyJson: true });
    const blob = new Blob([file], { type: "application/json" });
    await downloadFile(blob, getFileName("ZinZenBackup", "json"));
  }
}
