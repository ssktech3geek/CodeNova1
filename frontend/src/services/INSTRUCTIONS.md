# Frontend Services - Instructions

## Purpose
API service layer for communicating with backend, handling requests, responses, and errors.

## Service Architecture

### 1. API Client (`api/client.ts`)
- Axios instance with base configuration
- Request/response interceptors
- Auth token injection
- Error normalization
- Request cancellation
- Retry logic with exponential backoff

```typescript
// Configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
});

// Interceptors
apiClient.interceptors.request.use(addAuthToken);
apiClient.interceptors.response.use(
  response => response.data,
  error => normalizeError(error)
);
```

### 2. Domain Services

#### Auth Service (`auth/service.ts`)
- `login(credentials)` - Email/password login
- `register(data)` - User registration
- `logout()` - Clear tokens, call logout endpoint
- `refreshToken()` - Get new access token
- `forgotPassword(email)` - Reset request
- `resetPassword(token, password)` - Password reset
- `verifyEmail(token)` - Email verification
- `getMe()` - Current user profile
- `updateProfile(data)` - Profile update

#### Profile Service (`profile/service.ts`)
- `getPreferences()` - Traveler preferences
- `updatePreferences(prefs)` - Update preferences
- `extractPreferences(text)` - NLP extraction

#### Destination Service (`destination/service.ts`)
- `searchDestinations(filters)` - Destination search
- `getDestination(id)` - Destination details
- `searchHotels(destinationId, filters)` - Hotel search
- `searchExperiences(destinationId, filters)` - Experience search
- `searchRestaurants(destinationId, filters)` - Restaurant search
- `searchTransport(destinationId, filters)` - Transport search
- `searchGuides(destinationId, filters)` - Guide search
- `checkAvailability(serviceIds, dates)` - Bulk availability

#### Itinerary Service (`itinerary/service.ts`)
- `createItinerary(preferences)` - Generate itineraries
- `getItinerary(id)` - Full itinerary
- `getItineraryOptions(id)` - Alternative options
- `validateItinerary(id)` - Constraint validation
- `customizeItinerary(id, changes)` - Apply customizations
- `approveItinerary(id, role)` - Traveler/operator approval
- `getVersions(id)` - Version history
- `getVersion(id, version)` - Specific version
- `handleDisruption(id, event)` - Disruption handling

#### Pricing Service (`pricing/service.ts`)
- `calculatePricing(itinerary)` - Full pricing
- `estimateRefund(bookingId)` - Refund estimate
- `validateDiscount(code, itinerary)` - Discount validation

#### Booking Service (`booking/service.ts`)
- `createBooking(itineraryId)` - Create from itinerary
- `getBooking(id)` - Booking details
- `confirmBooking(id)` - Confirm booking
- `cancelBooking(id, reason)` - Cancel booking
- `requestChange(id, changes)` - Change request
- `getTravelerBookings(travelerId)` - Traveler's bookings
- `getOperatorBookings(operatorId)` - Operator's bookings
- `getVendorBookings(vendorId)` - Vendor's assigned bookings
- `vendorConfirm(id)` - Vendor confirmation
- `vendorReportDelay(id, details)` - Delay report
- `vendorReportCancellation(id, reason)` - Cancellation report

#### Vendor Service (`vendor/service.ts`)
- `getVendorProfile()` - Vendor profile
- `updateVendorProfile(data)` - Update profile
- `createService(data)` - Add service listing
- `updateService(id, data)` - Update service
- `getServices()` - List services
- `updateAvailability(data)` - Availability calendar
- `getAvailability(serviceId, dateRange)` - Get availability
- `createContract(data)` - Create contract
- `getContracts()` - List contracts
- `uploadInvoice(bookingId, file)` - Invoice upload
- `getInvoices()` - List invoices
- `getAssignedBookings()` - Vendor portal bookings
- `confirmService(bookingId)` - Confirm service
- `reportDelay(bookingId, details)` - Report delay
- `reportCancellation(bookingId, reason)` - Report cancellation
- `getPerformance()` - Performance metrics

#### Operations Service (`operations/service.ts`)
- `ingestEvent(event)` - Submit change event
- `getEvent(id)` - Event details
- `analyzeImpact(eventId)` - Trigger impact analysis
- `getImpactAnalysis(eventId)` - Get analysis
- `getControlTower(operatorId)` - Dashboard data
- `getAlerts(operatorId)` - Operational alerts
- `acknowledgeAlert(id)` - Acknowledge alert
- `handleDisruption(itineraryId, event)` - Full disruption flow
- `getOperationalStatus(itineraryId)` - Real-time status

#### Payment Service (`payment/service.ts`)
- `initiatePayment(data)` - Start payment
- `getPayment(id)` - Payment status
- `retryPayment(id)` - Retry failed
- `getBookingPayments(bookingId)` - Booking payments
- `initiateRefund(data)` - Start refund
- `getRefund(id)` - Refund status
- `getPaymentSchedule(bookingId)` - Schedule
- `sendReminder(scheduleId)` - Payment reminder
- `getVendorPayouts(vendorId)` - Vendor payouts
- `handleWebhook(payload)` - Gateway webhook

#### Notification Service (`notification/service.ts`)
- `sendNotification(data)` - Send notification
- `getNotifications(userId)` - User notifications
- `markAsRead(id)` - Mark read
- `getPreferences(userId)` - Notification preferences
- `updatePreferences(prefs)` - Update preferences
- `sendDisruptionNotification(data)` - Structured disruption alert

#### Review Service (`review/service.ts`)
- `submitReview(data)` - Create review
- `getReview(id)` - Review details
- `getServiceReviews(serviceId)` - Service reviews
- `getVendorReviews(vendorId)` - Vendor reviews
- `updateReview(id, data)` - Update review
- `deleteReview(id)` - Delete review
- `respondToReview(id, response)` - Vendor response
- `reportReview(id, reason)` - Report review
- `getAggregateRating(serviceId)` - Aggregate ratings

#### Analytics Service (`analytics/service.ts`)
- `getPlanningMetrics(filters)` - Planning metrics
- `getOperationsMetrics(filters)` - Operations metrics
- `getBusinessMetrics(filters)` - Business metrics
- `getExperienceMetrics(filters)` - Experience metrics
- `getDashboard(operatorId)` - Dashboard data
- `getVendorPerformance(vendorId)` - Vendor performance
- `getOperatorPerformance(operatorId)` - Operator performance
- `downloadReport(reportId)` - Download report

#### Travel Assistant Service (`assistant/service.ts`)
- `chat(message, context)` - Conversational interface
- `extractPreferences(text)` - Preference extraction
- `explainDecision(decisionId)` - Explanation
- `summarizeChanges(old, new)` - Change summary
- `translate(text, targetLang)` - Translation

### 3. Real-time Services

#### WebSocket Service (`realtime/websocket.ts`)
- Connection management
- Auto-reconnect with backoff
- Message routing by topic
- Subscription management
- Heartbeat/ping-pong

```typescript
// Topics
- `itinerary:{id}` - Itinerary updates
- `booking:{id}` - Booking status changes
- `disruption:{itineraryId}` - Disruption alerts
- `operator:{id}` - Operator notifications
- `vendor:{id}` - Vendor notifications
- `traveler:{id}` - Traveler notifications
```

#### Offline Service (`offline/service.ts`)
- IndexedDB for offline storage
- Queue mutations offline
- Sync on reconnect
- Conflict resolution

### 4. Service Guidelines
- **Single Responsibility**: One service per domain
- **TypeScript**: Full request/response types
- **Error Handling**: Throw typed errors, not raw axios errors
- **Caching**: Use React Query for caching, not service layer
- **Testing**: Mock with MSW (Mock Service Worker)
- **Environment**: Base URL from env variables

## Key Constraints
- Services are pure API clients - no React state
- All errors normalized to `AppError` type
- Request/response logging in development
- Rate limit handling with retry-after
- Cancel in-flight requests on unmount
- No direct localStorage access in services