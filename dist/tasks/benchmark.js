"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("hardhat/config");
const NatSpecBenchmarker_1 = require("../tools/benchmarking/NatSpecBenchmarker");
// tasks/benchmark.ts
(0, config_1.task)("natspec:benchmark", "Benchmarks tagged contract methods")
    .setAction(async (_, hre) => {
    const benchmarker = new NatSpecBenchmarker_1.NatSpecBenchmarker();
    const contractFactory = await hre.ethers.getContractFactory("ParallelExecutionFabric");
    const contract = await contractFactory.deploy();
    await contract.deployed();
    const result = await benchmarker.benchmarkMethod(contract, "executeParallel", []);
    console.table(result);
});
