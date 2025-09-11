import { ethers } from "hardhat";
import chalk from "chalk";
import { performance } from "perf_hooks";

async function main() {
  const signer = await ethers.getSigner();
  const fabric = await ethers.getContract("ParallelExecutionFabric");

  // Define a semantic ProtocolScript
  const protocolScript = ["mint", "delegate", "vote"];

  // Semantic mapping (normally resolved by ProtocolScriptInterpreter)
  const semanticMap = {
    mint: {
      facet: "ERC20Facet",
      selector: "mint(address,uint256)",
      args: ["0xRecipientAddress", ethers.utils.parseEther("100")]
    },
    delegate: {
      facet: "GovernanceFacet",
      selector: "delegate(address)",
      args: ["0xDelegateAddress"]
    },
    vote: {
      facet: "GovernanceFacet",
      selector: "castVote(uint256,uint8)",
      args: [1, 1]
    }
  };

  const executionPayload = protocolScript.map(step => semanticMap[step]);

  console.log(chalk.blueBright("🔍 Starting ProtocolScript Execution Trace..."));
  const start = performance.now();

  try {
    const tx = await fabric.executeParallel(executionPayload);
    const receipt = await tx.wait();

    const end = performance.now();
    console.log(chalk.green("✅ Execution successful"));
    console.log(chalk.yellow(`⛽ Gas used: ${receipt.gasUsed.toString()}`));
    console.log(chalk.yellow(`⏱️ Execution time: ${(end - start).toFixed(2)}ms`));

    console.log(chalk.magenta("\n📊 Semantic Trace:"));
    protocolScript.forEach((step, index) => {
      const { facet, selector } = semanticMap[step];
      console.log(chalk.cyan(`  ${index + 1}. ${step} → ${facet}.${selector}`));
    });
  } catch (error: any) {
    console.log(chalk.red("❌ Execution failed"));
    console.log(chalk.redBright(`Error: ${error.message}`));

    console.log(chalk.magenta("\n📊 Partial Semantic Trace:"));
    protocolScript.forEach((step, index) => {
      const { facet, selector } = semanticMap[step];
      console.log(chalk.gray(`  ${index + 1}. ${step} → ${facet}.${selector}`));
    });
  }
}

main().catch(err => {
  console.error(chalk.red("Unhandled error:"), err);
});
