import { useEffect, useState } from "react";

const UNSPLASH_ACCESS_KEY = process.env.EXPO_PUBLIC_UNSPLASH_ACCESS_KEY;

export const useImage = (countryData: any, region?: string | null) => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [regionImage, setRegionImage] = useState<string | null>(null);

  const fetchUnsplashImage = async (query: string) => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          query
        )}&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].urls.regular as string;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching Unsplash image for "${query}":`, error);
      return null;
    }
  };

  useEffect(() => {
    if (countryData?.name?.common) {
      fetchUnsplashImage(`${countryData.name.common} landscape`).then((img) =>
        setBackgroundImage(img)
      );
    }
  }, [countryData]);
  console.log(region)

  useEffect(() => {
    if (region && countryData?.name?.common) {
      fetchUnsplashImage(`${region} ${countryData.name.common} landscape`).then(
        (img) => setRegionImage(img)
      );
    } else {
      setRegionImage(null); // reset to avoid fallback showing the country image
    }
  }, [region, countryData]);

  return { backgroundImage, regionImage };
};
