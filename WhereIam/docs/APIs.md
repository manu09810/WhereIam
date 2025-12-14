# APIs

External APIs used in this project:

- **restcountries.com**  
  - Endpoint: `https://restcountries.com/v3.1/alpha/{code}`  
  - Purpose: Retrieve detailed country information (name, flag, languages, currency, etc).

- **open-meteo.com**  
  - Endpoint: `https://api.open-meteo.com/v1/forecast`  
  - Purpose: Get current weather data (temperature, wind, humidity, precipitation).

- **exchangerate.host**  
  - Endpoint: `https://api.exchangerate.host/convert`  
  - Purpose: Currency conversion between local currency and USD.

- **Unsplash API**  
  - Endpoint: `https://api.unsplash.com/search/photos`  
  - Purpose: Retrieve landscape images for countries or regions.

- **Google Maps (Integration)**  
  - Usage: Open locations in Google Maps via URL (not using the official API endpoints).

- **Wikipedia (Integration)**  
  - Usage: Open Wikipedia articles about countries, cities, regions, etc.

- **Google Translate (Integration)**  -- This would be changed for mymemo.
  - Usage: Open automatic translations of texts or country/city names.

Note: Only the first four are true APIs; the others are integrations via URL.