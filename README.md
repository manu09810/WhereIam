# WhereIam

A React Native / Expo mobile app that automatically detects the user's location and displays contextual information about their country, region, and city — including country facts, local news, weather, currency conversion, and translation.

## Features

- Automatic GPS-based location detection
- Country metadata (capital, population, languages, currency, continent, timezone)
- Dynamic UI theming based on country flag and landscape colors
- Local news (country, region, or city scope, in local language or English)
- AI-generated facts for country, region, and city (Google Gemini 2.5 Flash)
- Weather widget (open-meteo.com)
- Currency conversion
- Country and region landscape photos (Unsplash)
- Country flag display (flagcdn.com)
- Caching for news and facts (AsyncStorage)

## Tech Stack

- React Native + Expo (file-based routing via Expo Router)
- TypeScript
- `expo-location` for GPS and reverse geocoding
- `react-native-image-colors` for dynamic palette extraction
- AsyncStorage for local caching

## Getting Started

### Prerequisites

- Node.js
- Expo CLI
- iOS Simulator or Android Emulator (or physical device with Expo Go)

### Installation

```bash
git clone https://github.com/manu09810/WhereIam.git
cd WhereIam
npm install
```

### Environment Variables

Create a `.env` file in the `WhereIam/` directory with the following keys:

```
EXPO_PUBLIC_UNSPLASH_ACCESS_KEY=        # Unsplash API for country/region photos
EXPO_PUBLIC_GOOGLE_API_GEMINI_KEY=      # Google Gemini 2.5 Flash for AI facts
EXPO_PUBLIC_GOOGLE_API_KEY=             # Google Custom Search API for news
EXPO_PUBLIC_GOOGLE_SEARCH_ENGINE_ID=    # Google CSE ID for news search
```

All variables must be prefixed with `EXPO_PUBLIC_` to be accessible in React Native.

### Running the App

```bash
# Start development server
npx expo start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Lint
npm run lint
```

## Architecture

### Data Flow

The central data pipeline flows through `LocationContext` (`context/LocationContext.tsx`):

1. `useUserLocation` (expo-location) — GPS coords + reverse geocode — `isoCountryCode`, `city`, `region`, `timezone`
2. `useCountry` (restcountries.com) — full country metadata from ISO code
3. `useImage` (Unsplash) — `backgroundImage` (country landscape), `regionImage`
4. Flag image fetched from `flagcdn.com` using `cca2` country code
5. `react-native-image-colors` extracts palette — `themeColors[]` and `averageColor`

Every screen consumes this via `useLocation()`.

### Dynamic Theming

The UI is dynamically themed based on the country's flag and landscape colors. `themeColors[0]` is the primary accent, `themeColors[1]` is the time widget background. Helper functions in `constants/functions.ts` (`getReadableTextColor`, `averageColors`) ensure accessible contrast.

### Screen Structure

| File | Description |
|------|-------------|
| `app/_layout.tsx` | Root layout, wraps everything in `<LocationProvider>` |
| `app/(tabs)/_layout.tsx` | Tab bar with dynamic background color |
| `app/(tabs)/infoCountry.tsx` | Main screen: flag hero, map widget, local time, data grid cards |
| `app/(tabs)/News.tsx` | News hub: select scope, toggle language |
| `app/(tabs)/Facts.tsx` | Facts hub: navigate to AI-generated facts |
| `app/NewsDetail.tsx` | Fetches news via Google Custom Search, caches with AsyncStorage |
| `app/FactsDetail.tsx` | Calls Gemini 2.5 Flash, generates 5 facts, caches with AsyncStorage |

### Modals

| Component | Description |
|-----------|-------------|
| `WeatherModal` | Calls open-meteo.com with lat/lon |
| `CurrencyModal` | Currency exchange rates (custom backend) |
| `TranslateModal` | Translation feature (migration in progress) |

### Caching

`getFromCache` / `setOnCache` in `constants/cache.ts` use AsyncStorage with a `{label}-{typeOfMedia}` key pattern.

- News: expires after 24 hours
- Facts: cached indefinitely until location changes
- Cache invalidated by the local/international toggle via `deleteGeneralCache`

### Path Aliases

`@/` maps to the `WhereIam/` root (configured in `tsconfig.json`).

```ts
import { useLocation } from '@/context/LocationContext';
import { getReadableTextColor } from '@/constants/functions';
```

### External APIs

| API | Purpose |
|-----|---------|
| restcountries.com/v3.1 | Country metadata |
| open-meteo.com | Weather (no key required) |
| flagcdn.com | Country flag images |
| Unsplash | Country/region landscape photos |
| Google Custom Search | News search |
| Google Gemini 2.5 Flash | AI-generated location facts |

## Project Structure

```
WhereIam/
├── app/
│   ├── _layout.tsx
│   ├── NewsDetail.tsx
│   ├── FactsDetail.tsx
│   └── (tabs)/
│       ├── _layout.tsx
│       ├── infoCountry.tsx
│       ├── News.tsx
│       └── Facts.tsx
├── components/
│   ├── WeatherModal.tsx
│   ├── CurrencyModal.tsx
│   └── TranslateModal.tsx
├── context/
│   └── LocationContext.tsx
├── constants/
│   ├── cache.ts
│   └── functions.ts
├── hooks/
│   ├── useUserLocation.ts
│   ├── useCountry.ts
│   └── useImage.ts
└── .env
```
