import { Contract } from 'ethers';
import { performance } from 'perf_hooks';
import { ProtocolScriptInterpreter } from '../../src/interpreter/ProtocolScriptInterpreter';
import type { TagSet } from '../../shared/validation/TagProfileValidator';


export interface BenchmarkResult {
  contract: string;
  method: string;
  tags: TagSet;
  gasEstimate: number;
  executionTimeMs: number;
  success: boolean;
  error?: string;
}

export class NatSpecBenchmarker {
  private interpreter = new ProtocolScriptInterpreter();

  async benchmarkMethod(contract: Contract, method: string, args: any[]): Promise<BenchmarkResult> {
    const start = performance.now();
    let success = true;
    let error: string | undefined;

    try {
      await this.interpreter.executeWithTags(contract, method, args);
    } catch (e: any) {
      success = false;
      error = e.message;
    }

    const tags = this.interpreter.getTagsForMethod(contract, method);
    const gasEstimate = this.estimateGas(tags);
    const inferredTags = validator.inferTagsFromEpoch({ method, gasUsed: gasEstimate });

    return {
  contract: String(contract.address),
  method,
  tags: inferredTags, // or merged
  gasEstimate,
  executionTimeMs: Math.round(end - start),
  success,
  error,
};

  }

  private estimateGas(tags: TagSet): number {
    // Reuse your gas estimation logic
    let base = 200_000;
    if (tags.parallel?.value) base *= 1.2;
    if (tags.gasIntensive?.value) base *= 2;
    if (tags.gasOptimized?.value) base *= 0.7;
    if (tags.crossShard?.value) base *= 1.5;
    return Math.floor(base);
  }
}
