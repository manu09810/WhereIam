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
  } = useLocation();
  const [localNews, setLocalNews] = useState(false);

  const primary = themeColors?.[0] || averageColor || "#007aff";
  const secondary = themeColors?.[1] || "#f2f2f2";
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

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: averageColor || "#fff" }]}
    >
      {backgroundImage && (
        <Image
          source={{ uri: backgroundImage }}
          style={StyleSheet.absoluteFillObject}
          blurRadius={3}
        />
      )}
      <View style={styles.content}>
        {/* Título como DataCard */}
        <View
          style={{
            backgroundColor: primary,
            borderRadius: 16,
            padding: 20,
            marginHorizontal: 12,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: primary,
            alignItems: "center",
            justifyContent: "center",
            minHeight: 100,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontWeight: "700",
              color: buttonText,
              letterSpacing: -0.5,
              textAlign: "center",
            }}
          >
            News Search
          </Text>
        </View>

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
          />
        </View>
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
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 32,
    textAlign: "center",
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
