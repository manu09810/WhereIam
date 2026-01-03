import React, { useEffect, useState } from "react";
import TextView from "@/components/textView";
import {
  Platform,
  StyleSheet,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GoogleGenAI } from "@google/genai";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Link } from "expo-router";
import { useLocation } from "@/context/LocationContext";

// inicializa el cliente top-level (usa tu variable de entorno Expo)
const ai = new GoogleGenAI({
  apiKey: process.env.EXPO_PUBLIC_GOOGLE_API_GEMINI_KEY,
});

export default function Facts() {
  const value = useLocation();
  const { backgroundImage, averageColor } = value;
  const { countryData } = value; // moved inside component
  const countryName = countryData?.name?.common;
  const [response, setResponse] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!countryData?.name) {
      // espera a que countryData esté disponible
      return;
    }
    let mounted = true;
    (async () => {
      try {
        const res = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `Give 5 facts curiosity of ${countryName}, each one must be of about 50 caracters`,
        });
        if (mounted) setResponse(res); // guardar el objeto entero
      } catch (e: any) {
        if (mounted) setErr(e?.message ?? String(e));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [countryData?.name]); // re-ejecuta cuando cambie countryData
  console.log(response);

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
      

      {loading && <Text>Loading...</Text>}
      {err && <Text>Error: {err}</Text>}
      {response && <Text>{response.text}</Text>}
      <TextView />

      <ScrollView contentContainerStyle={styles.content}></ScrollView>
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
