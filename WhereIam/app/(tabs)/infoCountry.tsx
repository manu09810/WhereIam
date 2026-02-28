import { CurrencyModal } from "@/components/CurrencyModal";
import { WeatherModal } from "@/components/WeatherModal";
import { TranslateModal } from "@/components/TranslateModal";
import { useLocation } from "@/context/LocationContext";
import DataCard from "@/components/Datacard";

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
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const getReadableTextColor = (hex: string) => {
  if (!hex || hex.length < 7) return "#ffffff";
  const r = parseInt(hex.substr(1, 2), 16) / 255;
  const g = parseInt(hex.substr(3, 2), 16) / 255;
  const b = parseInt(hex.substr(5, 2), 16) / 255;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.55 ? "#111111" : "#ffffff";
};

const contrastRatio = (fg: string, bg: string) => {
  const toL = (hex: string) => {
    const r = parseInt(hex.substr(1, 2), 16) / 255;
    const g = parseInt(hex.substr(3, 2), 16) / 255;
    const b = parseInt(hex.substr(5, 2), 16) / 255;
    const c = [r, g, b].map((v) =>
      v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    );
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const L1 = toL(fg) + 0.05;
  const L2 = toL(bg) + 0.05;
  return L1 > L2 ? L1 / L2 : L2 / L1;
};

const pickAccessibleTextColor = (bg: string, preferred?: string) => {
  const fallback = getReadableTextColor(bg);
  if (preferred && contrastRatio(preferred, bg) >= 3) return preferred;
  return fallback;
};

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
    themeColors,
    averageColor,
  } = useLocation();

  const countryName = countryData?.name?.common || "N/A";
  const [weatherModalVisible, setWeatherModalVisible] = useState(false);
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [translateModalVisible, setTranslateModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string | null>(null);

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
        timeZone: tz,
      });
      setCurrentTime(time);
    } catch (error) {
      setCurrentTime(null);
      console.log("Error fetching time:", error);
    }
  };

  const openWikipedia = (query) => {
    const wikipediaUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`;
    Linking.openURL(wikipediaUrl).catch((err) =>
      console.log("Error opening Wikipedia:", err)
    );
  };

  const openGoogleMaps = (query: string): void => {
    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
    Linking.openURL(mapsUrl).catch((err: Error) =>
      console.log("Error opening Google Maps:", err)
    );
  };

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

  const latlngArr = Array.isArray(countryData?.latlng) ? countryData.latlng : [];
  const countryLatitude = typeof latlngArr[0] === "number" ? latlngArr[0] : null;
  const countryLongitude = typeof latlngArr[1] === "number" ? latlngArr[1] : null;
  const latNum = userLatitude !== null ? userLatitude : countryLatitude;
  const lonNum = userLongitude !== null ? userLongitude : countryLongitude;

  const mapImage = regionImage || backgroundImage;

  const accentColor = themeColors?.[0] || "#007aff";
  const accentColorHour = themeColors?.[1] || "#007aff";
  const accentColorText = themeColors?.[3] || getReadableTextColor(accentColor);
  const accentColorTimeText = getReadableTextColor(accentColorHour);
  const isLightHour = accentColorTimeText === "#111111";
  const dimmedTimeText = isLightHour
    ? "rgba(17,17,17,0.5)"
    : "rgba(255,255,255,0.58)";

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

          {/* ── Country Hero: flag + name overlay ── */}
          <Pressable
            onPress={() => openWikipedia(countryName)}
            style={{
              height: 240,
              marginHorizontal: 12,
              marginTop: 16,
              marginBottom: 6,
              borderRadius: 22,
              overflow: "hidden",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.28,
              shadowRadius: 16,
              elevation: 10,
            }}
          >
            {flagImage ? (
              <Image
                source={{ uri: flagImage }}
                style={{ position: "absolute", width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            ) : (
              <View style={{ flex: 1, backgroundColor: accentColor }} />
            )}
            {/* Dark gradient at bottom for text legibility */}
            <Svg
              pointerEvents="none"
              style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "70%" }}
              width="100%"
              height="100%"
            >
              <Defs>
                <LinearGradient id="flagGrad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor="#000000" stopOpacity="0" />
                  <Stop offset="1" stopColor="#000000" stopOpacity="0.65" />
                </LinearGradient>
              </Defs>
              <Rect width="100%" height="100%" fill="url(#flagGrad)" />
            </Svg>
            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: 18,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,0.6)",
                  fontWeight: "700",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                Country
              </Text>
              <Text
                style={{
                  fontSize: 30,
                  color: "#fff",
                  fontWeight: "800",
                  letterSpacing: -0.5,
                  textShadowColor: "rgba(0,0,0,0.4)",
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 6,
                }}
              >
                {countryName}
              </Text>
            </View>
          </Pressable>

          {/* ── Map Widget ── */}
          <View
            style={{
              height: 170,
              marginHorizontal: 12,
              marginBottom: 6,
              borderRadius: 18,
              overflow: "hidden",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 10,
              elevation: 5,
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
                backgroundColor: "#d0d0d0",
              }}
            >
              {mapImage ? (
                <Image
                  source={{ uri: mapImage }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              ) : (
                <MapIcon color="#888" size={56} />
              )}
              {/* Open Maps pill */}
              <View
                pointerEvents="none"
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  backgroundColor: "rgba(0,0,0,0.48)",
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 20,
                }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 11, fontWeight: "600" }}
                >
                  Open Maps
                </Text>
              </View>
            </Pressable>
          </View>

          {/* ── Local Time ── */}
          <View
            style={{
              marginHorizontal: 12,
              marginBottom: 6,
              backgroundColor: accentColorHour,
              borderRadius: 18,
              padding: 18,
              borderWidth: 1,
              borderColor: isLightHour
                ? "rgba(0,0,0,0.07)"
                : "rgba(255,255,255,0.2)",
              shadowColor: accentColorHour,
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 6,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            {/* Top highlight */}
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "45%",
                backgroundColor: isLightHour
                  ? "rgba(255,255,255,0.45)"
                  : "rgba(255,255,255,0.1)",
                borderTopLeftRadius: 18,
                borderTopRightRadius: 18,
              }}
            />
            <View>
              <Text
                style={{
                  fontSize: 10,
                  color: dimmedTimeText,
                  fontWeight: "700",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                Local Time
              </Text>
              <Text
                style={{
                  fontSize: 52,
                  color: accentColorTimeText,
                  fontWeight: "800",
                  letterSpacing: -1,
                }}
              >
                {currentTime ?? "--:--"}
              </Text>
            </View>
            {timezone !== "N/A" && (
              <Text
                style={{
                  fontSize: 12,
                  color: dimmedTimeText,
                  fontWeight: "600",
                  maxWidth: 90,
                  textAlign: "right",
                }}
              >
                {timezone}
              </Text>
            )}
          </View>

          {/* ── Data Grid ── */}
          <View style={{ paddingHorizontal: 6 }}>
            <View style={{ flexDirection: "row" }}>
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

            <View style={{ flexDirection: "row" }}>
              <DataCard
                label="Languages"
                value={languages.length > 0 ? languages.join(", ") : "N/A"}
                onPress={() => {
                  if (languages.length > 0) {
                    const langCodes = countryData?.languages
                      ? Object.keys(countryData.languages)
                      : [];
                    setSelectedLanguage(langCodes[0] || "es");
                    setTranslateModalVisible(true);
                  }
                }}
                accentColor={accentColor}
                textColor={accentColorText}
              />
              <DataCard
                label="Population"
                value={`${population}M`}
                onPress={undefined}
                accentColor={accentColor}
                textColor={accentColorText}
              />
            </View>

            <View style={{ flexDirection: "row" }}>
              <DataCard
                label="Continent"
                value={continent}
                onPress={() => continent !== "N/A" && openWikipedia(continent)}
                accentColor={accentColor}
                textColor={accentColorText}
              />
              <DataCard
                label="Timezone"
                value={timezone}
                onPress={undefined}
                accentColor={accentColor}
                textColor={accentColorText}
              />
            </View>

            {isCityRegionSame ? (
              <DataCard
                label="City / Region"
                value={city}
                onPress={() => city && city !== "N/A" && openWikipedia(city)}
                accentColor={accentColor}
                textColor={accentColorText}
                block={true}
              />
            ) : (
              <View style={{ flexDirection: "row" }}>
                <DataCard
                  label="City"
                  value={city || "N/A"}
                  onPress={() => city && city !== "N/A" && openWikipedia(city)}
                  accentColor={accentColor}
                  textColor={accentColorText}
                />
                <DataCard
                  label="Region"
                  value={region || "N/A"}
                  onPress={() =>
                    region && region !== "N/A" && openWikipedia(region)
                  }
                  accentColor={accentColor}
                  textColor={accentColorText}
                />
              </View>
            )}

            <DataCard
              label="Weather"
              value="Tap to view"
              onPress={() => setWeatherModalVisible(true)}
              accentColor={accentColor}
              textColor={accentColorText}
              block={true}
              height={60}
            />
          </View>

          <View style={{ height: 24 }} />
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
        {selectedLanguage && (
          <TranslateModal
            visible={translateModalVisible}
            onClose={() => setTranslateModalVisible(false)}
            language={selectedLanguage}
            textLanguage={languages.length > 0 ? languages.join(", ") : "N/A"}
          />
        )}
      </SafeAreaView>
    </View>
  );
}
