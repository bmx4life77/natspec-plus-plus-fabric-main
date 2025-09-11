import { TagProfileValidator } from "../../shared/validation/TagProfileValidator";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import Table from "cli-table3";
import { MarkdownExporter } from "../export/MarkdownExporter";
import { TagBankExporter } from "../export/TagBankExporter";

const reportPath = path.join(__dirname, "..", "..", "benchmark-report.json");
const validator = new TagProfileValidator();

if (!fs.existsSync(reportPath)) {
  console.error(chalk.red("❌ benchmark-report.json not found."));
  process.exit(1);
}

let report: any[] = [];

try {
  const raw = fs.readFileSync(reportPath, "utf-8").trim();
  const parsed = raw ? JSON.parse(raw) : [];
  report = Array.isArray(parsed) ? parsed : [parsed];
} catch (err) {
  console.error(chalk.red("❌ Failed to parse benchmark-report.json"));
  console.error((err as Error).message);
  process.exit(1);
}

if (report.length === 0) {
  console.log(chalk.yellow("⚠️ No benchmark data found. Run `npx hardhat natspec:benchmark` first."));
  process.exit(0);
  console.log(`⏱️ Execution time for ${method}: ${Math.round(end - start)}ms`);
}

const table = new Table({
  head: ["Method", "Gas Used", "Execution Time (ms)", "Tag Coverage"],
  colWidths: [25, 15, 20, 20],
});

report.forEach((entry: any) => {
  const result = validator.validateProfile(entry.method, entry.tags);

table.push([
  chalk.cyan(entry.method),
  chalk.yellow(String(entry.gasUsed ?? "—")),
  chalk.green(`${entry.executionTimeMs ?? "—"}ms`),
  result.missing.length === 0
    ? chalk.green("Full Coverage")
    : chalk.red(`Missing: ${result.missing.join(", ")}`)
]);

});

console.log(chalk.bold("\n📊 Benchmark Performance Dashboard\n"));
console.log(table.toString());

// ✅ Export markdown once, after rendering
const exporter = new MarkdownExporter();
const markdownPath = path.join(__dirname, "..", "..", "benchmark-report.md");
exporter.export(report, markdownPath);

const tagBankPath = path.join(__dirname, "..", "..", "tag-bank.json");
const tagBankExporter = new TagBankExporter();
tagBankExporter.export(tagBankPath);
