import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  Modal,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useLocation } from "@/context/LocationContext";
import { useState, useEffect } from "react";

export default function InfoCountryScreen() {
  const { countryData, isLoadingCountry, countryError } = useLocation();
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(null);

  useEffect(() => {
    if (countryData?.name?.common) {
      fetchCountryImage(countryData.name.common);
    }
  }, [countryData]);

  const fetchCountryImage = async (countryName) => {
    try {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&titles=${countryName}&prop=pageimages&format=json&pithumbsize=500`
      );
      const data = await response.json();
      const pages = data.query.pages;
      const page = Object.values(pages)[0];
      if (page?.thumbnail?.source) {
        setBackgroundImage(page.thumbnail.source);
      }
    } catch (error) {
      console.log("Error fetching background image:", error);
    }
  };

  const openWikipedia = (query) => {
    const wikipediaUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(
      query
    )}`;
    Linking.openURL(wikipediaUrl).catch((err) =>
      console.log("Error opening Wikipedia:", err)
    );
  };

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
  const continent = countryData.continents?.[0] || "N/A";
  const timezone = countryData.timezones?.[0] || "N/A";

  const latNum = parseFloat(latitude);
  const lonNum = parseFloat(longitude);

  const DataCard = ({ label, value, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 6,
        marginVertical: 8,
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#1a1a1a",
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
    </TouchableOpacity>
  );

  return (
    <>
      <ScrollView
        style={{ flex: 1, backgroundColor: "#fafafa" }}
        scrollEventThrottle={16}
      >
        {/* Background Image with Opacity */}
        {backgroundImage && (
          <Image
            source={{ uri: backgroundImage }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.58,
              zIndex: -1,
            }}
            blurRadius={3}
          />
        )}

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
          {/* Country Name with Map */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 24,
              marginLeft: 12,
              marginRight: 12,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 36,
                  fontWeight: "700",
                  color: "#1a1a1a",
                  marginBottom: 4,
                  letterSpacing: -0.5,
                }}
              >
                {countryName}
              </Text>
            </View>

            {/* Mini Map - Touchable */}
            <TouchableOpacity
              onPress={() => setMapModalVisible(true)}
              style={{
                width: 100,
                height: 100,
                borderRadius: 12,
                overflow: "hidden",
                marginLeft: 16,
                backgroundColor: "#f0f0f0",
                borderWidth: 1,
                borderColor: "#1a1a1a",
              }}
            >
              {latNum && lonNum ? (
                <Image
                  source={{
                    uri: `https://tile.openstreetmap.de/tiles/osmde/4/${Math.floor(
                      ((lonNum + 180) / 360) * Math.pow(2, 4)
                    )}/${Math.floor(
                      ((1 -
                        Math.log(
                          Math.tan((latNum * Math.PI) / 180) +
                            1 / Math.cos((latNum * Math.PI) / 180)
                        ) /
                          Math.PI) /
                        2) *
                        Math.pow(2, 4)
                    )}.png`,
                  }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 24 }}>📍</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Grid Data Cards */}
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            <DataCard
              label="Capital"
              value={capital}
              onPress={() => capital !== "N/A" && openWikipedia(capital)}
            />
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
            <DataCard label="Continent" value={continent} />
            <DataCard label="Timezone" value={timezone} />
          </View>

          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            <DataCard label="Latitude" value={`${latitude}°`} />
            <DataCard label="Longitude" value={`${longitude}°`} />
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Map Modal */}
      <Modal visible={mapModalVisible} transparent={true} animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "#000",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {latNum && lonNum ? (
            <Image
              source={{
                uri: `https://tile.openstreetmap.de/tiles/osmde/4/${Math.floor(
                  ((lonNum + 180) / 360) * Math.pow(2, 4)
                )}/${Math.floor(
                  ((1 -
                    Math.log(
                      Math.tan((latNum * Math.PI) / 180) +
                        1 / Math.cos((latNum * Math.PI) / 180)
                    ) /
                      Math.PI) /
                    2) *
                    Math.pow(2, 4)
                )}.png`,
              }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          ) : (
            <Text style={{ fontSize: 48, color: "#fff" }}>📍</Text>
          )}

          {/* Close Button */}
          <TouchableOpacity
            onPress={() => setMapModalVisible(false)}
            style={{
              position: "absolute",
              top: 50,
              right: 20,
              backgroundColor: "#fff",
              borderRadius: 50,
              padding: 10,
            }}
          >
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>✕</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );

}}
