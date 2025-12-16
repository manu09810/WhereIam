import React, { useEffect, useState } from "react";
import Constants from "expo-constants";
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

const { EXPO_PUBLIC_GOOGLE_API_KEY, EXPO_PUBLIC_GOOGLE_SEARCH_ENGINE_ID } =
  Constants.expoConfig?.extra || {};

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

  useEffect(() => {
    if (!query) return;

    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const lrParam = lang ? `&lr=lang_${lang}` : "";
        const url = `https://www.googleapis.com/customsearch/v1?key=${EXPO_PUBLIC_GOOGLE_API_KEY}&cx=${EXPO_PUBLIC_GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(
          query + " news"
        )}${lrParam}`;
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
  }, [query]);

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
