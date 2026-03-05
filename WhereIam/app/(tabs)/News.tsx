import DataCard from "@/components/Datacard";
import { useLocation } from "@/context/LocationContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useAudioPlayer } from "expo-audio";
import { deleteGeneralCache } from "@/constants/cache";
import { Image, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getReadableTextColor } from "@/constants/functions";
import {
  ALPHA,
  FONT_SIZE,
  RADIUS,
  SHADOW,
  SPACING,
  TIMING,
} from "@/constants/theme";
// @ts-ignore
const { iso6392 } = require("iso-639-2");
const source = require("../../assets/sounds/confirm-tap-394001.mp3");

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
  } = useLocation();
  const [localNews, setLocalNews] = useState(false);
  const primary = themeColors?.[0] || averageColor || "#007aff";
  const switchColor = themeColors?.[3] || "#34C759";
  const buttonText = getReadableTextColor(primary);
  const countryName = countryData?.name?.common;
  const regionName = region;
  const cityName = city;

  const rawLangCode =
    countryData?.languages && Object.keys(countryData.languages)[0]
      ? Object.keys(countryData.languages)[0]
      : "en";

  const langCode =
    iso6392.find(
      (l: any) => l.iso6392B === rawLangCode || l.iso6392T === rawLangCode,
    )?.iso6391 || "en";

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
          <Text style={[styles.titleMain, { color: primary }]}>News</Text>
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
                }, TIMING.switchDelay);
              }}
              thumbColor={switchColor}
              trackColor={{
                false: "rgba(255,255,255,0.25)",
                true: switchColor,
              }}
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

            <DataCard
              value={`Region: ${regionName || "—"}`}
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
              value={`City: ${cityName || "—"}`}
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
    padding: SPACING.xxxl,
    justifyContent: "center",
  },
  card: {
    backgroundColor: ALPHA.glassBg,
    borderWidth: 1,
    borderColor: ALPHA.darkCardBorder,
    alignItems: "center",
    paddingHorizontal: SPACING.container,
    paddingTop: SPACING.sheet,
    paddingBottom: SPACING.xxl,
    borderRadius: RADIUS.page,
    ...SHADOW.card,
  },
  titleMain: {
    fontSize: FONT_SIZE.display,
    fontWeight: "800",
    letterSpacing: -0.5,
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  titleSub: {
    fontSize: FONT_SIZE.body,
    textAlign: "center",
    opacity: ALPHA.subtitle,
    marginBottom: SPACING.xxxl,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.container,
    gap: SPACING.lg,
  },
  switchLabel: {
    fontSize: FONT_SIZE.body,
    fontWeight: "600",
    width: 140,
    textAlign: "right",
  },
  buttonList: {
    width: "100%",
  },
});
