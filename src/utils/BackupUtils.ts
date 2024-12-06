/* eslint-disable @typescript-eslint/no-explicit-any */
export function formatCsvValue(value: any): string {
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

export function convertJSONToCSV(jsonData: any[], columnHeaders: string[]): string {
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

export function getFileName(name: string, type: "json" | "csv"): string {
  return `${name}-${new Date().toLocaleDateString()}.${type}`;
}

export function downloadFile(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
