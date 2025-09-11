import fs from "fs";
import path from "path";

export function loadGasMetrics(): { epoch: string; gasUsed: number }[] {
  const benchmarkDir = path.join(__dirname, "../../../benchmarks");
  const files = fs.readdirSync(benchmarkDir);

  return files
    .filter(f => f.endsWith(".json"))
    .map(f => {
      const content = fs.readFileSync(path.join(benchmarkDir, f), "utf-8");
      const data = JSON.parse(content);
      return {
        epoch: data.epoch,
        gasUsed: parseInt(data.gasUsed)
      };
    });
}
