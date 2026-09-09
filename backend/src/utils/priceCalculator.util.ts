import { businessConfig } from '../config';
import {
  PricedItem,
  SupplierCost,
  PriceBreakdown,
  MarginResult,
  RefundResult,
  DeltaPrice,
  Booking,
  ChangeProposal,
} from '../types';

// ============================================
// Deterministic Price Calculator
// NO AI-generated prices — all values from DB
// ============================================

/**
 * Calculate the full customer-facing price breakdown from a list of priced items.
 */
export function calculateCustomerPrice(items: PricedItem[]): PriceBreakdown {
  const cfg = businessConfig.pricing;
  const precision = cfg.currencyPrecision;

  const lineItems = items.map((item) => ({
    id: item.id,
    title: item.title,
    customer_price: item.customer_price,
    supplier_cost: item.supplier_cost,
    quantity: item.quantity,
    subtotal: round(item.customer_price * item.quantity, precision),
  }));

  const subtotal = round(
    lineItems.reduce((sum, li) => sum + li.subtotal, 0),
    precision
  );

  const gst_amount = round((subtotal * cfg.gstPercentage) / 100, precision);
  const platform_fee_amount = round((subtotal * cfg.platformFeePercentage) / 100, precision);
  const total_discounts = 0; // Future: apply discount codes

  const total_customer_price = round(subtotal + gst_amount + platform_fee_amount - total_discounts, precision);

  const total_supplier_cost = round(
    items.reduce((sum, item) => sum + item.supplier_cost * item.quantity, 0),
    precision
  );

  const operator_margin = round(total_customer_price - total_supplier_cost - gst_amount - platform_fee_amount, precision);
  const operator_margin_percentage = total_customer_price > 0
    ? round((operator_margin / total_customer_price) * 100, precision)
    : 0;

  return {
    subtotal,
    gst_amount,
    platform_fee_amount,
    total_discounts,
    total_customer_price,
    total_supplier_cost,
    operator_margin,
    operator_margin_percentage,
    line_items: lineItems,
  };
}

/**
 * Calculate operator margin and whether it's below the floor threshold.
 */
export function calculateOperatorMargin(
  customerPrice: number,
  supplierCosts: SupplierCost[]
): MarginResult {
  const cfg = businessConfig.pricing;

  const totalSupplierCost = supplierCosts.reduce((sum, c) => sum + c.amount, 0);
  const gst = (customerPrice * cfg.gstPercentage) / 100;
  const platformFee = (customerPrice * cfg.platformFeePercentage) / 100;

  const margin = round(customerPrice - totalSupplierCost - gst - platformFee, cfg.currencyPrecision);
  const margin_percentage = customerPrice > 0
    ? round((margin / customerPrice) * 100, cfg.currencyPrecision)
    : 0;

  const is_below_floor = margin_percentage < cfg.minOperatorMarginPercentage;
  const requires_admin_approval = is_below_floor;

  return { margin, margin_percentage, is_below_floor, requires_admin_approval };
}

/**
 * Calculate refund amount based on cancellation policy tiers.
 */
export function calculateRefundAmount(
  booking: Booking,
  cancelledAt: Date
): RefundResult {
  const hoursBeforeService =
    (booking.scheduled_start.getTime() - cancelledAt.getTime()) / (1000 * 60 * 60);

  // Fetch cancellation policy — here we apply sensible default tiers
  // Real implementation should load vendor's CancellationPolicy from DB
  const defaultTiers = [
    { hoursBeforeService: 48, refundPercentage: 100 },
    { hoursBeforeService: 24, refundPercentage: 50 },
    { hoursBeforeService: 0, refundPercentage: 0 },
  ];

  let refundPercentage = 0;
  for (const tier of defaultTiers) {
    if (hoursBeforeService >= tier.hoursBeforeService) {
      refundPercentage = tier.refundPercentage;
      break;
    }
  }

  const refund_amount = round((booking.total_price * refundPercentage) / 100, businessConfig.pricing.currencyPrecision);
  const is_full_refund = refundPercentage === 100;
  const reason = is_full_refund
    ? 'Full refund: cancelled more than 48 hours in advance.'
    : refundPercentage > 0
    ? `Partial refund (${refundPercentage}%): cancelled within cancellation window.`
    : 'No refund: cancelled too close to service start time.';

  return { refund_amount, refund_percentage: refundPercentage, reason, is_full_refund };
}

/**
 * Compute cost delta and new margin after a change proposal.
 */
export function recalculatePriceAfterChange(
  originalPrice: number,
  originalMargin: number,
  originalMarginPct: number,
  proposal: Pick<ChangeProposal, 'cost_delta'>
): DeltaPrice {
  const cfg = businessConfig.pricing;
  const new_price = round(originalPrice + proposal.cost_delta, cfg.currencyPrecision);
  const delta = proposal.cost_delta;
  const delta_percentage = originalPrice > 0
    ? round((delta / originalPrice) * 100, cfg.currencyPrecision)
    : 0;

  // New margin is adjusted by cost delta (positive delta = more cost = less margin)
  const new_margin = round(originalMargin - delta, cfg.currencyPrecision);
  const new_margin_percentage = new_price > 0
    ? round((new_margin / new_price) * 100, cfg.currencyPrecision)
    : originalMarginPct;

  return {
    original_price: originalPrice,
    new_price,
    delta,
    delta_percentage,
    new_margin,
    new_margin_percentage,
  };
}

// ============================================
// Helpers
// ============================================
function round(value: number, decimals: number): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}
