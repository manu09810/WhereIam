import { useEffect, useState } from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { ALPHA, FONT_SIZE, RADIUS, SPACING } from "@/constants/theme";
import { getReadableTextColor, hexToRgba } from "@/constants/functions";

interface TimeWidgetProps {
  timezone: string;
  accentColor: string;
  flagImage?: string | null;
  countryName?: string | null;
}

export default function TimeWidget({
  timezone,
  accentColor,
  flagImage,
  countryName,
}: TimeWidgetProps) {
  const [currentTime, setCurrentTime] = useState<string | null>(null);

  const textColor = getReadableTextColor(accentColor);
  const accentTint = hexToRgba(accentColor, 0.5);
  const accentBorder = hexToRgba(accentColor, 0.45);
  const accentGlow = hexToRgba(accentColor, 0.25);

  useEffect(() => {
    if (!timezone || timezone === "N/A" || !timezone.includes("/")) return;

    const tick = () => {
      try {
        const time = new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: timezone,
        });
        setCurrentTime(time);
      } catch {
        setCurrentTime(null);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  return (
    <View
      style={{
        marginHorizontal: SPACING.container,
        marginBottom: SPACING.sm,
        borderRadius: RADIUS.widget,
        minHeight: 100,
        shadowColor: accentColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 8,
        overflow: "hidden",
      }}
    >
      {/* === Blur layer === */}
      <BlurView
        intensity={52}
        tint="dark"
        style={StyleSheet.absoluteFillObject}
      />

      {/* === Accent tint === */}
      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFillObject, { backgroundColor: accentTint }]}
      />

      {/* === Top shimmer gradient === */}
      <LinearGradient
        colors={["rgba(255,255,255,0.18)", "rgba(255,255,255,0)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "55%",
          borderTopLeftRadius: RADIUS.widget,
          borderTopRightRadius: RADIUS.widget,
        }}
      />

      {/* === Bottom accent gradient === */}
      <LinearGradient
        colors={["rgba(0,0,0,0)", accentGlow]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        pointerEvents="none"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "50%",
          borderBottomLeftRadius: RADIUS.widget,
          borderBottomRightRadius: RADIUS.widget,
        }}
      />

      {/* === Border === */}
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFillObject,
          {
            borderRadius: RADIUS.widget,
            borderWidth: 1,
            borderColor: accentBorder,
          },
        ]}
      />

      {/* === Top highlight stroke === */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          backgroundColor: "rgba(255,255,255,0.45)",
          borderTopLeftRadius: RADIUS.widget,
          borderTopRightRadius: RADIUS.widget,
        }}
      />

      {/* === Content === */}
      <View
        style={{
          padding: SPACING.xl,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: FONT_SIZE.caption,
            color: ALPHA.darkDimText,
            fontWeight: "700",
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: SPACING.xs,
          }}
        >
          Local Time
        </Text>
        <Text
          style={{
            fontSize: FONT_SIZE.clock,
            color: textColor ?? ALPHA.nearWhiteText,
            fontWeight: "800",
            letterSpacing: -1,
            textShadowColor: ALPHA.overlayBg,
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 6,
          }}
        >
          {currentTime ?? "--:--"}
        </Text>

        {/* === Flag + Country name === */}
        {(flagImage || countryName) && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: SPACING.md,
              marginTop: SPACING.lg,
            }}
          >
            {flagImage && (
              <Image
                source={{ uri: flagImage }}
                style={{
                  width: 36,
                  height: 24,
                  borderRadius: RADIUS.handle,
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.3)",
                }}
                resizeMode="cover"
              />
            )}
            {countryName && (
              <Text
                style={{
                  fontSize: FONT_SIZE.errorText,
                  color: ALPHA.darkDimText,
                  fontWeight: "600",
                  letterSpacing: 0.3,
                }}
              >
                {countryName}
              </Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
}
