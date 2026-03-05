import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const PAGE_SIZE = 3;
import { useLocation } from "@/context/LocationContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { getReadableTextColor } from "@/constants/functions";
import { getFromCache, setOnCache } from "@/constants/cache";
import { BackButton } from "@/components/BackButton";
import {
  ALPHA,
  FONT_SIZE,
  LINE_HEIGHT,
  RADIUS,
  SIZE,
  SPACING,
} from "@/constants/theme";

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

export default function NewsDetail() {
  const { query, label, lang, locationName } = useLocalSearchParams<{
    query?: string;
    label: string;
    lang?: string;
    locationName: string;
  }>();
  const { backgroundImage, regionImage, themeColors, averageColor } =
    useLocation();
  const bgToUse =
    label === "country" ? backgroundImage : regionImage || backgroundImage;

  const primary = themeColors?.[0] || averageColor || "#007aff";
  const buttonColor = getReadableTextColor(primary);

  const [results, setResults] = useState<NewsResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(results.length / PAGE_SIZE);
  const pageItems = results.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const goToPage = (next: number) => {
    setPage(next);
  };

  useEffect(() => {
    if (!query) return;

    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      const cache = await getFromCache(label, "news", locationName);
      if (cache) {
        setResults(JSON.parse(cache));
        setLoading(false);
      } else {
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
            const newsItems = data.items.map((item: GoogleSearchItem) => ({
              title: item.title,
              snippet: item.snippet,
              link: item.link,
            }));
            setResults(newsItems);
            setPage(0);
            await setOnCache(
              JSON.stringify(newsItems),
              label,
              "news",
              locationName,
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
      }
    };
    fetchNews();
  }, [query, lang]);

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

        <View style={styles.titleWrapper}>
          <Text style={styles.titleLabel}>NEWS ABOUT</Text>
          <Text style={[styles.titleMain, { color: primary }]}>
            {locationName || label}
          </Text>
        </View>

        <View style={styles.body}>
          {loading && (
            <ActivityIndicator
              size="large"
              color={primary}
              style={styles.loader}
            />
          )}

          {error && !loading && <Text style={styles.errorText}>{error}</Text>}

          {!loading && !error && results.length === 0 && (
            <Text style={styles.emptyText}>No results available</Text>
          )}

          {pageItems.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => Linking.openURL(item.link)}
              activeOpacity={0.72}
            >
              <View style={styles.card}>
                <View
                  style={[styles.cardAccent, { backgroundColor: primary }]}
                />
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.cardSnippet} numberOfLines={3}>
                    {item.snippet}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {totalPages > 1 && (
            <View style={styles.pagination}>
              <TouchableOpacity
                onPress={() => goToPage(page - 1)}
                disabled={page === 0}
                activeOpacity={0.7}
                style={[
                  styles.pageBtn,
                  { borderColor: primary, opacity: page === 0 ? 0.3 : 1 },
                ]}
              >
                <Text style={[styles.pageBtnText, { color: primary }]}>←</Text>
              </TouchableOpacity>

              <Text style={styles.pageIndicator}>
                {page + 1} / {totalPages}
              </Text>

              <TouchableOpacity
                onPress={() => goToPage(page + 1)}
                disabled={page === totalPages - 1}
                activeOpacity={0.7}
                style={[
                  styles.pageBtn,
                  {
                    borderColor: primary,
                    opacity: page === totalPages - 1 ? 0.3 : 1,
                  },
                ]}
              >
                <Text style={[styles.pageBtnText, { color: primary }]}>→</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: SPACING.xxl,
    paddingTop: SPACING.lg,
  },
  titleWrapper: {
    alignItems: "center",
    paddingBottom: SPACING.sm,
  },
  titleLabel: {
    fontSize: FONT_SIZE.label,
    fontWeight: "600",
    letterSpacing: 3,
    color: "rgba(255,255,255,0.6)",
  },
  titleMain: {
    fontSize: FONT_SIZE.headline,
    fontWeight: "800",
    letterSpacing: -0.5,
    textAlign: "center",
  },
  loader: {
    marginTop: SPACING.iosBottom,
  },
  errorText: {
    color: "rgba(255,80,80,0.9)",
    textAlign: "center",
    fontSize: FONT_SIZE.error,
    fontWeight: "600",
  },
  emptyText: {
    color: ALPHA.darkDimText,
    textAlign: "center",
    fontSize: FONT_SIZE.body,
    marginTop: SPACING.xxxl,
  },
  card: {
    backgroundColor: ALPHA.glassBg,
    borderWidth: 1,
    borderColor: ALPHA.darkCard,
    borderRadius: RADIUS.widget,
    marginBottom: SPACING.lg,
    flexDirection: "row",
    overflow: "hidden",
    height: SIZE.newsCard,
  },
  cardAccent: {
    width: SIZE.handleHeight,
    borderTopLeftRadius: RADIUS.widget,
    borderBottomLeftRadius: RADIUS.widget,
    opacity: ALPHA.subtitle,
  },
  cardBody: {
    flex: 1,
    padding: SPACING.xl,
  },
  cardTitle: {
    fontSize: FONT_SIZE.body,
    fontWeight: "700",
    color: ALPHA.nearWhiteText,
    marginBottom: SPACING.sm,
    lineHeight: LINE_HEIGHT.body,
  },
  cardSnippet: {
    fontSize: FONT_SIZE.errorText,
    color: "rgba(255,255,255,0.60)",
    lineHeight: LINE_HEIGHT.tight,
    marginBottom: SPACING.md,
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.xxxl,
    marginTop: SPACING.md,
  },
  pageBtn: {
    backgroundColor: ALPHA.glassBg,
    borderWidth: 1,
    borderRadius: RADIUS.closeBtn,
    width: SIZE.paginationBtn,
    height: SIZE.paginationBtn,
    alignItems: "center",
    justifyContent: "center",
  },
  pageBtnText: {
    fontSize: FONT_SIZE.subheading,
    fontWeight: "700",
  },
  pageIndicator: {
    color: ALPHA.darkDimText,
    fontSize: FONT_SIZE.errorText,
    fontWeight: "600",
    letterSpacing: 1,
  },
});
