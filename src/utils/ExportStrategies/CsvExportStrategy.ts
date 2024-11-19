import { db } from "@models";
import { ExportStrategy } from "@src/Interfaces/ExportStrategy";
import { convertJSONToCSV, downloadFile, getFileName } from "../BackupUtils";

export class CsvExportStrategy implements ExportStrategy {
  // eslint-disable-next-line class-methods-use-this
  async export(): Promise<void> {
    try {
      const goalsArray = await db.goalsCollection.toArray();
      const feelingsArray = await db.feelingsCollection.toArray();
      const goalsCollectionKeys = db.goalsCollection.schema.indexes;
      const goalsKeys = goalsCollectionKeys.map((key) => key.name);

      const feelingsCollectionKeys = db.feelingsCollection.schema.indexes;
      const feelingsKeys = feelingsCollectionKeys.map((key) => key.name);

      const goalsCsvContent = convertJSONToCSV(goalsArray, goalsKeys);
      const feelingsCsvContent = convertJSONToCSV(feelingsArray, feelingsKeys);

      const goalsBlob = new Blob([goalsCsvContent], { type: "text/csv;charset=utf-8;" });
      const feelingsBlob = new Blob([feelingsCsvContent], { type: "text/csv;charset=utf-8;" });

      await downloadFile(goalsBlob, getFileName("ZinZenGoals", "csv"));
      await downloadFile(feelingsBlob, getFileName("ZinZenFeelings", "csv"));
    } catch (error) {
      console.error("CSV Export failed:", error);
      throw error;
    }
  }
}
