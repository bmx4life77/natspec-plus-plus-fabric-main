import { task } from "hardhat/config";
import fs from "fs";
import path from "path";

task("natspec:benchmark", "Benchmarks a contract method")
  .addOptionalParam("contract", "Contract name")
  .addOptionalParam("method", "Method name")
  .setAction(async ({ contract, method }, hre) => {
    const contractName = contract || "ParallelExecutionFabric";
    const methodName = method || "executeParallel";

    const [deployer] = await hre.ethers.getSigners();
    const factory = await hre.ethers.getContractFactory(contractName);
    const instance = await factory.deploy();
    await instance.deployed();

    console.log(`✅ Deployed ${contractName} at ${instance.address}`);

    const dummyTransactions = [
      hre.ethers.utils.defaultAbiCoder.encode(
        ["address", "bytes"],
        [deployer.address, "0x"]
      )
    ];

    const tx = await instance[methodName](dummyTransactions, 1);
    const receipt = await tx.wait();

    console.log(`📊 Gas used: ${receipt.gasUsed.toString()}`);
    console.log(`🧪 Benchmark complete for ${contractName}.${methodName}`);

    // 🔽 Generate epoch filename
    const timestamp = Date.now();
    const epochId = `epoch-${timestamp}`;
    const filename = path.join("benchmarks", `${epochId}.json`);

    const report = {
      epoch: epochId,
      contract: contractName,
      method: methodName,
      gasUsed: receipt.gasUsed.toString(),
      timestamp
    };

    fs.writeFileSync(filename, JSON.stringify(report, null, 2));
    console.log(`📁 Saved benchmark to ${filename}`);
  });
