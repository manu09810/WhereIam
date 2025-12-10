import { useEffect, useState } from "react";

export const useCountry = (isoCountryCode: string | null) => {
  const [countryData, setCountryData] = useState(null);
  const [isLoadingCountry, setIsLoadingCountry] = useState(true);
  const [countryError, setCountryError] = useState("");

  useEffect(() => {
    if (!isoCountryCode) {
      setIsLoadingCountry(false);
      return;
    }

    (async () => {
      try {
        console.log("Requesting country data for:", isoCountryCode);
        const response = await fetch(
          `https://restcountries.com/v3.1/alpha/${isoCountryCode}`
        );

        if (!response.ok) {
          throw new Error("Country not found");
        }

        const data = await response.json();
        setCountryData(data[0]);
        setIsLoadingCountry(false);
      } catch (error) {
        console.error("Error fetching country:", error);
        setCountryError("Error al obtener datos del país");
        setIsLoadingCountry(false);
      }
    })();
  }, [isoCountryCode]);

  return { countryData, isLoadingCountry, countryError };
};
