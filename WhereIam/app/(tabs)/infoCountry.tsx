import { CurrencyModal } from "@/components/CurrencyModal";
import { WeatherModal } from "@/components/WeatherModal";
import { useLocation } from "@/context/LocationContext";

import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { MapIcon } from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

function DataCard({
  label,
  value,
  onPress,
  accentColor = "#007aff",
  textColor,
}: {
  label: string;
  value: string | null | undefined;
  onPress?: () => void;
  accentColor?: string;
  textColor?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        backgroundColor: accentColor,
        borderRadius: 16,
        padding: 10,
        marginHorizontal: 6,
        marginVertical: 12,
        borderWidth: 1,
        borderColor: accentColor,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 100,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          color: "#ffffffcc",
          fontWeight: "600",
          marginBottom: 10,
          textTransform: "uppercase",
          letterSpacing: 1,
          textAlign: "center",
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: textColor || "#fff",
          fontWeight: "700",
          textAlign: "center",
        }}
      >
        {value ?? "N/A"}
      </Text>
    </Pressable>
  );
}
export default function InfoCountryScreen() {
  const {
    countryData,
    isLoadingCountry,
    countryError,
    timezone: locationTimezone,
    city,
    region,
    latitude: userLatitude,
    longitude: userLongitude,
    backgroundImage,
    regionImage,
    flagImage,
    flagColors,
  } = useLocation();

  const countryName = countryData?.name?.common || "N/A";
  const [weatherModalVisible, setWeatherModalVisible] = useState(false);
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState<string | null>(null);

  // Fetch local time
  useEffect(() => {
    const timezone =
      locationTimezone ||
      countryData?.timezones?.find((tz) => tz.includes("/")) ||
      countryData?.timezones?.[0];
    if (timezone && timezone !== "N/A" && timezone.includes("/")) {
      CurrentTime(timezone);
    }
  }, [countryData, locationTimezone]);

  const CurrentTime = (tz: string) => {
    try {
      const time = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: tz, // tz es el timezone del país/región
      });
      setCurrentTime(time);
    } catch (error) {
      setCurrentTime(null);
      console.log("Error fetching time:", error);
    }
  };

  const openWikipedia = (query) => {
    const wikipediaUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(
      query
    )}`;
    Linking.openURL(wikipediaUrl).catch((err) =>
      console.log("Error opening Wikipedia:", err)
    );
  };

  const openGoogleMaps = (query: string): void => {
    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(
      query
    )}`;
    Linking.openURL(mapsUrl).catch((err: Error) =>
      console.log("Error opening Google Maps:", err)
    );
  };

  const openGoogleTranslate = (languageCode: string): void => {
    // Obtener el código de idioma ISO 639-1 de los datos del país (idioma origen)
    const sourceLangCode = countryData?.languages
      ? Object.keys(countryData.languages)[0]
      : "en";

    // Siempre traducir a inglés si el país no habla inglés
    // Si el país habla inglés, traducir al idioma del dispositivo
    let targetLangCode = "en";

    if (sourceLangCode === "en") {
      const deviceLanguage = Intl.DateTimeFormat().resolvedOptions().locale;
      targetLangCode = deviceLanguage.split("-")[0];
    }

    // Usar el nombre del país como texto de ejemplo
    const sampleText = countryName || "hello";
    const translateUrl = `https://translate.google.com/?sl=${sourceLangCode}&tl=${targetLangCode})}`;

    Linking.openURL(translateUrl).catch((err: Error) =>
      console.log("Error opening Google Translate:", err)
    );
  };

  // --- guards después de hooks ---
  if (isLoadingCountry || !countryData) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (countryError) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>{countryError}</Text>
      </View>
    );
  }

  const currencies = countryData?.currencies
    ? Object.values(countryData.currencies)[0]?.name
    : "N/A";
  const languages = countryData?.languages
    ? Object.values(countryData.languages).slice(0, 2)
    : [];
  const population = countryData?.population
    ? (countryData.population / 1000000).toFixed(1)
    : "N/A";
  const capital = countryData?.capital?.[0] || "N/A";

  const continent = countryData.continents?.[0] || "N/A";
  const timezone = countryData.timezones?.[0] || "N/A";
  const currencyCode = countryData.currencies
    ? Object.keys(countryData.currencies)[0]
    : null;

  const latlngArr = Array.isArray(countryData?.latlng)
    ? countryData.latlng
    : [];
  const countryLatitude =
    typeof latlngArr[0] === "number" ? latlngArr[0] : null;
  const countryLongitude =
    typeof latlngArr[1] === "number" ? latlngArr[1] : null;

  const latNum = userLatitude !== null ? userLatitude : countryLatitude;
  const lonNum = userLongitude !== null ? userLongitude : countryLongitude;

  const mapImage = regionImage || backgroundImage;

  const accentColor = flagColors?.[0] || "#007aff";
  const accentColorHour = flagColors?.[1] || "#007aff";
  const accentColorText = flagColors?.[3] || "#fff";
  const isCityRegionSame =
    city && region && city.toLowerCase() === region.toLowerCase();

  // Export these for use in other components
  (global as any).flagAccentColor = accentColor;
  (global as any).flagAccentColorHour = accentColorHour;

  return (
    <View style={{ flex: 1 }}>
      {backgroundImage && (
        <Image
          source={{ uri: backgroundImage }}
          style={{
            position: "absolute",
            width,
            height,
            top: 0,
            left: 0,
            opacity: 0.88,
            zIndex: -1,
          }}
          blurRadius={3}
        />
      )}

      <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
        <StatusBar hidden />
        <ScrollView style={{ flex: 1 }} scrollEventThrottle={16}>
          {/* Mapa con imagen de región */}
          <View
            style={{
              height: 180,
              marginHorizontal: 12,
              borderRadius: 16,
              overflow: "hidden",
              backgroundColor: "#f0f0f0",
              borderWidth: 1,
              borderColor: "#1a1a1a",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 8,
              marginTop: 16,
            }}
          >
            <Pressable
              onPress={() => {
                if (latNum !== null && lonNum !== null) {
                  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${latNum},${lonNum}`;
                  Linking.openURL(mapsUrl).catch((err) =>
                    console.log("Error opening Google Maps:", err)
                  );
                }
              }}
              style={{
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {mapImage ? (
                <Image
                  source={{ uri: mapImage }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              ) : (
                <MapIcon color="#1a1a1a" size={64} />
              )}
            </Pressable>
          </View>

          {/* Nombre del país */}
          <View
            style={{ paddingHorizontal: 12, marginTop: 12, marginBottom: 12 }}
          >
            <Text
              style={{
                fontSize: 36,
                fontWeight: "700",
                color: accentColor,
                marginBottom: 8,
                letterSpacing: -0.5,
                textAlign: "center",
              }}
            >
              {countryName}
            </Text>
          </View>

          {/* Bandera */}
          <View
            style={{
              height: 200,
              overflow: "hidden",
              backgroundColor: "#fff",
              borderRadius: 16,
              marginHorizontal: 12,

              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            {flagImage && (
              <Image
                source={{ uri: flagImage }}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            )}
          </View>

          {/* Local Time */}
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            <View
              style={{
                flex: 1,
                backgroundColor: accentColorHour,
                borderRadius: 16,
                padding: 10,
                marginHorizontal: 6,
                marginVertical: 12,
                borderWidth: 1,
                borderColor: accentColorHour,
                alignItems: "center",
                justifyContent: "center",
                minHeight: 100,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: accentColor,
                  fontWeight: "600",
                  marginBottom: 10,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  textAlign: "center",
                }}
              >
                Local Time
              </Text>
              <Text
                style={{
                  fontSize: 54,
                  color: accentColor,
                  fontWeight: "bold",
                  letterSpacing: 2,
                  textAlign: "center",
                }}
              >
                {currentTime ? currentTime : "Loading..."}
              </Text>
            </View>
          </View>

          <View style={{ paddingHorizontal: 12 }}>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              <DataCard
                label="Capital"
                value={capital}
                onPress={() => capital !== "N/A" && openWikipedia(capital)}
                accentColor={accentColor}
                textColor={accentColorText}
              />
              <DataCard
                label="Currency"
                value={currencies}
                onPress={() => setCurrencyModalVisible(true)}
                accentColor={accentColor}
                textColor={accentColorText}
              />
            </View>

            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              <DataCard
                label="Languages"
                value={languages.length > 0 ? languages.join(", ") : "N/A"}
                onPress={() =>
                  languages.length > 0 && openGoogleTranslate(languages[0])
                }
                accentColor={accentColor}
                textColor={flagColors?.[3] || "#fff"}
              />
              <DataCard
                label="Population"
                value={`${population}M`}
                onPress={undefined}
                accentColor={accentColor}
                textColor={flagColors?.[3] || "#fff"}
              />
            </View>

            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              <DataCard
                label="Continent"
                value={continent}
                onPress={() => continent !== "N/A" && openWikipedia(continent)}
                accentColor={accentColor}
                textColor={flagColors?.[3] || "#fff"}
              />
              <DataCard
                label="Timezone"
                value={timezone}
                onPress={undefined}
                accentColor={accentColor}
                textColor={flagColors?.[3] || "#fff"}
              />
            </View>

            {isCityRegionSame ? (
              <DataCard
                label="City / Region"
                value={city}
                onPress={() => city && city !== "N/A" && openWikipedia(city)}
                accentColor={accentColor}
                textColor={flagColors?.[3] || "#fff"}
              />
            ) : (
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                <DataCard
                  label="City"
                  value={city || "N/A"}
                  onPress={() => city && city !== "N/A" && openWikipedia(city)}
                  accentColor={accentColor}
                  textColor={flagColors?.[3] || "#fff"}
                />
                <DataCard
                  label="Region"
                  value={region || "N/A"}
                  onPress={() =>
                    region && region !== "N/A" && openWikipedia(region)
                  }
                  accentColor={accentColor}
                  textColor={flagColors?.[3] || "#fff"}
                />
              </View>
            )}

            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              <DataCard
                label="Weather"
                value="Tap to view"
                onPress={() => setWeatherModalVisible(true)}
                accentColor={accentColor}
                textColor={flagColors?.[3] || "#fff"}
              />
            </View>
          </View>

          {/* Colores de la bandera detectados */}
          {flagColors && (
            <View style={{ flexDirection: "row", marginVertical: 8 }}>
              {flagColors.map((color, idx) => (
                <View
                  key={idx}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: color,
                    marginRight: 8,
                    borderWidth: 1,
                    borderColor: "#ccc",
                  }}
                />
              ))}
            </View>
          )}

          <View style={{ height: 20 }} />
        </ScrollView>

        <WeatherModal
          visible={weatherModalVisible}
          onClose={() => setWeatherModalVisible(false)}
          latitude={latNum}
          longitude={lonNum}
          cityName={city || capital}
        />
        <CurrencyModal
          visible={currencyModalVisible}
          onClose={() => setCurrencyModalVisible(false)}
          currency={currencyCode}
        />
      </SafeAreaView>
    </View>
  );
}
