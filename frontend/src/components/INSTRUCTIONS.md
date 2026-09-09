# Frontend Components - Instructions

## Purpose
Reusable UI components organized by domain and functionality for the traveler app, operator dashboard, and vendor portal.

## Component Structure

### 1. Common/UI Components (`common/`)
- **Button** - Primary, secondary, outline, ghost, loading states
- **Input** - Text, textarea, select, autocomplete, date picker
- **Card** - Content containers with variants
- **Modal** - Dialogs, drawers, bottom sheets
- **Toast/Alert** - Notifications, success, error, warning, info
- **Spinner/Loader** - Page, inline, skeleton loaders
- **Typography** - Heading, text, label, link components
- **Avatar** - User, vendor, service avatars
- **Badge** - Status indicators, counts
- **Tabs** - Tab navigation
- **Accordion** - Collapsible sections
- **Tooltip/Popover** - Hover/focus information
- **Dropdown/Select** - Single/multi select with search
- **Table** - Sortable, filterable, paginated data tables
- **Pagination** - Page navigation
- **Breadcrumb** - Navigation hierarchy
- **Progress** - Linear, circular, step progress

### 2. Layout Components (`layout/`)
- **Header** - App header with navigation, user menu
- **Sidebar** - Collapsible navigation sidebar
- **Footer** - App footer
- **PageContainer** - Consistent page wrapper
- **Grid/Flex** - Layout primitives
- **Section** - Page section wrapper
- **Container** - Max-width containers

### 3. Traveler Components (`traveler/`)
- **ProfileForm** - Traveler profile editing
- **PreferenceExtractor** - Natural language input → structured preferences
- **TripRequestForm** - Conversational trip request interface
- **ItineraryCard** - Itinerary option display with comparison
- **ItineraryTimeline** - Day-wise visual timeline
- **ItineraryMap** - Interactive map with route
- **BookingFlow** - Multi-step booking wizard
- **PaymentForm** - Secure payment input
- **DigitalVoucher** - QR code, barcode display
- **LiveItinerary** - Real-time trip view with updates
- **DisruptionBanner** - Disruption alert with alternatives
- **AlternativeSelector** - Compare replanning options
- **ApprovalRequest** - Traveler approval interface
- **ReviewForm** - Post-trip review submission
- **EmergencyButton** - SOS/emergency contact
- **OfflineIndicator** - Connectivity status
- **TravelAssistantChat** - AI chat interface

### 4. Operator Components (`operator/`)
- **ControlTower** - Main dashboard with metrics
- **TourList** - Filterable, sortable tour table
- **TourDetail** - Detailed tour view with timeline
- **ItineraryBuilder** - Drag-drop itinerary construction
- **QuoteGenerator** - Quote creation and sending
- **VendorManager** - Vendor CRUD and performance
- **BookingManager** - Booking status tracking
- **MarginTracker** - Real-time margin visualization
- **AlertPanel** - Operational alerts queue
- **DisruptionHandler** - Disruption resolution workflow
- **ApprovalQueue** - Pending approvals
- **RefundTracker** - Refund status management
- **AnalyticsDashboard** - Charts and reports
- **GroupManager** - Group tour management
- **CoordinatorManager** - Coordinator assignments

### 5. Vendor Components (`vendor/`)
- **VendorDashboard** - Assigned services overview
- **ServiceManager** - Service listing CRUD
- **AvailabilityCalendar** - Visual availability editor
- **BookingConfirmations** - Confirm/manage bookings
- **DelayCancellationReport** - Report issues
- **InvoiceUpload** - Invoice management
- **CommunicationCenter** - Operator messages
- **PerformanceMetrics** - Vendor scorecard

### 6. Shared Domain Components (`shared/`)
- **ServiceCard** - Hotel, experience, transport display
- **PriceDisplay** - Formatted price with breakdown
- **DateRangePicker** - Trip date selection
- **LocationPicker** - Map-based location selection
- **RatingDisplay** - Star ratings with breakdown
- **ImageGallery** - Service images carousel
- **MapView** - Reusable map component
- **CurrencySelector** - Currency display/input
- **LanguageSelector** - Language switching
- **TimezoneDisplay** - Timezone-aware time display

## Component Guidelines
- **Atomic Design**: Atoms → Molecules → Organisms → Templates → Pages
- **TypeScript**: Strict typing for all props
- **Accessibility**: ARIA labels, keyboard navigation, color contrast
- **Responsive**: Mobile-first, breakpoints at 640, 768, 1024, 1280
- **Theming**: CSS variables for light/dark mode
- **Storybook**: Document all components with stories
- **Testing**: Unit tests for logic, visual regression for UI

## State Management
- **React Context**: Theme, auth, user preferences
- **React Query/TanStack Query**: Server state, caching
- **Zustand/Redux**: Client-only complex state (chat, builders)
- **URL State**: Filters, pagination, tabs in URL

## Styling
- **Tailwind CSS**: Utility-first styling
- **CSS Modules**: Component-scoped styles when needed
- **Design Tokens**: Colors, spacing, typography in config
- **Dark Mode**: Class-based strategy

## Key Constraints
- No business logic in components - use hooks/services
- Components must be reusable across traveler/operator/vendor
- Lazy load heavy components (maps, charts, editors)
- Optimize bundle size with code splitting
- Error boundaries for graceful degradation