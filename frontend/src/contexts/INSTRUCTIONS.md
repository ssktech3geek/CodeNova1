# Frontend Contexts - Instructions

## Purpose
React Context providers for global state that needs to be accessible across the component tree.

## Context Providers

### 1. AuthContext (`AuthProvider`)
**Scope**: Entire app
**State**:
- `user: User | null` - Current authenticated user
- `isAuthenticated: boolean`
- `isLoading: boolean`
- `permissions: Permission[]`

**Actions**:
- `login(credentials)`
- `register(data)`
- `logout()`
- `refreshToken()`
- `updateProfile(data)`
- `checkPermission(resource, action)`

**Usage**:
```tsx
const { user, login, logout } = useAuth();
```

### 2. ThemeContext (`ThemeProvider`)
**Scope**: Entire app
**State**:
- `theme: 'light' | 'dark' | 'system'`
- `resolvedTheme: 'light' | 'dark'`

**Actions**:
- `setTheme(theme)`
- `toggleTheme()`

**Features**:
- Persists to localStorage
- Syncs with system preference
- Applies `data-theme` to document

### 3. LocaleContext (`LocaleProvider`)
**Scope**: Entire app
**State**:
- `locale: string` - e.g., 'en', 'hi', 'es'
- `currency: string` - e.g., 'INR', 'USD', 'EUR'
- `timezone: string` - e.g., 'Asia/Kolkata'
- `dateFormat: string`
- `numberFormat: Intl.NumberFormatOptions`

**Actions**:
- `setLocale(locale)`
- `setCurrency(currency)`
- `setTimezone(timezone)`

**Features**:
- Browser detection fallback
- Persists preferences
- Formats dates, numbers, currencies

### 4. NotificationContext (`NotificationProvider`)
**Scope**: Entire app
**State**:
- `toasts: Toast[]` - Active toast notifications
- `unreadCount: number` - In-app notification badge

**Actions**:
- `showToast(type, message, options?)`
- `dismissToast(id)`
- `markAsRead(id)`
- `markAllAsRead()`

**Features**:
- Auto-dismiss timer
- Action buttons support
- Stacking with max limit

### 5. ConnectivityContext (`ConnectivityProvider`)
**Scope**: Entire app (critical for traveler app)
**State**:
- `isOnline: boolean`
- `wasOffline: boolean`
- `connectionType: string` - 'wifi', 'cellular', 'unknown'

**Actions**:
- `retryFailedRequests()`
- `syncOfflineData()`

**Features**:
- Online/offline event listeners
- Queue failed requests
- Background sync on reconnect
- Visual indicator component

### 6. TravelAssistantContext (`TravelAssistantProvider`)
**Scope**: Traveler pages
**State**:
- `sessionId: string | null`
- `messages: ChatMessage[]`
- `isStreaming: boolean`
- `context: AssistantContext` - Current trip, preferences

**Actions**:
- `sendMessage(content)`
- `startNewSession(context?)`
- `clearHistory()`
- `invokeTool(name, args)`

### 7. ItineraryBuilderContext (`ItineraryBuilderProvider`)
**Scope**: Operator itinerary builder, Traveler customization
**State**:
- `itinerary: Itinerary | null`
- `selectedItemId: string | null`
- `dragState: DragState | null`
- `unsavedChanges: boolean`
- `validationErrors: ValidationError[]`

**Actions**:
- `addItem(item, day, position)`
- `removeItem(itemId)`
- `moveItem(itemId, newDay, newPosition)`
- `updateItem(itemId, updates)`
- `validate()`
- `save()`
- `reset()`

### 8. MapContext (`MapProvider`)
**Scope**: Map components
**State**:
- `mapInstance: MapLibreMap | null`
- `center: [lng, lat]`
- `zoom: number`
- `markers: Marker[]`
- `routes: Route[]`
- `selectedFeature: GeoJSONFeature | null`

**Actions**:
- `setCenter(center)`
- `setZoom(zoom)`
- `addMarker(marker)`
- `removeMarker(id)`
- `addRoute(route)`
- `fitBounds(bounds)`
- `flyTo(location)`

### 9. WizardContext (`WizardProvider`)
**Scope**: Multi-step flows (booking, onboarding, planning)
**State**:
- `currentStep: number`
- `totalSteps: number`
- `stepData: Record<string, any>`
- `completedSteps: Set<number>`
- `direction: 'forward' | 'backward'`

**Actions**:
- `next()`
- `prev()`
- `goToStep(step)`
- `updateStepData(step, data)`
- `markComplete(step)`
- `reset()`

## Context Guidelines
- **Minimal Providers**: Only create context for truly global state
- **Performance**: Split contexts to avoid unnecessary re-renders
- **TypeScript**: Strict context types with `undefined` checks
- **Default Values**: Sensible defaults for SSR
- **Testing**: Mock providers for unit tests
- **DevTools**: Display name for React DevTools

## Provider Composition (App Root)
```tsx
<AuthProvider>
  <ThemeProvider>
    <LocaleProvider>
      <NotificationProvider>
        <ConnectivityProvider>
          <TravelAssistantProvider>
            <AppRoutes />
          </TravelAssistantProvider>
        </ConnectivityProvider>
      </NotificationProvider>
    </LocaleProvider>
  </ThemeProvider>
</AuthProvider>
```

## Key Constraints
- Avoid context for state that changes frequently (use React Query)
- Memoize context values with `useMemo`
- Separate read/write contexts for performance
- Don't put form state in context (use hook)
- Lazy initialize expensive context values