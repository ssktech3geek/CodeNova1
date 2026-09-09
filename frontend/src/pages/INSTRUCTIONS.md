# Frontend Pages - Instructions

## Purpose
Page-level components that compose features for each user type (Traveler, Operator, Vendor).

## Page Structure

### 1. Public/Authentication Pages (`auth/`)
- **LandingPage** - Marketing landing page
- **LoginPage** - Email/password, social login, MFA
- **RegisterPage** - Multi-step registration (role selection)
- **ForgotPasswordPage** - Password reset flow
- **VerifyEmailPage** - Email verification
- **OnboardingPage** - Role-specific onboarding

### 2. Traveler Pages (`traveler/`)
- **DashboardPage** - Upcoming trips, past trips, recommendations
- **TripPlannerPage** - Conversational trip planning
  - Step 1: Natural language input
  - Step 2: Preference confirmation
  - Step 3: Itinerary options
  - Step 4: Customization
  - Step 5: Approval & booking
- **ItineraryOptionsPage** - Compare multiple alternatives
- **ItineraryDetailPage** - Full itinerary view
  - Timeline view
  - Map view
  - Cost breakdown
  - Documents/vouchers
- **BookingPage** - Payment and confirmation
- **MyTripsPage** - List of booked trips
- **LiveTripPage** - Real-time trip during travel
  - Current activity
  - Next activity with countdown
  - Map with location
  - Disruption alerts
  - Emergency contacts
- **TripHistoryPage** - Past trips with reviews
- **ProfilePage** - Traveler profile management
- **PreferencesPage** - Travel preferences management
- **WalletPage** - Payment methods, credits, refunds
- **NotificationsPage** - Notification center
- **SupportPage** - Help center, chat support
- **SettingsPage** - App settings, privacy, notifications

### 3. Operator Pages (`operator/`)
- **ControlTowerPage** - Main dashboard
  - Active tours summary
  - At-risk tours
  - Pending actions
  - Key metrics
- **TourListPage** - All tours with filters
- **TourDetailPage** - Single tour management
  - Itinerary view/edit
  - Booking status
  - Vendor coordination
  - Margin tracking
  - Traveler communication
- **LeadManagementPage** - Inquiries and quotes
- **QuoteBuilderPage** - Create and send quotes
- **CustomerCRMPage** - Traveler database
- **VendorManagementPage** - Vendor directory
- **VendorDetailPage** - Vendor profile, performance, contracts
- **BookingOperationsPage** - Booking lifecycle management
- **DisruptionCenterPage** - Active disruptions queue
- **ApprovalQueuePage** - Pending approvals
- **FinancialDashboardPage** - Revenue, margins, payouts
- **AnalyticsPage** - Reports and charts
- **GroupToursPage** - Group tour management
- **CoordinatorPage** - Coordinator assignments
- **SettingsPage** - Operator settings

### 4. Vendor Pages (`vendor/`)
- **DashboardPage** - Assigned services summary
- **ServiceListPage** - Manage service listings
- **ServiceEditorPage** - Create/edit service
- **AvailabilityCalendarPage** - Visual calendar editor
- **BookingsPage** - Assigned bookings
- **BookingDetailPage** - Confirm, report delay/cancellation
- **InvoicesPage** - Upload and track invoices
- **MessagesPage** - Operator communication
- **PerformancePage** - Metrics and ratings
- **PayoutsPage** - Payment history
- **ProfilePage** - Vendor profile
- **SettingsPage** - Vendor settings

### 5. Admin Pages (`admin/`)
- **DashboardPage** - Platform overview
- **UserManagementPage** - All users
- **OperatorManagementPage** - Operator approvals
- **VendorManagementPage** - Vendor approvals
- **AnalyticsPage** - Platform metrics
- **SettingsPage** - Platform configuration

## Routing Structure
```
/                           → LandingPage
/login                      → LoginPage
/register                   → RegisterPage
/forgot-password            → ForgotPasswordPage
/verify-email               → VerifyEmailPage

/traveler
  /dashboard                → DashboardPage
  /plan                     → TripPlannerPage
  /itineraries/:id          → ItineraryDetailPage
  /itineraries/:id/options  → ItineraryOptionsPage
  /booking/:id              → BookingPage
  /trips                    → MyTripsPage
  /trips/:id/live           → LiveTripPage
  /history                  → TripHistoryPage
  /profile                  → ProfilePage
  /preferences              → PreferencesPage
  /wallet                   → WalletPage
  /notifications            → NotificationsPage
  /support                  → SupportPage
  /settings                 → SettingsPage

/operator
  /control-tower            → ControlTowerPage
  /tours                    → TourListPage
  /tours/:id                → TourDetailPage
  /leads                    → LeadManagementPage
  /quotes/:id               → QuoteBuilderPage
  /customers                → CustomerCRMPage
  /vendors                  → VendorManagementPage
  /vendors/:id              → VendorDetailPage
  /bookings                 → BookingOperationsPage
  /disruptions              → DisruptionCenterPage
  /approvals                → ApprovalQueuePage
  /finance                  → FinancialDashboardPage
  /analytics                → AnalyticsPage
  /groups                   → GroupToursPage
  /coordinators             → CoordinatorPage
  /settings                 → SettingsPage

/vendor
  /dashboard                → DashboardPage
  /services                 → ServiceListPage
  /services/new             → ServiceEditorPage
  /services/:id             → ServiceEditorPage
  /availability             → AvailabilityCalendarPage
  /bookings                 → BookingsPage
  /bookings/:id             → BookingDetailPage
  /invoices                 → InvoicesPage
  /messages                 → MessagesPage
  /performance              → PerformancePage
  /payouts                  → PayoutsPage
  /profile                  → ProfilePage
  /settings                 → SettingsPage

/admin
  /dashboard                → DashboardPage
  /users                    → UserManagementPage
  /operators                → OperatorManagementPage
  /vendors                  → VendorManagementPage
  /analytics                → AnalyticsPage
  /settings                 → SettingsPage
```

## Page Guidelines
- **Layout**: Use PageContainer with Header/Sidebar
- **Data Fetching**: React Query for server state
- **Loading States**: Skeleton loaders, not spinners
- **Error Handling**: Error boundaries per page section
- **SEO**: Meta tags for public pages
- **Analytics**: Page view tracking
- **Permissions**: Route guards per role

## Key Constraints
- Pages compose components, don't contain business logic
- Each page has a single responsibility
- Responsive design for all pages
- Lazy load pages with React.lazy/Suspense
- Prefetch data on hover for instant navigation