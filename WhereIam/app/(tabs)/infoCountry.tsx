import { Image } from "expo-image";
import { Platform, StyleSheet, ActivityIndicator, View } from "react-native";

import { HelloWave } from "@/components/hello-wave";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Link } from "expo-router";
import { ScrollView, Text } from "react-native";
import { useLocation } from "@/context/LocationContext";

export default function HomeScreen() {
  const { isoCountryCode, isLoadingLocation, locationError } = useLocation();

  if (isLoadingLocation) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ color: "#000", marginTop: 10 }}>
          Obteniendo ubicación...
        </Text>
      </View>
    );
  }

  if (locationError) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <Text style={{ color: "#ff0000", fontSize: 18 }}>
          Error: {locationError}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      <Text style={{ fontSize: 24, color: "#000", fontWeight: "bold" }}>
        País: {isoCountryCode}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
