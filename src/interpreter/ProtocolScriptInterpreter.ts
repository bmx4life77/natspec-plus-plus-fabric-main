import { Contract } from "ethers";
import type { TagProfileValidator } from "../../shared/validation/TagProfileValidator";
import type { TagSet } from "../../shared/validation/TagProfileValidator";

import { estimateGas } from "../gas/GasEstimator";
import { FabricAdapter } from "./FabricAdapter";

export class ProtocolScriptInterpreter {
  private validator = new TagProfileValidator();

  async executeWithTags(contract: Contract, method: string, args: any[]) {
    const tags: TagSet = this.getTagsForMethod(contract, method);

    const validation = this.validator.validateProfile('PARALLEL', tags);
    if (!validation.isValid) {
      console.warn(`⚠️ Tag validation failed for ${method}:`);
      validation.missing.forEach(tag => console.warn(`- Missing: @${tag}`));
      validation.conflicts.forEach(conflict => console.warn(`- Conflict: ${conflict}`));
      return;
    }

    const gasEstimate = estimateGas(tags);
    console.log(`⛽ Estimated gas for ${method}: ${gasEstimate}`);

    const adapter = new FabricAdapter(contract);
    return await adapter.execute(method, args, tags);
  }

  getTagsForMethod(contract: Contract, method: string): TagSet {
  // Simulate an epoch snapshot for inference
  const epoch = {
    method,
    gasUsed: 100000 // You can replace this with actual gas usage if available
  };

  return this.validator.inferTagsFromEpoch(epoch);
}

  }

