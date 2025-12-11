import { useCountry } from "@/hooks/use-country";
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
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const locationData = useUserLocation();
  const country = useCountry(locationData.isoCountryCode);

  return (
    <LocationContext.Provider
      value={{
        isoCountryCode: locationData.isoCountryCode,
        isLoadingLocation: locationData.isLoadingLocation,
        locationError: locationData.locationError,
        city: locationData.city,
        region: locationData.region,
        timezone: locationData.timezone,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        countryData: country.countryData,
        isLoadingCountry: country.isLoadingCountry,
        countryError: country.countryError,
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
