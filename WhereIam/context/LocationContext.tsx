import { useCountry } from "@/hooks/use-country";
import { useImage } from "@/hooks/use-image"; // Import the useImage hook
import { useUserLocation } from "@/hooks/use-location";
import React, { createContext, useContext } from "react";

interface LocationContextType {
  isoCountryCode: string | null;
  isLoadingLocation: boolean;
  locationError: string;
  city: string | null;
  region: string | null;
  timezone: string | null;
  latitude: number | null;
  longitude: number | null;
  countryData: any;
  isLoadingCountry: boolean;
  countryError: string;
  backgroundImage: string | null; // Add backgroundImage
  regionImage: string | null; // Add regionImage
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const locationData = useUserLocation();
  const country = useCountry(locationData.isoCountryCode);

  let normalizedRegion =
    locationData.region?.trim() ||
    locationData.city?.trim() ||
    country.countryData?.subregion?.trim() ||
    country.countryData?.region?.trim() ||
    null;
  
  // Prevent region from being the same as the country name to avoid duplicate searches/images
  if (
    normalizedRegion &&
    country.countryData?.name?.common &&
    normalizedRegion.toLowerCase() === country.countryData.name.common.toLowerCase()
  ) {
    normalizedRegion = null;
  }
  
  const { backgroundImage, regionImage } = useImage(
    country.countryData,
    normalizedRegion
  );

  return (
    <LocationContext.Provider
      value={{
        isoCountryCode: locationData.isoCountryCode,
        isLoadingLocation: locationData.isLoadingLocation,
        locationError: locationData.locationError,
        city: locationData.city,
        region: normalizedRegion,
        timezone: locationData.timezone,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        countryData: country.countryData,
        isLoadingCountry: country.isLoadingCountry,
        countryError: country.countryError,
        backgroundImage,
        regionImage,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used inside LocationProvider");
  }
  return context;
}
