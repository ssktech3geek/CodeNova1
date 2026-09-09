/**
 * @file useDisruption.hook.ts
 * @module frontend/src/hooks
 * @description Instructions for Real-Time Disruption Monitoring Custom Hook.
 *
 * PURPOSE:
 * Subscribe to live disruption events and manage the approval workflow from the frontend.
 *
 * STATE:
 * - disruptions: ChangeEvent[]
 * - proposals: ChangeProposal[]
 * - isConnected: boolean (WebSocket/SSE connection status)
 *
 * FUNCTIONS:
 * - connect(itineraryId: string): void
 *   → Open SSE or WebSocket connection to /api/v1/events/stream?itinerary_id={id}
 *   → On event: update disruptions state, show Toast notification.
 * - disconnect(): void
 * - approveProposal(proposalId: string): Promise<void>
 * - rejectProposal(proposalId: string): Promise<void>
 * - getProposalsForEvent(eventId: string): ChangeProposal[]
 *
 * KEY CONSTRAINTS:
 * - Reconnect automatically on connection drop (exponential backoff).
 * - Disruption Toast must be shown to traveler immediately on event arrival.
 * - High-impact proposals must display a prominent warning before approve action.
 */
