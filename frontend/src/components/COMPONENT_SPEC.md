/**
 * @file INSTRUCTIONS.md → src/components/
 * @description Component architecture instructions already exist in INSTRUCTIONS.md.
 * This file supplements with specific component file specifications.
 *
 * COMPONENT FILES TO CREATE:
 *
 * ── common/
 *    Button.tsx        - Primary, secondary, danger variants; loading state; disabled state.
 *    Input.tsx         - Text, number, select, textarea; validation error display.
 *    Modal.tsx         - Overlay modal with backdrop; ESC key close; focus trap.
 *    Badge.tsx         - Status badges for booking/itinerary status values.
 *    Toast.tsx         - Success/error/info toast notifications.
 *    LoadingSpinner.tsx - Centered loading indicator.
 *    PriceTag.tsx      - Formats and displays INR prices with breakdown tooltip.
 *    Timeline.tsx      - Vertical timeline for itinerary day view.
 *
 * ── itinerary/
 *    ItineraryCard.tsx     - Summary card for itinerary plan option (cost, match %, status).
 *    ItineraryItem.tsx     - Individual day-item row with time, title, vendor, price.
 *    DependencyBadge.tsx   - Visual indicator showing dependency links between items.
 *    DisruptionBanner.tsx  - Red alert banner for active disruptions in itinerary.
 *    VersionHistory.tsx    - List of previous itinerary versions with change summaries.
 *
 * ── disruption/
 *    DisruptionAlert.tsx   - Full disruption event card with reason and affected items.
 *    AlternativeCard.tsx   - Proposal card: title, cost delta, preference match, approval badge.
 *    TradeoffExplainer.tsx - Expandable structured explanation panel per alternative.
 *    ApprovalPanel.tsx     - Action panel: approve / reject buttons per required role.
 *
 * ── operator/
 *    ControlTower.tsx      - Dashboard grid: active tours, at-risk tours, pending approvals.
 *    MarginDisplay.tsx     - Displays customer price / supplier cost / margin breakdown.
 *    VendorConfirmCard.tsx - Vendor confirmation status for each booking.
 *
 * ── chat/
 *    ChatWindow.tsx        - AI travel assistant chat UI with message history.
 *    MessageBubble.tsx     - Single message bubble (user vs assistant style).
 */
