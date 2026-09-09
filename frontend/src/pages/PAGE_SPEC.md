/**
 * @file INSTRUCTIONS.md → src/pages/
 * @description Page file specifications for the Traveler, Operator, and Vendor application.
 *
 * TRAVELER PAGES:
 *
 * TripRequestPage.tsx
 *   - Large natural-language input field with placeholder "Describe your dream trip…"
 *   - Submit button triggers POST /api/v1/profiles/:id/preferences/extract
 *   - Display extracted structured preferences for review before proceeding.
 *
 * ItineraryOptionsPage.tsx
 *   - Show 3 itinerary plan cards (Budget / Comfort / Premium).
 *   - Each card: title, price, preference match %, key highlights, day count.
 *   - CTA: "View Details" → ItineraryDetailPage.
 *
 * ItineraryDetailPage.tsx
 *   - Day-by-day timeline of all itinerary items.
 *   - Show live disruption banners for active ChangeEvents.
 *   - Show price breakdown and margin summary (operator view only).
 *   - Customization controls (swap hotel, swap activity).
 *
 * ApprovalPage.tsx
 *   - List of pending ChangeProposals requiring the user's approval.
 *   - Show trade-off explanation per proposal.
 *   - Approve / Reject actions with confirmation modal.
 *
 * BookingsPage.tsx
 *   - List of all service bookings with status badges.
 *   - Digital voucher download per confirmed booking.
 *
 * ChatPage.tsx
 *   - Full-screen AI travel assistant chat interface.
 *   - Show current itinerary context in sidebar.
 *
 * OPERATOR PAGES:
 *
 * OperatorDashboardPage.tsx
 *   - ControlTower widget: active tours, at-risk, pending.
 *   - Quick action: handle disruption, approve proposal.
 *
 * VendorManagementPage.tsx
 *   - CRUD for vendor registry, contracts, and rates.
 *
 * VENDOR PAGES:
 *
 * VendorSchedulePage.tsx
 *   - Assigned bookings and service schedule for the day.
 *   - Mark service complete, report delay/cancellation.
 *
 * AUTH PAGES:
 * LoginPage.tsx, RegisterPage.tsx, ForgotPasswordPage.tsx
 */
