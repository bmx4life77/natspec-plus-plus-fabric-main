import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import fs from "fs";
import path from "path";
import { NatSpecBenchmarker } from "../tools/benchmarking/NatSpecBenchmarker";

task("natspec:benchmark", "Benchmarks tagged contract methods")
  .setAction(async (_: any, hre: HardhatRuntimeEnvironment) => {
    const benchmarker = new NatSpecBenchmarker();

    const contractFactory = await hre.ethers.getContractFactory("ParallelExecutionFabric");
    const contract = await contractFactory.deploy();
    await contract.deployed();

    const result = await benchmarker.benchmarkMethod(contract, "executeParallel", []);

    const outputPath = path.join(__dirname, "..", "benchmark-report.json");
    fs.writeFileSync(outputPath, JSON.stringify([result], null, 2));

    console.log("✅ Benchmark complete. Results saved to benchmark-report.json");
    console.table(result);
  });
