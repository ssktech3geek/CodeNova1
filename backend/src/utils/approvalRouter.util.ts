import { ChangeProposal, ImpactLevel } from '../types';
import { businessConfig } from '../config';

// ============================================
// Approval Router Utility
// Impact-Based Approval Matrix Enforcement
// ============================================

export interface ApprovalRequirement {
  impact_level: ImpactLevel;
  required_approvers: Array<'TRAVELER' | 'OPERATOR' | 'ADMIN'>;
  can_auto_approve: boolean;
  reason: string;
}

/**
 * Evaluate a ChangeProposal and determine who must approve it.
 *
 * Approval Matrix (from PROJECT_KNOWLEDGE_BASE.md Section 10):
 * - LOW:    cost_delta = 0, shift < 30m, same preference tier  → TRAVELER only, can auto-approve
 * - MEDIUM: cost_delta ≠ 0, shift 30–60m, vendor swap          → TRAVELER + OPERATOR
 * - HIGH:   margin drop > 5%, shift > 60m, multi-day ripple    → TRAVELER + OPERATOR + ADMIN (no auto-approve)
 */
export function routeApproval(
  proposal: Pick<ChangeProposal, 'cost_delta' | 'travel_delta_minutes' | 'preference_match'>,
  originalMarginPercentage: number,
  newMarginPercentage: number,
  impactedItemCount: number
): ApprovalRequirement {
  const cfg = businessConfig.approval;

  const marginDrop = originalMarginPercentage - newMarginPercentage;
  const costDelta = Math.abs(proposal.cost_delta);
  const travelDelta = Math.abs(proposal.travel_delta_minutes);
  const isMultiDayRipple = impactedItemCount > 3;

  // HIGH impact: any of these conditions
  if (
    marginDrop > cfg.highImpactMarginDropPercentage ||
    travelDelta > cfg.mediumImpactScheduleShiftMinutes ||
    isMultiDayRipple
  ) {
    return {
      impact_level: 'HIGH',
      required_approvers: ['TRAVELER', 'OPERATOR', 'ADMIN'],
      can_auto_approve: false, // STRICTLY FORBIDDEN per spec
      reason: buildHighImpactReason(marginDrop, travelDelta, isMultiDayRipple, cfg),
    };
  }

  // MEDIUM impact
  if (
    costDelta > 0 ||
    travelDelta >= cfg.lowImpactScheduleShiftMinutes
  ) {
    return {
      impact_level: 'MEDIUM',
      required_approvers: ['TRAVELER', 'OPERATOR'],
      can_auto_approve: false,
      reason: buildMediumImpactReason(costDelta, travelDelta),
    };
  }

  // LOW impact
  return {
    impact_level: 'LOW',
    required_approvers: ['TRAVELER'],
    can_auto_approve: true,
    reason: 'Low impact: no cost change, minimal schedule shift, same preference tier.',
  };
}

/**
 * Check if a proposal has received all required approvals.
 */
export function hasAllApprovals(
  requirement: ApprovalRequirement,
  receivedApprovals: Array<'TRAVELER' | 'OPERATOR' | 'ADMIN'>
): boolean {
  return requirement.required_approvers.every((r) => receivedApprovals.includes(r));
}

/**
 * Get the next pending approver for a proposal.
 */
export function getNextPendingApprover(
  requirement: ApprovalRequirement,
  receivedApprovals: Array<'TRAVELER' | 'OPERATOR' | 'ADMIN'>
): 'TRAVELER' | 'OPERATOR' | 'ADMIN' | null {
  const order: Array<'TRAVELER' | 'OPERATOR' | 'ADMIN'> = ['TRAVELER', 'OPERATOR', 'ADMIN'];
  for (const approver of order) {
    if (
      requirement.required_approvers.includes(approver) &&
      !receivedApprovals.includes(approver)
    ) {
      return approver;
    }
  }
  return null;
}

// ============================================
// Internal Helpers
// ============================================
function buildHighImpactReason(
  marginDrop: number,
  travelDelta: number,
  isMultiDayRipple: boolean,
  cfg: typeof businessConfig.approval
): string {
  const reasons: string[] = [];
  if (marginDrop > cfg.highImpactMarginDropPercentage) {
    reasons.push(`operator margin drops by ${marginDrop.toFixed(1)}% (threshold: ${cfg.highImpactMarginDropPercentage}%)`);
  }
  if (travelDelta > cfg.mediumImpactScheduleShiftMinutes) {
    reasons.push(`schedule shift of ${travelDelta} min (threshold: ${cfg.mediumImpactScheduleShiftMinutes} min)`);
  }
  if (isMultiDayRipple) {
    reasons.push('multi-day cascading disruption');
  }
  return `High impact: ${reasons.join('; ')}. Requires TRAVELER + OPERATOR + ADMIN approval. Auto-approval is strictly forbidden.`;
}

function buildMediumImpactReason(costDelta: number, travelDelta: number): string {
  const reasons: string[] = [];
  if (costDelta > 0) reasons.push(`cost change of ₹${costDelta.toFixed(2)}`);
  if (travelDelta > 0) reasons.push(`schedule shift of ${travelDelta} min`);
  return `Medium impact: ${reasons.join(', ')}. Requires TRAVELER + OPERATOR approval.`;
}
