/**
 * @file approvalRouter.util.ts
 * @module backend/utils
 * @description Instructions for Approval Routing Logic Utility.
 *
 * PURPOSE:
 * Determine which stakeholders must approve a proposed change before the system commits it.
 * Implements Brain Section 15 (Approval Brain) and PRD Section 14 (Approval Rules).
 *
 * FUNCTIONS TO IMPLEMENT (no code here):
 *
 * 1. determineApprovalRequired(changeProposal: ChangeProposal, itinerary: Itinerary): ApprovalRoute
 *    - LOW impact (preference-neutral, no cost change): → TRAVELER only.
 *    - MEDIUM impact (cost delta ≠ 0 or schedule shift > 30 min): → TRAVELER + OPERATOR.
 *    - HIGH impact (margin change > threshold, multi-day ripple, or vendor contract change): → TRAVELER + OPERATOR + ADMIN.
 *    - Return ApprovalRoute: { required: Role[], reason: string }.
 *
 * 2. isApprovalComplete(changeProposal: ChangeProposal): boolean
 *    - Check that all required approvers have approved.
 *    - Return true only when all required roles have signed off.
 *
 * 3. canAutoApprove(changeProposal: ChangeProposal): boolean
 *    - Returns true ONLY for trivially low-impact, zero-cost changes with TRAVELER-only approval.
 *    - HIGH-impact changes must NEVER return true.
 *
 * KEY CONSTRAINTS:
 * - Approval thresholds must be configurable, not hard-coded.
 * - All approval decisions must be logged in AuditLog.
 * - High-impact changes MUST require human approval (PRD Section 14 & Brain Section 15).
 */
