import { task } from "hardhat/config";
import { execSync } from "child_process";
import path from "path";

task("natspec:dashboard", "Render benchmark performance dashboard").setAction(() => {
  const scriptPath = path.join(__dirname, "..", "tools", "dashboard", "renderBenchmarkDashboard.ts");
  execSync(`ts-node ${scriptPath}`, { stdio: "inherit" });
});

