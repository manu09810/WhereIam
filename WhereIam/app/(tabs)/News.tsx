import DataCard from "@/components/Datacard";
import { useLocation } from "@/context/LocationContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useAudioPlayer } from "expo-audio";
import { deleteGeneralCache } from "@/constants/cache";
import {
  Image,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// @ts-ignore
const { iso6392 } = require("iso-639-2");
const source = require("../../assets/sounds/confirm-tap-394001.mp3");

const getReadableTextColor = (hex: string) => {
  if (!hex || hex.length < 7) return "#111";
  const r = parseInt(hex.substr(1, 2), 16) / 255;
  const g = parseInt(hex.substr(3, 2), 16) / 255;
  const b = parseInt(hex.substr(5, 2), 16) / 255;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.55 ? "#111111" : "#ffffff";
};

export default function News() {
  const player = useAudioPlayer(source);
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
  const trackOn = `${switchColor}`;

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

  return (
    <SafeAreaView style={styles.container}>
      {backgroundImage && (
        <Image
          source={{ uri: backgroundImage }}
          style={StyleSheet.absoluteFillObject}
          blurRadius={3}
        />
      )}
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={[styles.titleMain, { color: primary }]}>
            News
          </Text>
          <Text style={[styles.titleSub, { color: buttonText }]}>
            Search local or international news
          </Text>

          <View style={styles.switchRow}>
            <Text
              numberOfLines={1}
              style={[styles.switchLabel, { color: buttonText }]}
            >
              {localNews ? "Local News" : "International"}
            </Text>
            <Switch
              value={localNews}
              onValueChange={() => {
                deleteGeneralCache(["country", "region", "city"], "news");
                setLocalNews(!localNews);
                setTimeout(() => {
                  player.seekTo(0);
                  player.play();
                }, 200);
              }}
              thumbColor={thumbOn}
              trackColor={{ false: "rgba(255,255,255,0.25)", true: trackOn }}
              style={{ flexShrink: 0 }}
            />
          </View>

          <View style={styles.buttonList}>
            <DataCard
              value={`Country: ${countryName}`}
              onPress={() =>
                router.push({
                  pathname: "/NewsDetail",
                  params: {
                    query: `"${countryName || ""}"`,
                    label: "country",
                    lang: localNews ? langCode : "en",
                    locationName: countryName,
                  },
                })
              }
              accentColor={primary}
              textColor={buttonText}
              height={56}
              block={true}
            />

            {isCityRegionSame ? (
              <DataCard
                value={`City / Region: ${regionName}`}
                onPress={() =>
                  router.push({
                    pathname: "/NewsDetail",
                    params: {
                      query: `"${regionName || ""}" ${countryName}`,
                      label: "city",
                      lang: localNews ? langCode : "en",
                      locationName: regionName,
                    },
                  })
                }
                accentColor={primary}
                textColor={buttonText}
                height={56}
                block={true}
              />
            ) : (
              <>
                <DataCard
                  value={`Region: ${regionName}`}
                  onPress={() =>
                    router.push({
                      pathname: "/NewsDetail",
                      params: {
                        query: `"${regionName || ""}" ${countryName}`,
                        label: "region",
                        lang: localNews ? langCode : "en",
                        locationName: regionName,
                      },
                    })
                  }
                  accentColor={primary}
                  textColor={buttonText}
                  height={56}
                  block={true}
                />
                <DataCard
                  value={`City: ${cityName}`}
                  onPress={() =>
                    router.push({
                      pathname: "/NewsDetail",
                      params: {
                        query: `"${cityName || ""}" ${regionName || ""} ${countryName}`,
                        label: "city",
                        lang: localNews ? langCode : "en",
                        locationName: cityName,
                      },
                    })
                  }
                  accentColor={primary}
                  textColor={buttonText}
                  height={56}
                  block={true}
                />
              </>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "rgba(0,0,0,0.36)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 24,
    paddingBottom: 16,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 8,
  },
  titleMain: {
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.5,
    textAlign: "center",
    marginBottom: 6,
  },
  titleSub: {
    fontSize: 15,
    textAlign: "center",
    opacity: 0.85,
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    gap: 10,
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: "600",
    width: 140,
    textAlign: "right",
  },
  buttonList: {
    width: "100%",
  },
});
