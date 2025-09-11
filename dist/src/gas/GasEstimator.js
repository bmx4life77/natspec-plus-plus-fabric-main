"use strict";
// src/gas/GasEstimator.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.estimateGas = estimateGas;
function estimateGas(tags) {
    let base = 200000;
    if (tags.parallel?.value)
        base *= 1.2;
    if (tags.gasIntensive?.value)
        base *= 2;
    if (tags.gasOptimized?.value)
        base *= 0.7;
    if (tags.crossShard?.value)
        base *= 1.5;
    if (tags.atomic?.value)
        base *= 1.3;
    return Math.floor(base);
}
