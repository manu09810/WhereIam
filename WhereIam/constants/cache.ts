import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getFromCache(
  label: string,
  typeOfMedia: string,
  location: string
) {
  const cacheKey = `${label}-${typeOfMedia}`;
  const cache = await AsyncStorage.getItem(cacheKey);
  const locationCache = await AsyncStorage.getItem(`${cacheKey}-location`);
  const timestampStr = await AsyncStorage.getItem(`${cacheKey}-timestamp`);

  if (cache && locationCache === location) {
    if (timestampStr) {
      const cacheTime = parseInt(timestampStr, 10);
      const now = Date.now();
      if (now - cacheTime > 86400000) {
        await AsyncStorage.removeItem(cacheKey);
        return null;
      }
    }
    return cache;
  }
  return null;
}

export async function setOnCache(
  DataAI: string,
  label: string,
  typeOfMedia: string,
  location: string
) {
  const cacheKey = `${label}-${typeOfMedia}`;
  await AsyncStorage.setItem(`${cacheKey}-location`, location);
  await AsyncStorage.setItem(cacheKey, DataAI);
  if (typeOfMedia === "news") {
    await AsyncStorage.setItem(`${cacheKey}-timestamp`, Date.now().toString());
  }
  return DataAI;
}

export async function deleteGeneralCache(
  labelArray: string[],
  typeOfMedia: string
) {
  await Promise.all(
    labelArray.map(async (element) => {
      const cacheKey = `${element}-${typeOfMedia}`;
      await AsyncStorage.removeItem(cacheKey);
      await AsyncStorage.removeItem(`${cacheKey}-location`);
      await AsyncStorage.removeItem(`${cacheKey}-timestamp`);
    })
  );
}
