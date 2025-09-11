"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NatSpecBenchmarker = void 0;
const perf_hooks_1 = require("perf_hooks");
const ProtocolScriptInterpreter_1 = require("../../src/interpreter/ProtocolScriptInterpreter");
class NatSpecBenchmarker {
    constructor() {
        this.interpreter = new ProtocolScriptInterpreter_1.ProtocolScriptInterpreter();
    }
    async benchmarkMethod(contract, method, args) {
        const start = perf_hooks_1.performance.now();
        let success = true;
        let error;
        try {
            await this.interpreter.executeWithTags(contract, method, args);
        }
        catch (e) {
            success = false;
            error = e.message;
        }
        const end = perf_hooks_1.performance.now();
        const tags = this.interpreter.getTagsForMethod(contract, method);
        const gasEstimate = this.estimateGas(tags);
        return {
            contract: String(contract.address),
            method,
            tags,
            gasEstimate,
            executionTimeMs: Math.round(end - start),
            success,
            error,
        };
    }
    estimateGas(tags) {
        // Reuse your gas estimation logic
        let base = 200000;
        if (tags.parallel?.value)
            base *= 1.2;
        if (tags.gasIntensive?.value)
            base *= 2;
        if (tags.gasOptimized?.value)
            base *= 0.7;
        if (tags.crossShard?.value)
            base *= 1.5;
        return Math.floor(base);
    }
}
exports.NatSpecBenchmarker = NatSpecBenchmarker;
