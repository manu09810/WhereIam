import { useLocation } from "@/context/LocationContext";
import { getReadableTextColor } from "@/constants/functions";
import {
  ALPHA,
  FONT_SIZE,
  LINE_HEIGHT,
  MODAL,
  RADIUS,
  SIZE,
  SPACING,
} from "@/constants/theme";
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
  const cardBg = isLight ? ALPHA.lightCard : ALPHA.darkCard;
  const cardBorder = isLight ? ALPHA.lightCardBorder : ALPHA.darkCardBorder;
  const dimText = isLight ? ALPHA.lightDimText : ALPHA.darkDimText;

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
      105: "Snow 🌨️",
      106: "Heavy snow ❄️",
      95: "Thunderstorm ⛈️",
      108: "Thunderstorm ⛈️",
    };
    return weatherCodes[code] || "Unknown";
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View
        style={{
          flex: 1,
          backgroundColor: ALPHA.overlayBg,
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            backgroundColor: sheetBg,
            borderTopLeftRadius: RADIUS.sheet,
            borderTopRightRadius: RADIUS.sheet,
            borderTopWidth: 1,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderColor: isLight ? ALPHA.lightBorder : ALPHA.darkBorder,
            padding: SPACING.sheet,
            paddingBottom: Platform.OS === "ios" ? SPACING.iosBottom : SPACING.sheet,
            minHeight: MODAL.weatherMinHeight,
          }}
        >
          {/* Drag handle */}
          <View
            style={{
              width: SIZE.handleWidth,
              height: SIZE.handleHeight,
              borderRadius: RADIUS.handle,
              backgroundColor: isLight ? ALPHA.lightHandle : ALPHA.darkHandle,
              alignSelf: "center",
              marginBottom: SPACING.xxxl,
            }}
          />

          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: SPACING.xxxl,
            }}
          >
            <View>
              <Text
                style={{ fontSize: FONT_SIZE.title, fontWeight: "800", color: textColor }}
              >
                Weather
              </Text>
              <Text style={{ fontSize: FONT_SIZE.errorText, color: dimText, marginTop: 2 }}>
                {cityName}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={{
                backgroundColor: isLight ? ALPHA.lightBorder : ALPHA.darkBorder,
                borderRadius: RADIUS.closeBtn,
                padding: SPACING.md,
              }}
            >
              <XMarkIcon size={SIZE.icon} color={textColor} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          {loading ? (
            <View
              style={{
                paddingVertical: SPACING.emptyState,
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
                  borderRadius: RADIUS.large,
                  borderWidth: 1,
                  borderColor: cardBorder,
                  padding: SPACING.hero,
                  marginBottom: SPACING.container,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: FONT_SIZE.caption,
                    color: dimText,
                    fontWeight: "700",
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    marginBottom: SPACING.md,
                  }}
                >
                  Current Temperature
                </Text>
                <Text
                  style={{
                    fontSize: FONT_SIZE.temperature,
                    fontWeight: "800",
                    color: textColor,
                    letterSpacing: -2,
                    lineHeight: LINE_HEIGHT.temperature,
                  }}
                >
                  {Math.round(weather.temperature)}°
                </Text>
                <Text
                  style={{
                    fontSize: FONT_SIZE.subheading,
                    color: textColor,
                    marginTop: SPACING.md,
                    opacity: ALPHA.subtitle,
                  }}
                >
                  {getWeatherDescription(weather.weatherCode)}
                </Text>
              </View>

              {/* Stats row */}
              <View style={{ flexDirection: "row", gap: SPACING.lg }}>
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
                      borderRadius: RADIUS.card,
                      borderWidth: 1,
                      borderColor: cardBorder,
                      padding: SPACING.xl,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: FONT_SIZE.caption,
                        color: dimText,
                        fontWeight: "700",
                        letterSpacing: 2,
                        textTransform: "uppercase",
                        marginBottom: SPACING.sm,
                      }}
                    >
                      {stat.label}
                    </Text>
                    <Text
                      style={{
                        fontSize: FONT_SIZE.title,
                        fontWeight: "800",
                        color: textColor,
                        letterSpacing: -0.5,
                      }}
                    >
                      {stat.value}
                    </Text>
                    <Text
                      style={{ fontSize: FONT_SIZE.micro, color: dimText, marginTop: 2 }}
                    >
                      {stat.unit}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          ) : (
            <View style={{ paddingVertical: SPACING.emptyState, alignItems: "center" }}>
              <Text style={{ color: dimText, fontSize: FONT_SIZE.body }}>
                Unable to load weather data
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};
