import { useLocation } from "@/context/LocationContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// @ts-ignore
const { iso6392 } = require("iso-639-2");

const getReadableTextColor = (hex: string) => {
  if (!hex || hex.length < 7) return "#111";
  const r = parseInt(hex.substr(1, 2), 16) / 255;
  const g = parseInt(hex.substr(3, 2), 16) / 255;
  const b = parseInt(hex.substr(5, 2), 16) / 255;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.55 ? "#111111" : "#ffffff";
};

export default function News() {
  const router = useRouter();
  const {
    countryData,
    city,
    region,
    backgroundImage,
    themeColors,
    averageColor,
    isoCountryCode,
  } = useLocation();
  const [localNews, setLocalNews] = useState(false);

  const primary = themeColors?.[0] || averageColor || "#007aff";
  const secondary = themeColors?.[4] || "#f2f2f2";
  const switchColor = themeColors?.[3] || "#34C759";
  const buttonText = getReadableTextColor(primary);
  const thumbOn = switchColor;
  const trackOn = `${switchColor}66`;

  const rawLangCode =
    countryData?.languages && Object.keys(countryData.languages)[0]
      ? Object.keys(countryData.languages)[0]
      : "en";

  const langCode =
    iso6392.find(
      (l: any) => l.iso6392B === rawLangCode || l.iso6392T === rawLangCode
    )?.iso6391 || "en";

  const countryName = countryData?.name?.common;
  const regionName = region;
  const cityName = city;

  const isCityRegionSame =
    cityName &&
    regionName &&
    cityName.toLowerCase() === regionName.toLowerCase();

  const rawCode = (isoCountryCode || countryData?.cca2 || "") as
    | string
    | undefined;
  // ensure we have a 2-letter ISO alpha-2 code, lowercase
  const countryCode =
    rawCode && rawCode.length >= 2 ? rawCode.slice(0, 2).toLowerCase() : null;
  const countriesProp = countryCode ? [countryCode] : [];
  const selectedColor =
    (themeColors && themeColors[0]) || averageColor || primary || "#ff0000";

  console.log("worldmap debug:", {
    isoCountryCode,
    countryDataCode: countryData?.cca2,
    countryCode,
    countriesProp,
    selectedColor,
    themeColors,
  });
  // --- end replaced ---

  return (
    <SafeAreaView style={[styles.container]}>
      {backgroundImage && (
        <Image
          source={{ uri: backgroundImage }}
          style={StyleSheet.absoluteFillObject}
          blurRadius={3}
        />
      )}
      <View style={styles.content}>
        <View style={[styles.titleWrapper, { borderColor: secondary }]}>
          <Text style={[styles.titleMain, { color: primary }]}>
            News Search
          </Text>
          <Text style={[styles.titleSub, { color: buttonText }]}>
            Search local or international news
          </Text>

          <View style={styles.switchRow}>
            <View style={{ height: 24, width: 180, justifyContent: "center" }}>
              <Text
                numberOfLines={1}
                style={[styles.switchLabel, { color: buttonText }]}
              >
                {localNews ? "Local News" : "International News"}
              </Text>
            </View>
            <Switch
              value={localNews}
              onValueChange={setLocalNews}
              thumbColor={thumbOn}
              trackColor={{ false: "#ccc", true: trackOn }}
              style={{ flexShrink: 0 }}
            />
          </View>
          <View style={{ width: "100%" }}>
            <NewsButton
              label="Country News"
              value={countryName}
              onPress={() =>
                router.push({
                  pathname: "/NewsDetail",
                  params: {
                    query: `"${countryName || ""}"`,
                    label: "Country",
                    lang: localNews ? langCode : "en",
                  },
                })
              }
              accentColor={primary}
              textColor={buttonText}
            />
            {isCityRegionSame ? (
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.largeButton,
                  { backgroundColor: primary },
                ]}
                onPress={() =>
                  router.push({
                    pathname: "/NewsDetail",
                    params: {
                      query: `"${regionName || ""}" ${countryName}`,
                      label: "City / Region",
                      lang: localNews ? langCode : "en",
                    },
                  })
                }
              >
                <Text style={[styles.buttonText, { color: buttonText }]}>
                  City / Region News: {regionName}
                </Text>
              </TouchableOpacity>
            ) : (
              <>
                <NewsButton
                  label="Region News"
                  value={regionName}
                  onPress={() =>
                    router.push({
                      pathname: "/NewsDetail",
                      params: {
                        query: `"${regionName || ""}" ${countryName}`,
                        label: "Region",
                        lang: localNews ? langCode : "en",
                      },
                    })
                  }
                  accentColor={primary}
                  textColor={buttonText}
                />
                <NewsButton
                  label="City News"
                  value={cityName}
                  onPress={() =>
                    router.push({
                      pathname: "/NewsDetail",
                      params: {
                        query: `"${cityName || ""}" ${
                          regionName || ""
                        } ${countryName}`,
                        label: "City",
                        lang: localNews ? langCode : "en",
                      },
                    })
                  }
                  accentColor={primary}
                  textColor={buttonText}
                />
              </>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function NewsButton({
  label,
  value,
  onPress,
  accentColor = "#007aff",
  textColor = "#fff",
}: {
  label: string;
  value?: string | null;
  onPress: () => void;
  accentColor?: string;
  textColor?: string;
}) {
  if (!value) return null;
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: accentColor }]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, { color: textColor }]}>
        {label}: {value}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  mapWrapper: {
    height: 180,
    paddingHorizontal: 24,
    marginTop: 8,
  },
  mapContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    // Android elevation
    elevation: 4,
  },
  mapInnerWrapper: {
    flex: 1,
    width: "100%",
    height: "100%",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  // (opcional) estilos por defecto para el highlight si quieres cambiar aquí
  countryHighlight: {
    position: "absolute",
    left: "50%",
    top: "50%",
    pointerEvents: "none",
  },
  mapInner: {
    // mapInnerStyle (width/height/transform) se aplica dinámicamente
    alignSelf: "flex-start",
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  titleWrapper: {
    backgroundColor: "rgba(0,0,0,0.8)",

    borderWidth: 8,
    alignItems: "center",
    marginBottom: 18,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  titleMain: {
    marginTop: 16,
    opacity: 1,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
    textAlign: "center",
  },
  titleSub: {
    fontSize: 20,
    marginTop: 6,
    opacity: 0.9,
    textAlign: "center",
    marginBottom: 15,
  },
  titleAccent: {
    height: 6,
    width: 96,
    borderRadius: 3,
    marginTop: 12,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    justifyContent: "center",
  },
  switchLabel: {
    fontSize: 16,
    marginRight: 12,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#007aff",
    padding: 18,
    borderRadius: 10,
    marginBottom: 18,
  },
  largeButton: {
    padding: 28,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
    fontSize: 17,
  },
});
