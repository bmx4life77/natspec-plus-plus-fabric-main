import fs from "fs";
import path from "path";
import { TagBank } from "../validation/TagBank";

export class TagBankExporter {
  export(outputPath: string): void {
    fs.writeFileSync(outputPath, JSON.stringify(TagBank, null, 2), "utf-8");
    console.log(`✅ Tag Bank exported to ${outputPath}`);
  }
}
