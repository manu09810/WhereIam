import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch } from "react-native";
import { useRouter } from "expo-router";
import { useLocation } from "@/context/LocationContext";

export default function News() {
  const router = useRouter();
  const { countryData, city, region } = useLocation();
  const [localNews, setLocalNews] = useState(false);

  // Try to get the country language code, fallback to 'en'
  const langCode =
    countryData?.languages && Object.values(countryData.languages)[0]
      ? Object.values(countryData.languages)[0].toString().slice(0, 2)
      : "en";

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
        value={countryData?.name?.common}
        onPress={() =>
          router.push({
            pathname: "/NewsDetail",
            params: {
              query: countryData?.name?.common,
              label: "Country",
              lang: localNews ? langCode : "en",
            },
          })
        }
      />
      <NewsButton
        label="City News"
        value={city}
        onPress={() =>
          router.push({
            pathname: "/NewsDetail",
            params: {
              query: city,
              label: "City",
              lang: localNews ? langCode : "en",
            },
          })
        }
      />
      <NewsButton
        label="Region News"
        value={region}
        onPress={() =>
          router.push({
            pathname: "/NewsDetail",
            params: {
              query: region,
              label: "Region",
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
  value?: string;
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
