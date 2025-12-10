import { View, Text, Image, ActivityIndicator, ScrollView } from "react-native";
import { useLocation } from "@/context/LocationContext";

export default function InfoCountryScreen() {
  const { countryData, isLoadingCountry, countryError } = useLocation();

  if (isLoadingCountry) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fafafa",
        }}
      >
        <ActivityIndicator size="large" color="#1a1a1a" />
      </View>
    );
  }

  if (countryError || !countryData) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fafafa",
        }}
      >
        <Text style={{ color: "#666", fontSize: 16 }}>
          Unable to load country data
        </Text>
      </View>
    );
  }

  const countryName = countryData.name?.common || "N/A";
  const currencies = countryData.currencies
    ? Object.values(countryData.currencies)[0]?.name
    : "N/A";
  const flag = countryData.flag || "🏳️";
  const languages = countryData.languages
    ? Object.values(countryData.languages).slice(0, 2)
    : [];
  const population = countryData.population
    ? (countryData.population / 1000000).toFixed(1)
    : "N/A";
  const flagImage = countryData.flags?.png;
  const capital = countryData.capital?.[0] || "N/A";
  const latitude = countryData.latlng?.[0].toFixed(2) || "N/A";
  const longitude = countryData.latlng?.[1].toFixed(2) || "N/A";

  const DataCard = ({ label, value }) => (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 6,
        marginVertical: 8,
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          fontSize: 11,
          color: "#999",
          fontWeight: "600",
          marginBottom: 8,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: "#1a1a1a",
          fontWeight: "700",
        }}
        numberOfLines={2}
      >
        {value}
      </Text>
    </View>
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fafafa" }}
      scrollEventThrottle={16}
    >
      {/* Parallax Header with Flag */}
      <View
        style={{
          height: 280,
          overflow: "hidden",
          backgroundColor: "#fff",
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          marginBottom: 24,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        {flagImage && (
          <Image
            source={{ uri: flagImage }}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        )}
      </View>

      <View style={{ paddingHorizontal: 12 }}>
        {/* Country Name */}
        <Text
          style={{
            fontSize: 36,
            fontWeight: "700",
            color: "#1a1a1a",
            marginBottom: 4,
            letterSpacing: -0.5,
            marginLeft: 12,
          }}
        >
          {countryName}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#999",
            marginBottom: 24,
            fontWeight: "500",
            marginLeft: 12,
          }}
        >
          {flag}
        </Text>

        {/* Grid Data Cards */}
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          <DataCard label="Capital" value={capital} />
          <DataCard label="Currency" value={currencies} />
        </View>

        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          <DataCard
            label="Languages"
            value={languages.length > 0 ? languages.join(", ") : "N/A"}
          />
          <DataCard label="Population" value={`${population}M`} />
        </View>

        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          <DataCard label="Latitude" value={`${latitude}°`} />
          <DataCard label="Longitude" value={`${longitude}°`} />
        </View>
      </View>

      {/* Spacer */}
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}
