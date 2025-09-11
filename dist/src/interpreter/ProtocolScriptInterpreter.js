"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolScriptInterpreter = void 0;
const TagProfileValidator_1 = require("../validation/TagProfileValidator");
const GasEstimator_1 = require("../gas/GasEstimator");
const FabricAdapter_1 = require("./FabricAdapter");
class ProtocolScriptInterpreter {
    constructor() {
        this.validator = new TagProfileValidator_1.TagProfileValidator();
    }
    async executeWithTags(contract, method, args) {
        const tags = this.getTagsForMethod(contract, method);
        const validation = this.validator.validateProfile('PARALLEL', tags);
        if (!validation.isValid) {
            console.warn(`⚠️ Tag validation failed for ${method}:`);
            validation.missing.forEach(tag => console.warn(`- Missing: @${tag}`));
            validation.conflicts.forEach(conflict => console.warn(`- Conflict: ${conflict}`));
            return;
        }
        const gasEstimate = (0, GasEstimator_1.estimateGas)(tags);
        console.log(`⛽ Estimated gas for ${method}: ${gasEstimate}`);
        const adapter = new FabricAdapter_1.FabricAdapter(contract);
        return await adapter.execute(method, args, tags);
    }
    getTagsForMethod(contract, method) {
        // Placeholder: Replace with actual tag extraction from artifacts
        return {
            parallel: { value: true },
            threadSafe: { value: true },
            maxConcurrency: { value: 8 },
            gasOptimized: { value: true },
        };
    }
}
exports.ProtocolScriptInterpreter = ProtocolScriptInterpreter;
