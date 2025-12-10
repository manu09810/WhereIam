import React, { createContext, useContext } from "react";
import { useUserLocation } from "@/hooks/use-location";
import { useCountry } from "@/hooks/use-country";

interface LocationContextType {
  isoCountryCode: string | null;
  isLoadingLocation: boolean;
  locationError: string;
  countryData: any;
  isLoadingCountry: boolean;
  countryError: string;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const location = useUserLocation();
  const country = useCountry(location.isoCountryCode);

  return (
    <LocationContext.Provider
      value={{
        ...location,
        ...country,
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
