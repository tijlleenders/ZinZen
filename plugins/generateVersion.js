import fs from "fs";
import path from "path";

function generateBuildInfo() {
  return {
    name: "generate-version",
    closeBundle() {
      const buildDir = path.resolve(__dirname, "../dist/assets"); // Adjusted to ensure correct path resolution
      console.log(`Build directory: ${buildDir}`);
      const files = fs.readdirSync(buildDir);
      console.log("files...", files);
      const schedulerFile = files.find((file) => file.startsWith("scheduler_bg"));
      const indexFile = files.find((file) => file.startsWith("index"));

      console.log("main file", schedulerFile);
      if (schedulerFile && indexFile) {
        const schedulerFileHash = schedulerFile.split(".")[1];
        const indexFileHash = indexFile.split(".")[1];
        const versionData = { buildHash: { schedulerFileHash, indexFileHash }, buildDate: new Date().toISOString() };

        fs.writeFileSync(path.resolve(__dirname, "../src/version.json"), JSON.stringify(versionData, null, 2));
        console.log("version.json created:", versionData);
      }
    },
  };
}

export default generateBuildInfo;
