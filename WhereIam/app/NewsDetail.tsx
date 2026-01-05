import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocation } from "@/context/LocationContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { getReadableTextColor, shortenLink } from "@/constants/functions";

type NewsResult = {
  title: string;
  snippet: string;
  link: string;
};

type GoogleSearchItem = {
  title: string;
  snippet: string;
  link: string;
};

// Añadir helper para acortar links


export default function NewsDetail() {
  const { query, label, lang } = useLocalSearchParams<{
    query?: string;
    label?: string;
    lang?: string;
  }>();
  const { backgroundImage, regionImage, themeColors, averageColor } =
    useLocation();
  const bgToUse =
    label === "Country" ? backgroundImage : regionImage || backgroundImage;

  const primary = themeColors?.[0] || averageColor || "#007aff";
  const titleColor = primary;
  const pageBg = averageColor || "#fff";
  const cardBg = themeColors?.[3] || "#f2f2f2";
  const cardText = getReadableTextColor(cardBg);
  const textOnPrimary = getReadableTextColor(primary);

  const [results, setResults] = useState<NewsResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!query) return;

    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const lrParam = lang ? `&lr=lang_${lang}` : "";
        const url = `https://www.googleapis.com/customsearch/v1?key=${
          process.env.EXPO_PUBLIC_GOOGLE_API_KEY
        }&cx=${
          process.env.EXPO_PUBLIC_GOOGLE_SEARCH_ENGINE_ID
        }&q=${encodeURIComponent(query + " news")}${lrParam}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          setResults(
            data.items.map((item: GoogleSearchItem) => ({
              title: item.title,
              snippet: item.snippet,
              link: item.link,
            }))
          );
        } else {
          setResults([]);
          setError("No news found.");
        }
      } catch {
        setError("Failed to fetch news.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [query, lang]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: pageBg }]}>
      {bgToUse && (
        <Image
          source={{ uri: bgToUse }}
          style={StyleSheet.absoluteFillObject}
          blurRadius={3}
        />
      )}
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={[styles.backButton, { color: primary }]}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.titleWrapper}>
        <Text
          style={[
            styles.header,
            {
              color: titleColor,
              textShadowColor: `${primary}22`,
              textShadowRadius: 6,
              textShadowOffset: { width: 0, height: 2 },
            },
          ]}
        >
          {label} News
        </Text>
        {query ? (
          <Text
            style={[styles.subHeader, { color: getReadableTextColor(pageBg) }]}
          >
            {query}
          </Text>
        ) : null}
        <View style={[styles.titleAccent, { backgroundColor: primary }]} />
      </View>

      {loading && <ActivityIndicator color={primary} />}
      {error && <Text style={[styles.error, { color: primary }]}>{error}</Text>}
      {!loading && !error && results.length === 0 && (
        <Text style={[styles.emptyState, { color: cardText }]}>
          No results available
        </Text>
      )}
      {results.length > 0 && (
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          {results.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => Linking.openURL(item.link)}
            >
              <View
                style={[
                  styles.resultContainer,
                  { backgroundColor: cardBg, borderColor: `${primary}40` },
                ]}
              >
                <Text style={[styles.title, { color: cardText }]}>
                  {item.title}
                </Text>
                <Text style={[styles.snippet, { color: cardText }]}>
                  {item.snippet}
                </Text>
                <Text
                  style={[styles.link, { color: primary }]}
                  numberOfLines={1}
                  ellipsizeMode="middle"
                >
                  {shortenLink(item.link, 60)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: "#fff",
  },
  backButton: {
    fontSize: 16,
    marginBottom: 10,
    paddingVertical: 4,
  },
  titleWrapper: {
    alignItems: "center",
    marginBottom: 18,
    paddingHorizontal: 6,
  },
  header: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: -0.5,
  },
  subHeader: {
    fontSize: 13,
    marginTop: 6,
    opacity: 0.85,
    textAlign: "center",
  },
  titleAccent: {
    height: 6,
    width: 96,
    borderRadius: 3,
    marginTop: 12,
    opacity: 0.95,
  },
  error: {
    color: "red",
    marginBottom: 12,
    textAlign: "center",
  },
  emptyState: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
  },
  resultContainer: {
    marginHorizontal: 6,
    marginBottom: 18,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
  },
  title: {
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 6,
  },
  snippet: {
    fontSize: 14,
    marginBottom: 8,
  },
  link: {
    fontSize: 12,
    textDecorationLine: "underline",
  },
});
