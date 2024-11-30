import { db } from "@models";
import { ExportStrategy } from "@src/Interfaces/ExportStrategy";
import { convertJSONToCSV, downloadFile, getFileName } from "../BackupUtils";

export class CsvExportStrategy implements ExportStrategy {
  // eslint-disable-next-line class-methods-use-this
  async export(): Promise<void> {
    try {
      const goalsArray = await db.goalsCollection.toArray();
      const feelingsArray = await db.feelingsCollection.toArray();

      if (goalsArray.length > 0) {
        const goalsCollectionKeys = db.goalsCollection.schema.indexes;
        const goalsKeys = goalsCollectionKeys.map((key) => key.name);
        const goalsCsvContent = convertJSONToCSV(goalsArray, goalsKeys);
        const goalsBlob = new Blob([goalsCsvContent], { type: "text/csv;charset=utf-8;" });
        await downloadFile(goalsBlob, getFileName("ZinZenGoals", "csv"));
      }

      if (feelingsArray.length > 0) {
        const formattedFeelingsArray = feelingsArray.map((feeling) => ({
          ...feeling,
          date: new Date(feeling.date).toISOString().slice(0, 10),
        }));

        const feelingsCollectionKeys = db.feelingsCollection.schema.indexes;
        const feelingsKeys = feelingsCollectionKeys.map((key) => key.name);
        const feelingsCsvContent = convertJSONToCSV(formattedFeelingsArray, feelingsKeys);
        const feelingsBlob = new Blob([feelingsCsvContent], { type: "text/csv;charset=utf-8;" });
        await downloadFile(feelingsBlob, getFileName("ZinZenFeelings", "csv"));
      }
    } catch (error) {
      console.error("CSV Export failed:", error);
      throw error;
    }
  }
}
