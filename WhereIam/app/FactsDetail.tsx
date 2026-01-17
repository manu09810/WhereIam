import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Image, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useLocation } from "@/context/LocationContext";
import { getReadableTextColor } from "@/constants/functions";
import { GoogleGenAI } from "@google/genai";
import { SafeAreaView } from "react-native-safe-area-context";
import TextView from "@/components/textView";
import AsyncStorage from "@react-native-async-storage/async-storage";
const ai = new GoogleGenAI({
  apiKey: process.env.EXPO_PUBLIC_GOOGLE_API_GEMINI_KEY,
});

export default function FactsDetail() {
  const { query, label, locationName } = useLocalSearchParams<{
    query?: string;
    label?: string;
    locationName: string;
  }>();
  const {
    backgroundImage,
    regionImage,
    themeColors,
    averageColor,
    countryData,
  } = useLocation();

  const bgToUse =
    label === "country" ? backgroundImage : regionImage || backgroundImage;

  const primary = themeColors?.[0] || averageColor || "#007aff";
  const secundary = themeColors?.[1] || averageColor || "#007aff";
  const pageBg = averageColor || "#fff";
  const cardBg = themeColors?.[3] || "#f2f2f2";
  const buttonColor = getReadableTextColor(primary);

  const [response, setResponse] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const queryName = (query as string) || countryData?.name?.common;

  useEffect(() => {
    if (!queryName) return;
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const cachedData = await AsyncStorage.getItem(locationName);
        if (cachedData && mounted) {
          setResponse(cachedData);
          setLoading(false);
          return;
        }
        const res = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `Give 5 hyper interesting and easy to average user about ${queryName}. THINK HARD about Each fact should be ~100 characters.
and facts should separated by #$`,
        });
        if (mounted) {
          const text = res.text ?? "";
          setResponse(text);
          await AsyncStorage.setItem(locationName, text);
        }
      } catch (e: any) {
        if (mounted) setError(e?.message ?? String(e));
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [queryName, locationName]);
  console.log(response?.text);
  const array = (response ?? "").split("#$");

  return (
    <View style={{ flex: 1 }}>
      {bgToUse && (
        <Image
          source={{ uri: bgToUse }}
          style={StyleSheet.absoluteFillObject}
          blurRadius={3}
        />
      )}

      <SafeAreaView style={[{ flex: 1, backgroundColor: "transparent" }]}>
        <Text
          style={[styles.backButton, { color: buttonColor }]}
          onPress={() => router.back()}
        >
          ← Back
        </Text>
        <View style={[styles.titleWrapper]}>
          <Text style={[styles.titleMain, { color: primary }]}>
            Facts from {query || label}
          </Text>
        </View>
        {loading && (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color={primary} />
          </View>
        )}

        {error && !loading && (
          <View style={{ padding: 16 }}>
            <Text style={{ color: "red" }}>Error: {error}</Text>
          </View>
        )}

        {!loading && response && (
          <View style={{ padding: 16 }}>
            <TextView texts={array} bulletColor={primary} />
          </View>
        )}

        <View style={styles.bottomContainer}></View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  titleWrapper: {
    backgroundColor: "rgba(0,0,0,0.6)",
    borderWidth: 8,
    alignItems: "center",
    marginBottom: 18,
    paddingHorizontal: 6,
    borderRadius: 10,
    marginTop: 80,
    paddingVertical: 12,
  },
  titleMain: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
    textAlign: "center",
  },
  bottomContainer: {
    padding: 16,
    alignItems: "center",
    marginTop: "auto",
  },
  backButton: {
    fontSize: 16,
    fontWeight: "600",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});
