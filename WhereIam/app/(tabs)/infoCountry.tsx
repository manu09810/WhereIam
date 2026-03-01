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
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { getReadableTextColor } from "@/constants/functions";
import {
  ALPHA,
  FONT_SIZE,
  RADIUS,
  SHADOW,
  SIZE,
  SPACING,
} from "@/constants/theme";
import TimeWidget from "@/components/ui/TimeWidget";

const { width, height } = Dimensions.get("window");

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
  } = useLocation();

  const countryName = countryData?.name?.common || "N/A";
  const [weatherModalVisible, setWeatherModalVisible] = useState(false);
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [translateModalVisible, setTranslateModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const openWikipedia = (query: string) => {
    const wikipediaUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`;
    Linking.openURL(wikipediaUrl).catch((err) =>
      console.log("Error opening Wikipedia:", err),
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

  const accentColor = themeColors?.[0] || "#007aff";
  const accentColorHour = themeColors?.[1] || "#007aff";
  const accentColorText = themeColors?.[3] || getReadableTextColor(accentColor);

  const isCityRegionSame =
    city && region && city.toLowerCase() === region.toLowerCase();

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
            opacity: ALPHA.imageBg,
            zIndex: -1,
          }}
          blurRadius={3}
        />
      )}

      <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
        <StatusBar hidden />
        <ScrollView style={{ flex: 1 }} scrollEventThrottle={16}>
          {/* ── Hero: Map ── */}
          <Pressable
            onPress={() => {
              if (latNum !== null && lonNum !== null) {
                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${latNum},${lonNum}`;
                Linking.openURL(mapsUrl).catch((err) =>
                  console.log("Error opening Google Maps:", err),
                );
              }
            }}
            style={{
              height: SIZE.mapWidget,
              marginHorizontal: SPACING.container,
              marginBottom: SPACING.sm,
              borderRadius: RADIUS.widget,
              overflow: "hidden",
              ...SHADOW.widget,
              shadowColor: "#000",
            }}
          >
            {mapImage ? (
              <Image
                source={{ uri: mapImage }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            ) : (
              <View style={{ flex: 1, backgroundColor: accentColor }} />
            )}

            {/* Dark gradient at bottom */}
            <Svg
              pointerEvents="none"
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "60%",
              }}
              width="100%"
              height="100%"
            >
              <Defs>
                <LinearGradient id="mapGrad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor="#000000" stopOpacity="0" />
                  <Stop offset="1" stopColor="#000000" stopOpacity="0.65" />
                </LinearGradient>
              </Defs>
              <Rect width="100%" height="100%" fill="url(#mapGrad)" />
            </Svg>

            {/* Open Maps pill */}
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                top: SPACING.container,
                right: SPACING.container,
                backgroundColor: "rgba(0,0,0,0.48)",
                paddingHorizontal: SPACING.lg,
                paddingVertical: 5,
                borderRadius: RADIUS.large,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: FONT_SIZE.label,
                  fontWeight: "600",
                }}
              >
                Open Maps
              </Text>
            </View>
          </Pressable>

          {/* ── Local Time ── */}
          <TimeWidget
            timezone={
              locationTimezone ||
              countryData?.timezones?.find((tz) => tz.includes("/")) ||
              countryData?.timezones?.[0] ||
              "N/A"
            }
            accentColor={accentColorHour}
            flagImage={flagImage}
            countryName={countryName}
          />

          {/* ── Data Grid ── */}
          <View style={{ paddingHorizontal: SPACING.sm }}>
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

          <View style={{ height: SPACING.sheet }} />
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
