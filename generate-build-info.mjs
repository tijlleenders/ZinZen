import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";
import crypto from "crypto";

/** Getting hashes of release package files, including the scheduler wasm */

// Get current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash("sha256");
  hashSum.update(fileBuffer);
  const hexHash = hashSum.digest("hex");
  const decimalHash = BigInt("0x" + hexHash).toString(); //convert hex to decimal
  return decimalHash;
}

const buildInfo = {
  releaseDate: new Date().toISOString(),
  buildHash: getHash(path.resolve(__dirname, "pkg/scheduler_bg.wasm")),
};

const outputPath = path.resolve(__dirname, "src", "version.json");

fs.writeFileSync(outputPath, JSON.stringify(buildInfo, null, 2));

console.log("Build info generated:", buildInfo);
console.log("Output written to:", outputPath);
