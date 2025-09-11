import { ethers } from "hardhat";
import { performance } from "perf_hooks";

async function main() {
  const signer = await ethers.getSigner();
  const fabric = await ethers.getContract("ParallelExecutionFabric");

  // Define a semantic ProtocolScript
  const protocolScript = ["mint", "delegate", "vote"];

  // Simulate interpreter mapping
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
      args: [1, 1] // proposalId, support
    }
  };

  const executionPayload = protocolScript.map(step => semanticMap[step]);

  const start = performance.now();

  const tx = await fabric.executeParallel(executionPayload);
  const receipt = await tx.wait();

  const end = performance.now();

  console.log("✅ ProtocolScript executed");
  console.log(`⛽ Gas used: ${receipt.gasUsed.toString()}`);
  console.log(`⏱️ Execution time: ${(end - start).toFixed(2)}ms`);

  console.log("📊 Semantic Trace:");
  protocolScript.forEach((step, index) => {
    const { facet, selector } = semanticMap[step];
    console.log(`  ${index + 1}. ${step} → ${facet}.${selector}`);
  });
}

main().catch(console.error);
