# Frontend Assets - Instructions

## Purpose
Static assets organization and usage guidelines.

## Asset Structure

### 1. Images (`images/`)
```
images/
├── logos/
│   ├── logo-full.svg
│   ├── logo-icon.svg
│   ├── logo-white.svg
│   └── favicon.ico
├── illustrations/
│   ├── onboarding-1.svg
│   ├── onboarding-2.svg
│   ├── onboarding-3.svg
│   ├── empty-state.svg
│   ├── error-state.svg
│   └── success-state.svg
├── placeholders/
│   ├── hotel-placeholder.webp
│   ├── experience-placeholder.webp
│   ├── restaurant-placeholder.webp
│   ├── avatar-placeholder.svg
│   └── map-placeholder.webp
├── icons/
│   ├── transport-car.svg
│   ├── transport-bus.svg
│   ├── transport-flight.svg
│   ├── transport-train.svg
│   ├── transport-boat.svg
│   ├── activity-beach.svg
│   ├── activity-adventure.svg
│   ├── activity-cultural.svg
│   ├── activity-wellness.svg
│   └── activity-food.svg
└── backgrounds/
    ├── hero-pattern.svg
    └── dashboard-pattern.svg
```

### 2. Fonts (`fonts/`)
```
fonts/
├── inter/
│   ├── Inter-Regular.woff2
│   ├── Inter-Medium.woff2
│   ├── Inter-SemiBold.woff2
│   └── Inter-Bold.woff2
└── variable/
    └── Inter-Variable.woff2
```

### 3. Videos (`videos/`)
```
videos/
├── onboarding-demo.mp4
└── feature-tour.mp4
```

### 4. Data (`data/`)
```
data/
├── countries.json
├── currencies.json
├── timezones.json
├── languages.json
├── transport-modes.json
├── activity-categories.json
└── hotel-types.json
```

## Asset Guidelines

### Images
- **Format**: WebP for photos, SVG for icons/illustrations
- **Optimization**: Compress with `imagemin` in build
- **Responsive**: Multiple sizes for hero images (400w, 800w, 1200w, 1600w)
- **Lazy Loading**: Native `loading="lazy"` for below-fold
- **Alt Text**: Descriptive alt for all content images
- **Naming**: kebab-case, descriptive names

### Icons
- **System**: Use Lucide React or Heroicons for UI icons
- **Custom**: SVG sprites for brand/custom icons
- **Size**: 24x24 default, scale with `em` units
- **Color**: `currentColor` for theme adaptation

### Fonts
- **Primary**: Inter (variable font for performance)
- **Loading**: `font-display: swap` for performance
- **Subsetting**: Latin subset for smaller files
- **Fallback**: System font stack

### Data Files
- **Format**: JSON with UTF-8 encoding
- **Validation**: JSON Schema for structure
- **Versioning**: Include version in filename if needed
- **Import**: Direct ES module imports

## Usage in Components

### Images
```tsx
import logo from '@/assets/images/logos/logo-full.svg';
import hotelPlaceholder from '@/assets/images/placeholders/hotel-placeholder.webp';

// In component
<img src={logo} alt="CodeNova" width={120} height={40} />
<img src={hotel.src || hotelPlaceholder} alt={hotel.name} loading="lazy" />
```

### Data
```tsx
import countries from '@/assets/data/countries.json';
import currencies from '@/assets/data/currencies.json';

// TypeScript types generated from JSON
const countryOptions = countries.map(c => ({
  value: c.code,
  label: c.name
}));
```

### Fonts (in CSS)
```css
@font-face {
  font-family: 'Inter';
  src: url('@/assets/fonts/variable/Inter-Variable.woff2') format('woff2');
  font-display: swap;
  font-weight: 100 900;
}
```

## Build Configuration
- **Vite**: Asset handling via `import` and `public/` folder
- **Hashing**: Content hash in filename for cache busting
- **Copy**: `public/` folder copied as-is to dist
- **Optimization**: `vite-plugin-imagemin` for production

## Key Constraints
- No assets in `src/` that should be in `public/`
- `public/` for files needing exact names/paths (favicon, robots.txt)
- Max 100KB per image (compress larger)
- SVGs optimized with SVGO
- No duplicate assets