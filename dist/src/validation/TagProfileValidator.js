"use strict";
// src/validation/TagProfileValidator.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagProfileValidator = void 0;
class TagProfileValidator {
    constructor() {
        this.profiles = {
            PARALLEL: ['parallel', 'threadSafe', 'maxConcurrency', 'gasOptimized'],
            GOVERNANCE: ['sequential', 'atomic', 'quorum', 'proposal'],
            MIGRATION: ['shardMigration', 'crossShard', 'lockRequired', 'deadline'],
            SECURITY: ['authRequired', 'roleGuard', 'reentrancySafe', 'auditTrail'],
        };
    }
    validateProfile(profileName, tags) {
        const result = {
            missing: [],
            conflicts: [],
            warnings: [],
            isValid: true,
        };
        const profile = this.profiles[profileName];
        if (!profile) {
            result.warnings.push(`Unknown profile: ${profileName}`);
            result.isValid = false;
            return result;
        }
        for (const tag of profile) {
            if (!tags[tag]) {
                result.missing.push(tag);
                result.isValid = false;
            }
        }
        // Conflict detection (e.g., parallel vs sequential)
        if (tags.parallel?.value && tags.sequential?.value) {
            result.conflicts.push('parallel vs sequential');
            result.isValid = false;
        }
        return result;
    }
    listProfiles() {
        return Object.keys(this.profiles);
    }
    getProfileTags(profileName) {
        return this.profiles[profileName] || [];
    }
}
exports.TagProfileValidator = TagProfileValidator;
