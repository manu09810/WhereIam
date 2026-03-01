import React from "react";
import DataCard from "@/components/Datacard";
import { useLocation } from "@/context/LocationContext";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getReadableTextColor } from "@/constants/functions";
import {
  ALPHA,
  FONT_SIZE,
  RADIUS,
  SHADOW,
  SPACING,
} from "@/constants/theme";

export default function Facts() {
  const router = useRouter();
  const {
    countryData,
    city,
    region,
    backgroundImage,
    themeColors,
    averageColor,
  } = useLocation();
  const primary = themeColors?.[0] || averageColor || "#007aff";
  const buttonText = getReadableTextColor(primary);
  const countryName = countryData?.name?.common || "";
  const regionName = region || "";
  const cityName = city || "";

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
          <Text style={[styles.titleMain, { color: primary }]}>Facts</Text>
          <Text style={[styles.titleSub, { color: buttonText }]}>
            Explore facts about each location
          </Text>

          <View style={styles.buttonList}>
            <DataCard
              value={`Country: ${countryName || "—"}`}
              onPress={() =>
                router.push({
                  pathname: "/FactsDetail",
                  params: {
                    query: countryName || "",
                    label: "country",
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
                  pathname: "/FactsDetail",
                  params: {
                    query: regionName + ", " + countryName,
                    label: "region",
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
                  pathname: "/FactsDetail",
                  params: {
                    query: cityName + ", " + countryName,
                    label: "city",
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
  buttonList: {
    width: "100%",
  },
});
