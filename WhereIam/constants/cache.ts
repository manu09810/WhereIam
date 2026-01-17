import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getFromCache(
  label: string,
  typeOfMedia: string,
  location: string
) {
  const cacheKey = `${label}-${typeOfMedia}`;
  const cache = await AsyncStorage.getItem(cacheKey);
  const locationCache = await AsyncStorage.getItem(`${cacheKey}-location`);

  if (cache && locationCache === location) {
    return cache;
  }
  return null;
}

export async function   setOnCache(
  DataAI: string,
  label: string,
  typeOfMedia: string,
  location: string
) {
  const cacheKey = `${label}-${typeOfMedia}`;
  await AsyncStorage.setItem(`${cacheKey}-location`, location);
  await AsyncStorage.setItem(cacheKey, DataAI);
  return DataAI;
}
