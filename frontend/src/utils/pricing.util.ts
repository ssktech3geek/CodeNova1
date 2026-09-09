import { MarginBreakdown, PriceBreakdown } from '../types/itinerary.types';
import { AlternativeProposal } from '../types/disruption.types';

/**
 * Reconciles a disruption proposal against the established itinerary price.
 * The proposal's net delta is authoritative: it already accounts for the
 * cancelled kayaking escrow credit and the replacement booking.
 */
export function reconcileDisruptionPricing(
  pricing: PriceBreakdown,
  margins: MarginBreakdown,
  proposal: Pick<AlternativeProposal, 'costDelta' | 'newActivityCost' | 'refundFromCancelled'>,
  cancelledActivityCost = 2400,
): { pricing: PriceBreakdown; margins: MarginBreakdown } {
  const total = pricing.total + proposal.costDelta;

  return {
    pricing: {
      ...pricing,
      activities: pricing.activities - cancelledActivityCost + proposal.newActivityCost,
      total,
    },
    margins: {
      ...margins,
      customerPrice: total,
      refunds: proposal.refundFromCancelled,
    },
  };
}

export function calculateProposalTotal(
  pricing: PriceBreakdown,
  proposal: Pick<AlternativeProposal, 'costDelta' | 'newActivityCost' | 'refundFromCancelled'>,
): number {
  return reconcileDisruptionPricing(
    pricing,
    {
      customerPrice: pricing.total,
      supplierCost: 0,
      operationalCharges: 0,
      discounts: 0,
      refunds: 0,
      margin: 0,
      marginPercentage: 0,
    },
    proposal
  ).pricing.total;
}
