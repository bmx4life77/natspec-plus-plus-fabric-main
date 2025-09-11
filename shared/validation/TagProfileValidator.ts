import type { TagSet } from "./TagSet";

export interface ValidationResult {
  missing: string[];
  conflicts: string[];
  warnings: string[];
  isValid: boolean;
}

export class TagProfileValidator {
  private profiles: Record<string, string[]> = {
    PARALLEL: ['parallel', 'threadSafe', 'maxConcurrency', 'gasOptimized'],
    GOVERNANCE: ['sequential', 'atomic', 'quorum', 'proposal'],
    MIGRATION: ['shardMigration', 'crossShard', 'lockRequired', 'deadline'],
    SECURITY: ['authRequired', 'roleGuard', 'reentrancySafe', 'auditTrail'],
  };

  validateProfile(profileName: string, tags: TagSet): ValidationResult {
    const result: ValidationResult = {
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

    if (tags.parallel?.value && tags.sequential?.value) {
      result.conflicts.push('parallel vs sequential');
      result.isValid = false;
    }

    return result;
  }

  listProfiles(): string[] {
    return Object.keys(this.profiles);
  }

  getProfileTags(profileName: string): string[] {
    return this.profiles[profileName] || [];
  }

  inferTagsFromEpoch(epoch: {
    method: string;
    gasUsed: number;
  }): TagSet {
    const inferred: TagSet = {};

    if (epoch.method.includes("Parallel")) {
      inferred.parallel = { value: true };
      inferred.threadSafe = { value: true };
      inferred.maxConcurrency = { value: "dynamic" };
    }

    if (epoch.method.includes("Sync")) {
      inferred.crossShard = { value: true };
      inferred.shardMigration = { value: false };
    }

    inferred.gasOptimized = {
      value: epoch.gasUsed <= 100000,
    };

    return inferred;
  }
}
