import React from "react";
import TextView from "@/components/textView";
import DataCard from "@/components/Datacard";
import {
  Platform,
  StyleSheet,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Link, useRouter } from "expo-router";
import { useLocation } from "@/context/LocationContext";
import { getReadableTextColor } from "@/constants/functions";

export default function Facts() {
  const value = useLocation();
  const router = useRouter();
  const { backgroundImage, averageColor, themeColors } = value;
  const { countryData, city, region } = value;
  const countryName = countryData?.name?.common;
  const primary = themeColors?.[0] || averageColor || "#007aff";
  const secondary = themeColors?.[4] || "#f2f2f2";

  const buttonText = getReadableTextColor(primary);

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

      <DataCard
        value={`Country Facts: ${countryName || "—"}`}
        onPress={() =>
          router.push({
            pathname: "/FactsDetail",
            params: {
              query: countryName || "",
              label: "Data",
            },
          })
        }
        accentColor={primary}
        textColor={buttonText}
        height={50}
      />

      <DataCard
        value={`Region Facts: ${region || "—"}`}
        onPress={() =>
          router.push({
            pathname: "/FactsDetail",
            params: {
              query: region || "" + countryName || "",
              label: "Data",
            },
          })
        }
        accentColor={primary}
        textColor={buttonText}
        height={50}
      />
      <DataCard
        value={`City Facts: ${city || "—"}`}
        onPress={() =>
          router.push({
            pathname: "/FactsDetail",
            params: {
              query: city || "" + countryName || "",
              label: "Data",
            },
          })
        }
        accentColor={primary}
        textColor={buttonText}
        height={50}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
