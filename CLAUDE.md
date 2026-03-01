# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**WhereIam** is a React Native / Expo mobile app that automatically detects the user's location and displays contextual information about their country, region, and city — including country facts, local news, weather, currency conversion, and translation.

## Commands

All commands must be run from the `WhereIam/` subdirectory (where `package.json` lives):

```bash
cd WhereIam

# Start development server
npx expo start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Lint
npm run lint
```

There are no automated tests in this project.

## Environment Variables

Required in `WhereIam/.env`:

```
EXPO_PUBLIC_UNSPLASH_ACCESS_KEY=   # Unsplash API for country/region landscape photos
EXPO_PUBLIC_GOOGLE_API_GEMINI_KEY= # Google Gemini 2.5 Flash for AI-generated facts
EXPO_PUBLIC_GOOGLE_API_KEY=        # Google Custom Search API for news
EXPO_PUBLIC_GOOGLE_SEARCH_ENGINE_ID= # Google CSE ID for news search
```

All env vars must be prefixed with `EXPO_PUBLIC_` to be accessible in React Native.

## Architecture

### Data Flow

The central data pipeline flows through `LocationContext`:

1. `useUserLocation` (expo-location) → GPS coords + reverse geocode → `isoCountryCode`, `city`, `region`, `timezone`
2. `useCountry` (restcountries.com API) → full country metadata from ISO code
3. `useImage` (Unsplash API) → `backgroundImage` (country landscape), `regionImage`
4. Flag image fetched from `flagcdn.com` using `cca2` country code
5. `react-native-image-colors` extracts palette from all images → `themeColors[]` and `averageColor`

All of this is provided via `LocationContext` (at `context/LocationContext.tsx`). Every screen consumes it via `useLocation()`.

### Dynamic Theming

The UI is dynamically themed based on the country's flag/landscape colors. `themeColors[0]` is the primary accent color, `themeColors[1]` is used for the time widget background, etc. Helper functions in `constants/functions.ts` (`getReadableTextColor`, `averageColors`) ensure accessible contrast. This pattern is used consistently across all screens.

### Screen Structure

- `app/_layout.tsx` — Root layout, wraps everything in `<LocationProvider>`
- `app/(tabs)/_layout.tsx` — Tab bar with dynamic background color from `themeColors`
- `app/(tabs)/infoCountry.tsx` — Main screen: flag hero, map widget, local time, data grid cards (capital, currency, languages, population, continent, timezone, city/region, weather)
- `app/(tabs)/News.tsx` — News hub: select country/region/city scope, toggle local language vs English
- `app/(tabs)/Facts.tsx` — Facts hub: navigate to Gemini-powered facts for country/region/city
- `app/NewsDetail.tsx` — Fetches news via Google Custom Search API, caches with AsyncStorage
- `app/FactsDetail.tsx` — Calls Gemini 2.5 Flash to generate 5 facts, caches with AsyncStorage

### Caching (`constants/cache.ts`)

`getFromCache` / `setOnCache` use AsyncStorage with a `{label}-{typeOfMedia}` key pattern. News results expire after 24 hours; facts are cached indefinitely until location changes. Cache is invalidated on the News tab by the local/international toggle via `deleteGeneralCache`.

### Modals

Three modals live in `components/`:
- `WeatherModal` — calls open-meteo.com with lat/lon
- `CurrencyModal` — calls `juanmalorenzo.com/api/{currency}` (custom backend for exchange rates)
- `TranslateModal` — translation feature (was Google Translate, being migrated)

### Path Aliases

`@/` maps to `WhereIam/` (configured in `tsconfig.json`). Use `@/components/...`, `@/hooks/...`, `@/context/...`, etc.

### External APIs

| API | Purpose |
|-----|---------|
| restcountries.com/v3.1 | Country metadata |
| open-meteo.com | Weather (no key needed) |
| juanmalorenzo.com/api | Currency exchange (custom backend) |
| Unsplash | Country/region landscape photos |
| flagcdn.com | Country flag images |
| Google Custom Search | News search |
| Google Gemini 2.5 Flash | AI-generated location facts |
