import { db } from "@models";
import { ExportStrategy } from "@src/types/export";

function formatCsvValue(value: any): string {
  if (value === null || value === undefined) {
    return '""';
  }

  if (Array.isArray(value)) {
    const isArrayOfObjects = value.some((item) => typeof item === "object" && !Array.isArray(item));

    if (isArrayOfObjects) {
      return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
    }
    const formattedArray = value.map((item) => formatCsvValue(item).replace(/^"|"$/g, "")).join(";");
    return `"${formattedArray}"`;
  }

  if (typeof value === "object" && !(value instanceof Date)) {
    const formattedObject = Object.entries(value).reduce(
      (acc, [key, val]) => {
        if (val === null || val === undefined) {
          acc[key] = '""';
        } else {
          acc[key] = formatCsvValue(val).replace(/^"|"$/g, "");
        }
        return acc;
      },
      {} as Record<string, string>,
    );
    return `"${JSON.stringify(formattedObject).replace(/"/g, '""')}"`;
  }

  if (value instanceof Date) {
    return `"${value.toISOString()}"`;
  }

  if (typeof value === "string") {
    const escaped = value.replace(/"/g, '""');
    return `"${escaped}"`;
  }

  if (typeof value === "boolean") {
    return value.toString();
  }

  return value.toString();
}

function convertJSONToCSV(jsonData: any[], columnHeaders: string[]): string {
  if (jsonData.length === 0) {
    return "";
  }

  const headers = `${columnHeaders.join(",")}\n`;

  const rows = jsonData
    .map((row) => {
      return columnHeaders.map((field) => formatCsvValue(row[field])).join(",");
    })
    .join("\n");

  return headers + rows;
}

export class CsvExportStrategy implements ExportStrategy {
  async export(): Promise<void> {
    try {
      const goals = await db.goalsCollection.toArray();
      const feelings = await db.feelingsCollection.toArray();
      const goalsCollectionKeys = db.goalsCollection.schema.indexes;
      const keys = goalsCollectionKeys.map((key) => key.name);

      const csvContent = convertJSONToCSV(goals, keys);

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      await this.downloadFile(blob);
    } catch (error) {
      console.error("CSV Export failed:", error);
      throw error;
    }
  }

  static getFileName(): string {
    return `ZinZen-Export-${new Date().toLocaleDateString()}.csv`;
  }

  private async downloadFile(blob: Blob): Promise<void> {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = CsvExportStrategy.getFileName();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
