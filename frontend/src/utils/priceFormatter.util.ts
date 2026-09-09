/**
 * @file priceFormatter.util.ts
 * @module frontend/src/utils
 * @description Instructions for Frontend Price Formatting Utility.
 *
 * FUNCTIONS TO IMPLEMENT (no code):
 *
 * 1. formatINR(amount: number): string
 *    - Format number as Indian Rupee: e.g. 45000 → "₹45,000"
 *    - Use Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).
 *
 * 2. formatPriceDelta(delta: number): string
 *    - Positive: "+₹700 (additional cost)"
 *    - Negative: "-₹500 (refund)"
 *    - Zero: "No additional cost"
 *
 * 3. formatMarginPercentage(margin: number, total: number): string
 *    - Returns percentage string: "15.3% margin"
 */
