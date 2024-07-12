const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const packageJson = require("./package.json");

/** Getting hashes of release package files, including the scheduler wasm */

function getHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash("sha256");
  hashSum.update(fileBuffer);
  const hexHash = hashSum.digest("hex");
  const decimalHash = BigInt("0x" + hexHash).toString(); //convert hex to decimal
  return decimalHash;
}

const buildInfo = {
  version: packageJson.version,
  releaseDate: new Date().toISOString(),
  buildHash: getHash(path.resolve(__dirname, "pkg/scheduler_bg.wasm")),
};

fs.writeFileSync(path.resolve(__dirname, "dist", "build-info.json"), JSON.stringify(buildInfo, null, 2));

console.log("Build info generated:", buildInfo);
