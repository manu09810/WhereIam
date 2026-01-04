import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useLocation } from "@/context/LocationContext";
import { getReadableTextColor } from "@/constants/functions";
import { GoogleGenAI } from "@google/genai";
import { SafeAreaView } from "react-native-safe-area-context";
import TextView from "@/components/textView";

const ai = new GoogleGenAI({
  apiKey: process.env.EXPO_PUBLIC_GOOGLE_API_GEMINI_KEY,
});

export default function FactsDetail() {
  const { query, label, lang } = useLocalSearchParams<{
    query?: string;
    label?: string;
    lang?: string;
  }>();
  const {
    backgroundImage,
    regionImage,
    themeColors,
    averageColor,
    countryData,
  } = useLocation();
  const bgToUse =
    label === "Country" ? backgroundImage : regionImage || backgroundImage;

  const primary = themeColors?.[0] || averageColor || "#007aff";
  const pageBg = averageColor || "#fff";
  const cardBg = themeColors?.[3] || "#f2f2f2";

  const [response, setResponse] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const countryName = (query as string) || countryData?.name?.common;

  useEffect(() => {
    if (!countryName) return;
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `Give 5 hyper interesting facts about ${countryName}. THINK HARD Each fact should be ~100 characters.
only facts separated by -`,
        });
        if (mounted) setResponse(res);
      } catch (e: any) {
        if (mounted) setError(e?.message ?? String(e));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [countryName]);

  const array = (response?.text ?? "")
    .split("-")
    .map((s: string) => s.trim())
    .filter(Boolean);

  return (
    <>
      {bgToUse && (
        <Image
          source={{ uri: bgToUse }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.88,
            zIndex: -1,
          }}
          blurRadius={3}
        />
      )}
      <SafeAreaView style={{ flex: 1, backgroundColor: pageBg }}>
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

        {!loading && response?.text && (
          <View style={{ padding: 16 }}>
            <TextView texts={array} />
          </View>
        )}
      </SafeAreaView>
    </>
  );
}
