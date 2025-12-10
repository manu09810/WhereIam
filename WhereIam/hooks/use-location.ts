import * as Location from "expo-location";
import { useEffect, useState } from "react";

export const useUserLocation = () => {
  const [isoCountryCode, setIsoCountryCode] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [region, setRegion] = useState<string | null>(null);
  const [timezone, setTimezone] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [locationError, setLocationError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        console.log("Requesting location permissions...");
        let { status } = await Location.requestForegroundPermissionsAsync();
        console.log("Permission status:", status);

        if (status !== "granted") {
          setLocationError("Permission to access location was denied");
          setIsLoadingLocation(false);
          return;
        }

        console.log("Getting current position...");
        let location = await Location.getCurrentPositionAsync({});
        console.log("Location obtained:", location.coords);

        let reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        console.log("Reverse geocode result:", reverseGeocode[0]);

        setIsoCountryCode(reverseGeocode[0]?.isoCountryCode || null);
        setCity(reverseGeocode[0]?.city || null);
        setRegion(reverseGeocode[0]?.region || null);
        setTimezone(reverseGeocode[0]?.timezone || null);
        setIsLoadingLocation(false);
      } catch (error) {
        console.error("Location error:", error);
        setLocationError(`Error getting location: ${error}`);
        setIsLoadingLocation(false);
      }
    })();
  }, []);

  return {
    isoCountryCode,
    city,
    region,
    timezone,
    isLoadingLocation,
    locationError,
  };
};
