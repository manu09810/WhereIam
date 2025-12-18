import { useCountry } from "@/hooks/use-country";
import { useImage } from "@/hooks/use-image";
import { useUserLocation } from "@/hooks/use-location";
import { getColors } from "react-native-image-colors";
import React, { createContext, useContext, useEffect, useState } from "react";

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
  backgroundImage: string | null;
  regionImage: string | null;
  flagImage: string | null;
  flagColors: string[] | null;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const locationData = useUserLocation();
  const country = useCountry(locationData.isoCountryCode);
  const [flagImage, setFlagImage] = useState<string | null>(null);
  const [flagColors, setFlagColors] = useState<string[] | null>(null);

  // Fetch flag image
  useEffect(() => {
    if (country.countryData?.cca2) {
      setFlagImage(
        `https://flagcdn.com/w2560/${country.countryData.cca2.toLowerCase()}.png`
      );
    }
  }, [country.countryData?.cca2]);

  // Detect flag colors
  useEffect(() => {
    if (flagImage) {
      detectFlagColors(flagImage);
    }
  }, [flagImage]);

  const detectFlagColors = async (imageUrl: string) => {
    try {
      const result = await getColors(imageUrl, {
        fallback: "#ffffff",
        cache: true,
        key: imageUrl,
      });
      if (result.platform === "android") {
        setFlagColors(
          [result.dominant, result.average, result.vibrant].filter(Boolean)
        );
      } else if (result.platform === "ios") {
        setFlagColors(
          [
            result.background,
            result.primary,
            result.secondary,
            result.detail,
          ].filter(Boolean)
        );
      }
    } catch (e) {
      setFlagColors(null);
    }
  };

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
    normalizedRegion.toLowerCase() ===
      country.countryData.name.common.toLowerCase()
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
        flagImage,
        flagColors,
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
