import { useCountry } from "@/hooks/use-country";
import { useImage } from "@/hooks/use-image";
import { useUserLocation } from "@/hooks/use-location";
import { averageColors } from "@/constants/functions";
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
  themeColors: string[] | null;
  averageColor: string | null;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

// Remove the utility functions from here (hexToRgb, rgbToHex, averageColors)

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const locationData = useUserLocation();
  const country = useCountry(locationData.isoCountryCode);
  const [flagImage, setFlagImage] = useState<string | null>(null);
  const [themeColors, setThemeColors] = useState<string[] | null>(null);
  const [averageColor, setAverageColor] = useState<string | null>(null);

  // Extract dominant color from an image
  const getDominantColor = async (uri: string): Promise<string | null> => {
    try {
      const result = await getColors(uri, {
        fallback: "#000000",
        cache: true,
        key: uri,
      });

      if (result.platform === "android") {
        return result.dominant || result.average || "#000000";
      } else if (result.platform === "ios") {
        return result.background || result.primary || "#000000";
      }
      return "#000000";
    } catch (e) {
      console.error("Error getting dominant color:", e);
      return null;
    }
  };

  // Get multiple colors from an image
  const getImageColors = async (uri: string): Promise<string[]> => {
    try {
      const result = await getColors(uri, {
        fallback: "#ffffff",
        cache: true,
        key: uri,
      });
      if (result.platform === "android") {
        return [result.dominant, result.average, result.vibrant].filter(
          Boolean
        ) as string[];
      } else if (result.platform === "ios") {
        return [
          result.background,
          result.primary,
          result.secondary,
          result.detail,
        ].filter(Boolean) as string[];
      }
      return [];
    } catch (e) {
      console.error("Error getting image colors:", e);
      return [];
    }
  };

  // Fetch flag image
  useEffect(() => {
    if (country.countryData?.cca2) {
      setFlagImage(
        `https://flagcdn.com/w2560/${country.countryData.cca2.toLowerCase()}.png`
      );
    }
  }, [country.countryData?.cca2]);

  let normalizedRegion =
    locationData.region?.trim() ||
    locationData.city?.trim() ||
    country.countryData?.subregion?.trim() ||
    country.countryData?.region?.trim() ||
    null;

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

  // Calculate theme colors and average from all images
  useEffect(() => {
    const calculateThemeColors = async () => {
      const imagesToProcess = [flagImage, backgroundImage, regionImage].filter(
        Boolean
      ) as string[];

      if (imagesToProcess.length === 0) {
        setThemeColors(null);
        setAverageColor(null);
        return;
      }

      // Get all colors from all images
      const allColorsArrays = await Promise.all(
        imagesToProcess.map((uri) => getImageColors(uri))
      );
      const allColors = allColorsArrays.flat();

      // Get dominant colors for averaging
      const dominantColors = await Promise.all(
        imagesToProcess.map((uri) => getDominantColor(uri))
      );
      const validDominantColors = dominantColors.filter(Boolean) as string[];

      if (allColors.length > 0) {
        setThemeColors(allColors);
      } else {
        setThemeColors(null);
      }

      if (validDominantColors.length > 0) {
        const avg = averageColors(validDominantColors);
        setAverageColor(avg);
      } else {
        setAverageColor(null);
      }
    };

    calculateThemeColors();
  }, [flagImage, backgroundImage, regionImage]);

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
        themeColors,
        averageColor,
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
