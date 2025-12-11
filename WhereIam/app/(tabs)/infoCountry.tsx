import { MapModal } from "@/components/MapCountry";
import { WeatherModal } from "@/components/WeatherModal";
import { useLocation } from "@/context/LocationContext";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MapIcon } from "react-native-heroicons/outline";
export default function InfoCountryScreen() {
  const {
    countryData,
    isLoadingCountry,
    countryError,
    timezone: locationTimezone,
    city,
    region,
    latitude: userLatitude,
    longitude: userLongitude,
  } = useLocation();
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [weatherModalVisible, setWeatherModalVisible] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [flagImage, setFlagImage] = useState<string | null>(null);
  const [flagColors, setFlagColors] = useState<string[] | null>(null);
  const [currentTime, setCurrentTime] = useState<string | null>(null);
  const [regionImage, setRegionImage] = useState<string | null>(null);

  useEffect(() => {
    if (countryData?.name?.common) {
      fetchCountryImage(countryData.name.common);
    }
  }, [countryData]);

  useEffect(() => {
    // Usa el código ISO 3166-1 alfa-2 (cca2) para la bandera
    if (countryData?.cca2) {
      // Puedes cambiar "flat" por "shiny" y "64" por otro tamaño si quieres
      setFlagImage(
        `https://flagcdn.com/w2560/${countryData.cca2.toLowerCase()}.png`
      );
    }
  }, [countryData?.cca2]);

  useEffect(() => {
    if (flagImage) {
      detectFlagColors(flagImage);
    }
  }, [flagImage]);

  useEffect(() => {
    if (region) {
      const fetchRegionImage = async () => {
        try {
          const response = await fetch(
            `https://en.wikipedia.org/w/api.php?action=query&titles=${region}&prop=pageimages&format=json&pithumbsize=500&origin=*`
          );
          const data = await response.json();
          const pages = data.query.pages;
          const page = Object.values(pages)[0];
          if (page?.thumbnail?.source) {
            setRegionImage(page.thumbnail.source);
          } else {
            setRegionImage(null);
          }
        } catch (error) {
          setRegionImage(null);
        }
      };
      fetchRegionImage();
    }
  }, [region]);
  // Fetch local time
  useEffect(() => {
    // Usar timezone de location si está disponible, si no el del país
    const timezone =
      locationTimezone ||
      countryData?.timezones?.find((tz) => tz.includes("/")) ||
      countryData?.timezones?.[0];
    if (timezone && timezone !== "N/A" && timezone.includes("/")) {
      fetchCurrentTime(timezone);
    }
  }, [countryData, locationTimezone]);

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

  const detectFlagColors = async (imageUrl: string) => {
    try {
      const result = await ImageColors.getColors(imageUrl, {
        fallback: "#ffffff",
        cache: true,
        key: imageUrl,
      });
      // El resultado puede variar según la plataforma
      if (result.platform === "android") {
        setFlagColors(
          [result.dominant, result.average, result.vibrant].filter(Boolean)
        );
      } else if (result.platform === "ios") {
        setFlagColors(
          [
            result.background,
            result.primary,
            result.secondary,
            result.detail,
          ].filter(Boolean)
        );
      }
    } catch (e) {
      setFlagColors(null);
    }
  };

  const fetchCurrentTime = async (tz: string) => {
    try {
      const response = await fetch(
        `http://worldtimeapi.org/api/timezone/${tz}`
      );
      const data = await response.json();
      if (data.datetime) {
        const time = new Date(data.datetime).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        setCurrentTime(time);
      }
    } catch (error) {
      setCurrentTime(null);
      console.log("Error fetching time:", error);
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

  const openGoogleMaps = (query: string): void => {
    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(
      query
    )}`;
    Linking.openURL(mapsUrl).catch((err: Error) =>
      console.log("Error opening Google Maps:", err)
    );
  };

  const openGoogleTranslate = (languageCode: string): void => {
    // Obtener el código de idioma ISO 639-1 de los datos del país (idioma origen)
    const sourceLangCode = countryData.languages
      ? Object.keys(countryData.languages)[0]
      : "en";

    // Siempre traducir a inglés si el país no habla inglés
    // Si el país habla inglés, traducir al idioma del dispositivo
    let targetLangCode = "en";

    if (sourceLangCode === "en") {
      const deviceLanguage = Intl.DateTimeFormat().resolvedOptions().locale;
      targetLangCode = deviceLanguage.split("-")[0];
    }

    // Usar el nombre del país como texto de ejemplo
    const sampleText = countryName || "hello";
    const translateUrl = `https://translate.google.com/?sl=${sourceLangCode}&tl=${targetLangCode}
    )}`;

    Linking.openURL(translateUrl).catch((err: Error) =>
      console.log("Error opening Google Translate:", err)
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
  const capital = countryData.capital?.[0] || "N/A";

  // Usar las coordenadas GPS del usuario si están disponibles, si no, usar las del país
  // Las coordenadas del usuario son mucho más precisas que las del centro del país
  const latlngArr = Array.isArray(countryData.latlng) ? countryData.latlng : [];
  const countryLatitude =
    typeof latlngArr[0] === "number" ? latlngArr[0] : null;
  const countryLongitude =
    typeof latlngArr[1] === "number" ? latlngArr[1] : null;

  // Priorizar coordenadas GPS del usuario sobre las del país
  const latNum = userLatitude !== null ? userLatitude : countryLatitude;
  const lonNum = userLongitude !== null ? userLongitude : countryLongitude;

  // Para mostrar en la UI
  const latitude = latNum !== null ? latNum.toFixed(6) : "N/A";
  const longitude = lonNum !== null ? lonNum.toFixed(6) : "N/A";
  const continent = countryData.continents?.[0] || "N/A";
  const timezone = countryData.timezones?.[0] || "N/A";

  const DataCard = ({ label, value, onPress }) => (
    <Pressable
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
    </Pressable>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fafafa" }}>
      <StatusBar hidden />
      <ScrollView style={{ flex: 1 }} scrollEventThrottle={16}>
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
              opacity: 0.68,
              zIndex: -1,
            }}
            blurRadius={3}
          />
        )}

        {/* Parallax Header con Bandera */}
        <View
          style={{
            height: 250,
            overflow: "hidden",
            backgroundColor: "#fff",
            borderTopEndRadius: 20,
            marginBottom: 0, // Sin margen inferior
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

        {/* Nombre del país encima del mapa */}
        <View style={{ paddingHorizontal: 12, marginTop: 18, marginBottom: 0 }}>
          <Text
            style={{
              fontSize: 36,
              fontWeight: "700",
              color: "#1a1a1a",
              marginBottom: 8,
              letterSpacing: -0.5,
              textAlign: "center",
            }}
          >
            {countryName}
          </Text>
        </View>

        {/* Mapa ocupa todo el rectángulo debajo de la bandera */}
        <View
          style={{
            height: 180,
            marginHorizontal: 12,
           
            borderRadius: 16,
            overflow: "hidden",
            backgroundColor: "#f0f0f0",
            borderWidth: 1,
            borderColor: "#1a1a1a",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Pressable
            onPress={() => setMapModalVisible(true)}
            style={{
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {regionImage ? (
              <Image
                source={{ uri: regionImage }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            ) : (
              <MapIcon color="#1a1a1a" size={64} />
            )}
          </Pressable>
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
          ></View>

          {/* Grid Data Cards */}
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            <View
              style={{
                flex: 1,
                backgroundColor: "#fff",
                borderRadius: 16,
                padding: 10,
                marginHorizontal: 6,
                marginVertical: 12,
                borderWidth: 1,
                borderColor: "#1a1a1a",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 100,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: "#999",
                  fontWeight: "600",
                  marginBottom: 10,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  textAlign: "center",
                }}
              >
                Local Time
              </Text>
              <Text
                style={{
                  fontSize: 54,
                  color: "#1a1a1a",
                  fontWeight: "bold",
                  letterSpacing: 2,
                  textAlign: "center",
                }}
              >
                {currentTime ? currentTime : "Loading..."}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            <DataCard
              label="Capital"
              value={capital}
              onPress={() => capital !== "N/A" && openWikipedia(capital)}
            />
            <DataCard label="Currency" value={currencies} onPress={undefined} />
          </View>

          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            <DataCard
              label="Languages"
              value={languages.length > 0 ? languages.join(", ") : "N/A"}
              onPress={() =>
                languages.length > 0 && openGoogleTranslate(languages[0])
              }
            />
            <DataCard
              label="Population"
              value={`${population}M`}
              onPress={undefined}
            />
          </View>

          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            <DataCard
              label="Continent"
              value={continent}
              onPress={() => continent !== "N/A" && openWikipedia(continent)}
            />
            <DataCard label="Timezone" value={timezone} onPress={undefined} />
          </View>

          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            <DataCard
              label="Latitude"
              value={`${latitude}°`}
              onPress={undefined}
            />
            <DataCard
              label="Longitude"
              value={`${longitude}°`}
              onPress={undefined}
            />
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            <DataCard
              label="City"
              value={city || "N/A"}
              onPress={() => city && city !== "N/A" && openWikipedia(city)}
            />
            <DataCard
              label="Region"
              value={region || "N/A"}
              onPress={() =>
                region && region !== "N/A" && openWikipedia(region)
              }
            />
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            <DataCard
              label="Weather"
              value="Tap to view"
              onPress={() => setWeatherModalVisible(true)}
            />
          </View>
        </View>

        {/* Colores de la bandera detectados */}
        {flagColors && (
          <View style={{ flexDirection: "row", marginVertical: 8 }}>
            {flagColors.map((color, idx) => (
              <View
                key={idx}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: color,
                  marginRight: 8,
                  borderWidth: 1,
                  borderColor: "#ccc",
                }}
              />
            ))}
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Map Modal */}
      <MapModal
        visible={mapModalVisible}
        onClose={() => setMapModalVisible(false)}
        latitude={latNum}
        longitude={lonNum}
        countryName={countryName}
      />

      {/* Weather Modal */}
      <WeatherModal
        visible={weatherModalVisible}
        onClose={() => setWeatherModalVisible(false)}
        latitude={latNum}
        longitude={lonNum}
        cityName={city || capital}
      />
    </View>
  );
}
