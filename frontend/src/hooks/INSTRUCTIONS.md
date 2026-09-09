# Frontend Hooks - Instructions

## Purpose
Custom React hooks for reusable logic, state management, and side effects.

## Hook Categories

### 1. Authentication & User (`auth/`)
- `useAuth()` - Current user, login, logout, token refresh
- `usePermissions()` - Role-based permission checks
- `useOnboarding()` - Onboarding flow state

### 2. Data Fetching (`data/`)
- `useQuery(key, fetcher)` - Wrapper around React Query
- `useMutation(mutationFn)` - Wrapper for mutations
- `useInfiniteQuery()` - Paginated data
- `usePrefetch()` - Prefetch on hover
- `useInvalidate()` - Invalidate queries

### 3. Traveler-Specific (`traveler/`)
- `useTripPlanner()` - Trip planning wizard state
- `usePreferences()` - Traveler preferences CRUD
- `useItineraryOptions()` - Compare itinerary alternatives
- `useItineraryCustomization()` - Customization state
- `useLiveTrip()` - Real-time trip updates (WebSocket)
- `useDisruptionHandler()` - Disruption alternatives selection
- `useApproval()` - Approval workflow state
- `useDigitalVouchers()` - Voucher management
- `useOfflineSync()` - Offline data synchronization

### 4. Operator-Specific (`operator/`)
- `useControlTower()` - Dashboard real-time data
- `useTourManagement()` - Tour CRUD and state
- `useQuoteBuilder()` - Quote creation state
- `useVendorManagement()` - Vendor operations
- `useDisruptionResolution()` - Disruption handling workflow
- `useApprovalQueue()` - Approval management
- `useMarginTracking()` - Real-time margin updates

### 5. Vendor-Specific (`vendor/`)
- `useServiceManagement()` - Service CRUD
- `useAvailabilityCalendar()` - Calendar state
- `useBookingConfirmations()` - Booking actions
- `useInvoiceManagement()` - Invoice upload/tracking

### 6. UI/Interaction (`ui/`)
- `useModal()` - Modal state management
- `useToast()` - Toast notifications
- `useDrawer()` - Side drawer state
- `useToggle()` - Boolean toggle
- `useDebounce(value, delay)` - Debounced value
- `useClickOutside(ref, handler)` - Click outside detection
- `useKeyPress(key, handler)` - Keyboard shortcuts
- `useMediaQuery(query)` - Responsive breakpoints
- `useIntersectionObserver()` - Scroll visibility
- `useDragAndDrop()` - Drag-drop logic

### 6. Form & Validation (`form/`)
- `useForm(schema)` - React Hook Form wrapper with Zod
- `useFieldArray()` - Dynamic field arrays
- `useFormPersist()` - Persist form to localStorage
- `useWizard(steps)` - Multi-step form navigation

### 7. Map & Location (`map/`)
- `useMap()` - Map instance and controls
- `useGeolocation()` - User location
- `usePlacesAutocomplete()` - Place search
- `useRoute()` - Route display and calculation
- `useMarkers()` - Marker management

### 8. Chat & AI (`chat/`)
- `useChat()` - Chat session management
- `useStreamingResponse()` - Streaming AI responses
- `useToolCalls()` - AI tool calling handling

### 9. Notifications (`notifications/`)
- `useNotifications()` - In-app notification center
- `usePushNotifications()` - Push permission and tokens
- `useWebSocket()` - Real-time updates connection

### 10. Utilities (`utils/`)
- `useLocalStorage(key, initialValue)` - Persisted state
- `useSessionStorage(key, initialValue)` - Session state
- `useCookie(name)` - Cookie access
- `useCopyToClipboard()` - Clipboard API
- `useDownload()` - File download trigger
- `usePrint()` - Print functionality
- `useShare()` - Web Share API

## Hook Guidelines
- **Single Responsibility**: One hook, one concern
- **TypeScript**: Strict types for all returns
- **Testing**: Unit test with React Testing Library
- **Dependencies**: Explicit dependency arrays
- **Cleanup**: Return cleanup functions for subscriptions
- **Naming**: `use` prefix, descriptive names
- **Composition**: Compose primitive hooks

## Example Hook Structure
```typescript
// hooks/traveler/useTripPlanner.ts
interface TripPlannerState {
  step: 1 | 2 | 3 | 4 | 5;
  preferences: TravelPreferences | null;
  itineraries: ItineraryOption[];
  selectedItinerary: ItineraryOption | null;
  customizations: Customization[];
}

export function useTripPlanner() {
  const [state, setState] = useState<TripPlannerState>(initialState);
  
  const actions = useMemo(() => ({
    setPreferences: (p) => setState(s => ({...s, preferences: p})),
    setItineraries: (i) => setState(s => ({...s, itineraries: i})),
    selectItinerary: (i) => setState(s => ({...s, selectedItinerary: i})),
    nextStep: () => setState(s => ({...s, step: Math.min(s.step + 1, 5)})),
    prevStep: () => setState(s => ({...s, step: Math.max(s.step - 1, 1)})),
    reset: () => setState(initialState),
  }), []);
  
  return { state, actions };
}
```

## Key Constraints
- No direct API calls in hooks - use service layer
- Hooks must be pure or use React Query for server state
- Avoid prop drilling - use Context for global state
- Memoize expensive computations
- Handle loading/error states consistently