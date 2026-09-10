import type { EvidenceResolver } from "../../core/types.js";
import type { GroundingIssue, PageClaims } from "./types.js";
import { ClaimsStore } from "./store.js";
/**
 * Complete deterministic Claims preflight used by repository planning.
 */
export interface ClaimsPreflightResult {
    /**
     * Complete deterministic grounding issues found during preflight.
     */
    issues: GroundingIssue[];
    /**
     * Persisted Claims sidecars keyed by canonical page path.
     */
    persisted: Map<string, PageClaims>;
    /**
     * Canonical Claims sidecars whose generated pages no longer exist.
     */
    orphanPages: string[];
}
/**
 * Runs global claim freshness checks without creating mandatory agent work.
 *
 * Each evidence resource and prior version resolves once per preflight.
 * Resolution errors propagate so they cannot be mistaken for deleted evidence.
 *
 * @param store - Repository claim persistence.
 * @param resolver - Repository evidence resolver.
 * @returns Persisted state, orphan inventory, and stable-order issues.
 */
export declare function runClaimsPreflight(store: ClaimsStore, resolver: EvidenceResolver): Promise<ClaimsPreflightResult>;
