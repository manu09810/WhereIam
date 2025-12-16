import * as Location from "expo-location";
import { useEffect, useState } from "react";

export const useUserLocation = () => {
  const [isoCountryCode, setIsoCountryCode] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [region, setRegion] = useState<string | null>(null);
  const [timezone, setTimezone] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [locationError, setLocationError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocationError("Permission to access location was denied");
          setIsLoadingLocation(false);
          return;
        }

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Lowest,
        });

        setLatitude(loc.coords.latitude);
        setLongitude(loc.coords.longitude);

        const [rev] = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });

        setIsoCountryCode(rev?.isoCountryCode ?? null);
        setCity(rev?.city ?? rev?.district ?? null);
        setRegion(rev?.region ?? rev?.subregion ?? null);
        setTimezone(rev?.timezone ?? null);
      } catch (error: any) {
        setLocationError(error?.message || "Error getting location");
      } finally {
        setIsLoadingLocation(false);
      }
    })();
  }, []);

  return {
    isoCountryCode,
    city,
    region,
    timezone,
    latitude,
    longitude,
    isLoadingLocation,
    locationError,
  };
};
