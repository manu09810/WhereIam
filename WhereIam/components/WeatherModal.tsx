import { useLocation } from "@/context/LocationContext";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { XMarkIcon } from "react-native-heroicons/solid";

interface WeatherModalProps {
  visible: boolean;
  onClose: () => void;
  latitude: number | null;
  longitude: number | null;
  cityName: string;
}

interface WeatherData {
  temperature: number;
  windSpeed: number;
  weatherCode: number;
  humidity: number;
  precipitation: number;
}

const getReadableTextColor = (hex: string) => {
  if (!hex || hex.length < 7) return "#111111";
  const r = parseInt(hex.substr(1, 2), 16) / 255;
  const g = parseInt(hex.substr(3, 2), 16) / 255;
  const b = parseInt(hex.substr(5, 2), 16) / 255;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.55 ? "#111111" : "#ffffff";
};

export const WeatherModal = ({
  visible,
  onClose,
  latitude,
  longitude,
  cityName,
}: WeatherModalProps) => {
  const { themeColors } = useLocation();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  const sheetBg = themeColors?.[0] || "#ffffff";
  const textColor = getReadableTextColor(sheetBg);
  const isLight = textColor === "#111111";
  const cardBg = isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.12)";
  const cardBorder = isLight ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.16)";
  const dimText = isLight ? "rgba(17,17,17,0.5)" : "rgba(255,255,255,0.55)";

  useEffect(() => {
    if (visible) {
      fetchWeather();
    }
  }, [visible, latitude, longitude]);

  const fetchWeather = async () => {
    if (latitude === null || longitude === null) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relative_humidity_2m,precipitation`
      );
      const data = await response.json();
      if (data.current_weather) {
        setWeather({
          temperature: data.current_weather.temperature,
          windSpeed: data.current_weather.windspeed,
          weatherCode: data.current_weather.weathercode,
          humidity: data.hourly.relative_humidity_2m[0] || 0,
          precipitation: data.hourly.precipitation[0] || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherDescription = (code: number) => {
    const weatherCodes: { [key: number]: string } = {
      0: "Clear sky ☀️",
      1: "Mainly clear 🌤️",
      2: "Partly cloudy ⛅",
      3: "Overcast ☁️",
      45: "Foggy 🌫️",
      48: "Foggy 🌫️",
      51: "Light drizzle 🌦️",
      53: "Drizzle 🌦️",
      55: "Heavy drizzle 🌧️",
      61: "Light rain 🌧️",
      63: "Rain 🌧️",
      65: "Heavy rain ⛈️",
      71: "Light snow 🌨️",
      73: "Snow 🌨️",
      75: "Heavy snow ❄️",
      95: "Thunderstorm ⛈️",
    };
    return weatherCodes[code] || "Unknown";
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            backgroundColor: sheetBg,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            borderTopWidth: 1,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderColor: isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.15)",
            padding: 24,
            paddingBottom: Platform.OS === "ios" ? 40 : 24,
            minHeight: 400,
          }}
        >
          {/* Drag handle */}
          <View
            style={{
              width: 40,
              height: 4,
              borderRadius: 2,
              backgroundColor: isLight
                ? "rgba(0,0,0,0.15)"
                : "rgba(255,255,255,0.3)",
              alignSelf: "center",
              marginBottom: 20,
            }}
          />

          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <View>
              <Text
                style={{ fontSize: 22, fontWeight: "800", color: textColor }}
              >
                Weather
              </Text>
              <Text style={{ fontSize: 13, color: dimText, marginTop: 2 }}>
                {cityName}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={{
                backgroundColor: isLight
                  ? "rgba(0,0,0,0.08)"
                  : "rgba(255,255,255,0.15)",
                borderRadius: 50,
                padding: 8,
              }}
            >
              <XMarkIcon size={22} color={textColor} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          {loading ? (
            <View
              style={{
                paddingVertical: 64,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ActivityIndicator size="large" color={textColor} />
            </View>
          ) : weather ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Temperature hero card */}
              <View
                style={{
                  backgroundColor: cardBg,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: cardBorder,
                  padding: 28,
                  marginBottom: 12,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    color: dimText,
                    fontWeight: "700",
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  Current Temperature
                </Text>
                <Text
                  style={{
                    fontSize: 72,
                    fontWeight: "800",
                    color: textColor,
                    letterSpacing: -2,
                    lineHeight: 80,
                  }}
                >
                  {Math.round(weather.temperature)}°
                </Text>
                <Text
                  style={{ fontSize: 18, color: textColor, marginTop: 8, opacity: 0.85 }}
                >
                  {getWeatherDescription(weather.weatherCode)}
                </Text>
              </View>

              {/* Stats row */}
              <View style={{ flexDirection: "row", gap: 10 }}>
                {[
                  { label: "Wind", value: `${weather.windSpeed}`, unit: "km/h" },
                  { label: "Humidity", value: `${weather.humidity}`, unit: "%" },
                  { label: "Precip.", value: `${weather.precipitation}`, unit: "mm" },
                ].map((stat) => (
                  <View
                    key={stat.label}
                    style={{
                      flex: 1,
                      backgroundColor: cardBg,
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: cardBorder,
                      padding: 14,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        color: dimText,
                        fontWeight: "700",
                        letterSpacing: 2,
                        textTransform: "uppercase",
                        marginBottom: 6,
                      }}
                    >
                      {stat.label}
                    </Text>
                    <Text
                      style={{
                        fontSize: 22,
                        fontWeight: "800",
                        color: textColor,
                        letterSpacing: -0.5,
                      }}
                    >
                      {stat.value}
                    </Text>
                    <Text
                      style={{ fontSize: 12, color: dimText, marginTop: 2 }}
                    >
                      {stat.unit}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          ) : (
            <View style={{ paddingVertical: 64, alignItems: "center" }}>
              <Text style={{ color: dimText, fontSize: 15 }}>
                Unable to load weather data
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};
