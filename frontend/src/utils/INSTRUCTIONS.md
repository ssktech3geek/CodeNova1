# Frontend Utilities - Instructions

## Purpose
Shared utility functions for formatting, validation, calculations, and common operations.

## Utility Categories

### 1. Formatting (`format/`)
- `formatCurrency(amount, currency, locale)` - Localized currency
- `formatDate(date, format, locale)` - Date formatting
- `formatTime(date, locale)` - Time formatting
- `formatDateTime(date, locale)` - Combined date/time
- `formatDuration(minutes)` - Human-readable duration (e.g., "2h 30m")
- `formatDistance(meters, unit)` - km/mi with decimals
- `formatNumber(number, locale)` - Number with separators
- `formatPercentage(value, decimals)` - Percentage display
- `formatPhoneNumber(phone, country)` - Phone formatting
- `truncate(text, length)` - Text truncation with ellipsis
- `slugify(text)` - URL-friendly slugs

### 2. Validation (`validation/`)
- `validateEmail(email)` - Email format
- `validatePhone(phone, country)` - Phone format
- `validatePassword(password)` - Strength requirements
- `validateDateRange(start, end)` - Logical date order
- `validateBudget(amount, currency)` - Positive amount
- `validateCoordinates(lat, lng)` - Valid lat/lng
- `validateUrl(url)` - URL format
- `validateRequired(value)` - Non-empty check
- `composeValidators(...validators)` - Combine validators

### 3. Date/Time (`date/`)
- `addDays(date, days)` - Date arithmetic
- `addMinutes(date, minutes)` - Time arithmetic
- `differenceInMinutes(start, end)` - Duration calculation
- `isSameDay(date1, date2)` - Day comparison
- `isWithinRange(date, start, end)` - Range check
- `getTimezoneOffset(timezone, date)` - Offset calculation
- `convertTimezone(date, fromTz, toTz)` - Timezone conversion
- `startOfDay(date)` - Day boundary
- `endOfDay(date)` - Day boundary
- `getBusinessDays(start, end)` - Working days count

### 4. Geographic (`geo/`)
- `calculateDistance(lat1, lng1, lat2, lng2)` - Haversine distance
- `calculateBounds(coordinates)` - Bounding box
- `getCenterPoint(coordinates)` - Centroid
- `decodePolyline(encoded)` - Google polyline decoding
- `encodePolyline(coordinates)` - Polyline encoding
- `isPointInPolygon(point, polygon)` - Point-in-polygon
- `formatCoordinates(lat, lng, format)` - DMS, decimal

### 5. Travel Domain (`travel/`)
- `calculateTripDuration(startDate, endDate)` - Days count
- `calculatePaceScore(itinerary)` - Relaxed/busy score
- `estimateFatigue(items)` - Fatigue estimation
- `getTravelTimeEstimate(distance, mode)` - Time by transport
- `calculatePreferenceMatch(preferences, itinerary)` - Match score
- `getWeatherRiskScore(items, forecast)` - Weather dependency
- `calculateCarbonFootprint(itinerary)` - CO2 estimation

### 6. Pricing (`pricing/`)
- `calculateTotal(items)` - Sum with precision
- `applyDiscount(amount, discount)` - Percent/fixed
- `calculateTax(amount, rate)` - Tax calculation
- `formatPriceBreakdown(breakdown)` - Display breakdown
- `convertCurrency(amount, from, to, rate)` - Currency conversion
- `calculateMargin(customerPrice, supplierCost)` - Margin %

### 7. Storage (`storage/`)
- `getLocalStorage(key, defaultValue)` - Safe localStorage
- `setLocalStorage(key, value)` - Safe set
- `removeLocalStorage(key)` - Safe remove
- `getSessionStorage(key, defaultValue)` - Safe sessionStorage
- `clearAllStorage()` - Clear app storage

### 8. API/Network (`api/`)
- `buildQueryParams(params)` - URLSearchParams builder
- `parseErrorResponse(error)` - Standardized error
- `retryFetch(fn, retries, delay)` - Retry logic
- `cancelableFetch(signal)` - AbortController wrapper

### 9. Array/Object (`collections/`)
- `groupBy(array, key)` - Group array by key
- `sortBy(array, key, direction)` - Sort helper
- `uniqueBy(array, key)` - Deduplicate by key
- `chunk(array, size)` - Chunk array
- `flatten(array)` - Flatten nested arrays
- `deepMerge(target, source)` - Deep object merge
- `pick(object, keys)` - Pick keys
- `omit(object, keys)` - Omit keys

### 10. String (`string/`)
- `capitalize(str)` - First letter uppercase
- `titleCase(str)` - Each word capitalized
- `camelCase(str)` - camelCase conversion
- `kebabCase(str)` - kebab-case conversion
- `generateId()` - Unique ID (nanoid/uuid)
- `maskString(str, visibleStart, visibleEnd)` - Mask sensitive data

### 11. Color/Design (`design/`)
- `hexToRgb(hex)` - Color conversion
- `rgbToHex(r, g, b)` - Color conversion
- `lightenColor(hex, amount)` - Lighten
- `darkenColor(hex, amount)` - Darken
- `getContrastColor(hex)` - Black/white for contrast
- `generateAvatarColor(string)` - Consistent avatar colors

### 12. File/Media (`media/`)
- `formatFileSize(bytes)` - Human-readable size
- `getFileExtension(filename)` - Extension extraction
- `isImageFile(file)` - Type check
- `compressImage(file, options)` - Client-side compression
- `createThumbnail(file, size)` - Thumbnail generation
- `dataUrlToBlob(dataUrl)` - Convert data URL

## Utility Guidelines
- **Pure Functions**: No side effects, same input = same output
- **TypeScript**: Full type signatures
- **Tree Shaking**: Named exports, no barrel files for large libs
- **Testing**: 100% unit test coverage
- **Documentation**: JSDoc for all public functions
- **Performance**: Memoize expensive calculations

## Key Constraints
- No React dependencies in utils (except hooks folder)
- No API calls - use services layer
- No direct DOM manipulation
- Handle edge cases (null, undefined, empty)
- Consistent error handling (throw vs return Result)