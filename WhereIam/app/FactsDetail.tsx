import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Image, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useLocation } from "@/context/LocationContext";
import { getReadableTextColor } from "@/constants/functions";
import { GoogleGenAI } from "@google/genai";
import { SafeAreaView } from "react-native-safe-area-context";
import TextView from "@/components/textView";
import { getFromCache, setOnCache } from "@/constants/cache";
import { BackButton } from "@/components/BackButton";
import { FONT_SIZE, SPACING } from "@/constants/theme";

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
    if (!queryName || !locationName || !label) return;
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const cachedData = await getFromCache(label, "facts", locationName);
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
          await setOnCache(text, label, "facts", locationName);
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
  }, [queryName, locationName, label]);
  console.log(response?.text);
  const array = (response ?? "").split("#$");

  return (
    <View style={{ flex: 1 }}>
      {bgToUse && (
        <Image
          source={{ uri: bgToUse }}
          style={StyleSheet.absoluteFillObject}
          blurRadius={8}
        />
      )}

      <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
        <BackButton colorButton={buttonColor} />
        <View style={styles.body}>
          <View style={styles.titleWrapper}>
            <Text style={styles.titleLabel}>FACTS ABOUT</Text>
            <Text style={[styles.titleMain, { color: primary }]}>
              {query || label}
            </Text>
          </View>

          {loading && <ActivityIndicator size="large" color={primary} />}

          {error && !loading && (
            <Text style={{ color: "red", textAlign: "center" }}>Error: {error}</Text>
          )}

          {!loading && response && (
            <TextView
              texts={array}
              bulletColor={primary}
              textColor="rgba(255,255,255,0.92)"
              containerBg="rgba(0,0,0,0.30)"
            />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: SPACING.xxl,
    paddingTop: SPACING.xxl,
  },
  titleWrapper: {
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingBottom: 70,
  },
  titleLabel: {
    fontSize: FONT_SIZE.label,
    fontWeight: "600",
    letterSpacing: 3,
    color: "rgba(255,255,255,0.6)",
    marginBottom: SPACING.sm,
  },
  titleMain: {
    fontSize: FONT_SIZE.headline,
    fontWeight: "800",
    letterSpacing: -0.5,
    textAlign: "center",
  },
});
