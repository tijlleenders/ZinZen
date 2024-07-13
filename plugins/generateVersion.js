import fs from "fs";
import path from "path";

function generateVersion() {
  return {
    name: "generate-version",
    closeBundle() {
      const buildDir = path.resolve(__dirname, "../dist/assets"); // Adjusted to ensure correct path resolution
      console.log(`Build directory: ${buildDir}`);
      const files = fs.readdirSync(buildDir);
      console.log("files...", files);
      const mainFile = files.find((file) => file.startsWith("scheduler_bg.b66a66a2.wasm"));
      console.log("main file", mainFile);
      if (mainFile) {
        const buildHash = mainFile.split(".")[1];
        const versionData = { buildHash, buildDate: new Date().toISOString() };

        fs.writeFileSync(path.resolve(__dirname, "../src/version.json"), JSON.stringify(versionData, null, 2));
        console.log("version.json created:", versionData);
      }
    },
  };
}

export default generateVersion;
