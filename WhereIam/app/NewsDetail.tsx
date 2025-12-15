import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

const GOOGLE_API_KEY = "AIzaSyDlpFwCSN9f5rqGN80dayH7inYyq5MmlaI";
const CX = "c66d69282c23145de"; // Your Custom Search Engine ID

type NewsResult = {
  title: string;
  snippet: string;
  link: string;
};

export default function NewsDetail() {
  const { query, label, lang } = useLocalSearchParams<{
    query?: string;
    label?: string;
    lang?: string;
  }>();
  const [results, setResults] = useState<NewsResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Set region and language for gl and hl
  // Example: lang = 'es' → gl = 'uy', hl = 'es'
  // You can pass more params if needed from News.tsx
  // For now, try to infer from lang (for Spanish, use 'uy' as example)
  const regionMap: Record<string, string> = {
    es: "uy", // You can expand this map for more languages/regions
    en: "us",
    fr: "fr",
    pt: "br",
    // add more as needed
  };
  const gl = lang && regionMap[lang] ? regionMap[lang] : "us";
  const hl = lang || "en";

  useEffect(() => {
    if (!query) return;

    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use lang param for language restriction
        const lrParam = lang ? `&lr=lang_${lang}` : "";
        const glParam = gl ? `&gl=${gl}` : "";
        const hlParam = hl ? `&hl=${hl}` : "";
        const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${CX}&q=${encodeURIComponent(
          query + " news"
        )}${lrParam}${glParam}${hlParam}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          setResults(
            data.items.map((item: any) => ({
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
  }, [query, lang, gl, hl]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.backButton}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.header}>
        {label} News{query ? `: ${query}` : ""}
      </Text>
      {loading && <ActivityIndicator />}
      {error && <Text style={styles.error}>{error}</Text>}
      <ScrollView>
        {results.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => Linking.openURL(item.link)}
          >
            <View style={styles.resultContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.snippet}>{item.snippet}</Text>
              <Text style={styles.link}>{item.link}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: "#fff",
  },
  backButton: {
    color: "#007aff",
    fontSize: 16,
    marginBottom: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 18,
    textAlign: "center",
  },
  error: {
    color: "red",
    marginBottom: 12,
    textAlign: "center",
  },
  resultContainer: {
    marginBottom: 18,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    padding: 12,
  },
  title: {
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 4,
  },
  snippet: {
    fontSize: 14,
    marginBottom: 4,
  },
  link: {
    color: "#007aff",
    fontSize: 12,
  },
});
