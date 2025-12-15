import { ISO639_2_TO_1 } from "@/constants/languages";
import { useLocation } from "@/context/LocationContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

export default function News() {
  const router = useRouter();
  const { countryData, city, region } = useLocation();
  const [localNews, setLocalNews] = useState(false);

  // Try to get the country language code, fallback to 'en'
  const rawLangCode =
    countryData?.languages && Object.keys(countryData.languages)[0]
      ? Object.keys(countryData.languages)[0]
      : "en";

  const langCode = ISO639_2_TO_1[rawLangCode] || "en";

  const countryName = countryData?.name?.common;
  const regionName = region;
  const cityName = city;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>News Search</Text>
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>
          {localNews ? "Local News" : "English News"}
        </Text>
        <Switch
          value={localNews}
          onValueChange={setLocalNews}
          thumbColor={localNews ? "#007aff" : "#ccc"}
        />
      </View>
      <NewsButton
        label="Country News"
        value={countryName}
        onPress={() =>
          router.push({
            pathname: "/NewsDetail",
            params: {
              query: `"${countryName || ''}"`,
              label: "Country",
              lang: localNews ? langCode : "en",
            },
          })
        }
      />
      <NewsButton
        label="Region News"
        value={regionName}
        onPress={() =>
          router.push({
            pathname: "/NewsDetail",
            params: {
              query: `"${regionName || ''}" ${countryName}`,
              label: "Region",
              lang: localNews ? langCode : "en",
            },
          })
        }
      />
      <NewsButton
        label="City News"
        value={cityName}
        onPress={() =>
          router.push({
            pathname: "/NewsDetail",
            params: {
              query: `"${cityName || ''}" ${regionName || ''} ${countryName}`,
              label: "City",
              lang: localNews ? langCode : "en",
            },
          })
        }
      />
    </View>
  );
}

function NewsButton({
  label,
  value,
  onPress,
}: {
  label: string;
  value?: string | null;
  onPress: () => void;
}) {
  if (!value) return null;
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>
        {label}: {value}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 32,
    textAlign: "center",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    justifyContent: "center",
  },
  switchLabel: {
    fontSize: 16,
    marginRight: 12,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#007aff",
    padding: 18,
    borderRadius: 10,
    marginBottom: 18,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
    textAlign: "center",
  },
});
