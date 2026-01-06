import React from "react";
import DataCard from "@/components/Datacard";
import { useLocation } from "@/context/LocationContext";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getReadableTextColor } from "@/constants/functions";

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
  const secondary = themeColors?.[4] || "#f2f2f2";
  const buttonText = getReadableTextColor(primary);

  const countryName = countryData?.name?.common || "";
  const regionName = region || "";
  const cityName = city || "";

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
          <Text style={[styles.titleMain, { color: primary }]}>Facts</Text>
          <Text style={[styles.titleSub, { color: buttonText }]}>
            Facts about each site
          </Text>

          <View style={{ width: "100%", paddingHorizontal: 6, marginTop: 16 }}>
            <DataCard
              value={`Country Facts: ${countryName || "—"}`}
              onPress={() =>
                router.push({
                  pathname: "/FactsDetail",
                  params: {
                    query: countryName || "",
                    label: "country",
                  },
                })
              }
              accentColor={primary}
              textColor={buttonText}
              height={50}
              block={true}
            />

            <DataCard
              value={`Region Facts: ${regionName || "—"}`}
              onPress={() =>
                router.push({
                  pathname: "/FactsDetail",
                  params: {
                    query: regionName + ", " + countryName,
                    label: "region",
                  },
                })
              }
              accentColor={primary}
              textColor={buttonText}
              height={50}
              block={true}
            />

            <DataCard
              value={`City Facts: ${cityName || "—"}`}
              onPress={() =>
                router.push({
                  pathname: "/FactsDetail",
                  params: {
                    query: cityName + ", " + countryName,
                    label: "city",
                  },
                })
              }
              accentColor={primary}
              textColor={buttonText}
              height={50}
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
    padding: 24,
    justifyContent: "center",
  },
  titleWrapper: {
    backgroundColor: "rgba(0,0,0,0.6)",
    borderWidth: 8,
    alignItems: "center",
    marginBottom: 18,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  titleMain: {
    marginTop: 16,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
    textAlign: "center",
  },
  titleSub: {
    fontSize: 18,
    marginTop: 6,
    textAlign: "center",
    marginBottom: 12,
  },
});
