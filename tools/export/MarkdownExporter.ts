import fs from "fs";
import path from "path";

export class MarkdownExporter {
  export(report: any[], outputPath: string): void {
    const lines: string[] = [];

    lines.push(`# 📊 Benchmark Report`);
    lines.push(`Generated on: ${new Date().toISOString()}\n`);

    for (const entry of report) {
      lines.push(`## Method: \`${entry.method}\``);
      lines.push(`- **Contract**: \`${entry.contract}\``);
      lines.push(`- **Gas Estimate**: \`${entry.gasEstimate}\``);
      lines.push(`- **Execution Time**: \`${entry.executionTimeMs} ms\``);
      lines.push(`- **Success**: \`${entry.success ? "✅" : "❌"}\``);

      lines.push(`### Tags`);
   for (const [tag, data] of Object.entries(entry.tags || {})) {
  const tagData = data as { value: any };
  lines.push(`- \`${tag}\`: \`${tagData.value}\``);
}



      lines.push(`\n---\n`);
    }

    fs.writeFileSync(outputPath, lines.join("\n"), "utf-8");
    console.log(`✅ Markdown report saved to ${outputPath}`);
  }
}
