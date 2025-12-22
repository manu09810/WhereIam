import { useLocation } from "@/context/LocationContext";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
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

export const WeatherModal = ({
  visible,
  onClose,
  latitude,
  longitude,
  cityName,
}: WeatherModalProps) => {
  const { themeColors } = useLocation(); // Usa los colores del contexto
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

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
            backgroundColor: themeColors?.[0] || "#fff", // Color del modal
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 24,
            minHeight: 400,
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <View>
              <Text
                style={{ fontSize: 24, fontWeight: "700", color: "#1a1a1a" }}
              >
                Weather
              </Text>
              <Text style={{ fontSize: 14, color: "#1a1a1a", marginTop: 4 }}>
                {cityName}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={{
                backgroundColor: "#f0f0f0",
                borderRadius: 50,
                padding: 8,
              }}
            >
              <XMarkIcon size={24} color="#1a1a1a" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          {loading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 60,
              }}
            >
              <ActivityIndicator size="large" color="#1a1a1a" />
            </View>
          ) : weather ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Temperature Card */}
              <View
                style={{
                  backgroundColor: "#fafafa",
                  borderRadius: 16,
                  padding: 24,
                  marginBottom: 16,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontSize: 64, fontWeight: "700", color: "#1a1a1a" }}
                >
                  {Math.round(weather.temperature)}°
                </Text>
                <Text style={{ fontSize: 18, color: "#1a1a1a", marginTop: 8 }}>
                  {getWeatherDescription(weather.weatherCode)}
                </Text>
              </View>

              {/* Details Grid */}
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "#fafafa",
                    borderRadius: 12,
                    padding: 16,
                    minWidth: 150,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#1a1a1a",
                      fontWeight: "600",
                      marginBottom: 8,
                    }}
                  >
                    WIND SPEED
                  </Text>
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "700",
                      color: "#1a1a1a",
                    }}
                  >
                    {weather.windSpeed} km/h
                  </Text>
                </View>

                <View
                  style={{
                    flex: 1,
                    backgroundColor: "#fafafa",
                    borderRadius: 12,
                    padding: 16,
                    minWidth: 150,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#1a1a1a",
                      fontWeight: "600",
                      marginBottom: 8,
                    }}
                  >
                    HUMIDITY
                  </Text>
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "700",
                      color: "#1a1a1a",
                    }}
                  >
                    {weather.humidity}%
                  </Text>
                </View>

                <View
                  style={{
                    flex: 1,
                    backgroundColor: "#fafafa",
                    borderRadius: 12,
                    padding: 16,
                    minWidth: 150,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#1a1a1a",
                      fontWeight: "600",
                      marginBottom: 8,
                    }}
                  >
                    PRECIPITATION
                  </Text>
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "700",
                      color: "#1a1a1a",
                    }}
                  >
                    {weather.precipitation} mm
                  </Text>
                </View>
              </View>
            </ScrollView>
          ) : (
            <View style={{ paddingVertical: 60, alignItems: "center" }}>
              <Text style={{ color: "#1a1a1a" }}>
                Unable to load weather data
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};
