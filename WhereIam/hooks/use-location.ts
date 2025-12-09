import { useState, useEffect } from "react";
import * as Location from "expo-location";

export const useUserLocation = () => {
  const [isoCountryCode, setIsoCountryCode] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [locationError, setLocationError] = useState("");

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationError("Error of location");
        setIsLoadingLocation(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      setIsoCountryCode(reverseGeocode[0]?.isoCountryCode || null);
      setIsLoadingLocation(false);
    })();
  }, []);

  return { isoCountryCode, isLoadingLocation, locationError };
};
