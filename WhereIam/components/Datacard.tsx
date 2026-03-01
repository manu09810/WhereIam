import React from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { useAudioPlayer } from "expo-audio";
import { LinearGradient } from "expo-linear-gradient";
import { FONT_SIZE, RADIUS, SPACING, TIMING, ALPHA } from "@/constants/theme";
import { hexToRgba } from "@/constants/functions";

const source = require("../assets/sounds/pop-up-something-160353.mp3");


interface DataCardProps {
  label?: string;
  value?: string | null | undefined;
  onPress?: () => void;
  onPressIn?: () => void;
  accentColor?: string;
  textColor?: string;
  fontSize?: number;
  height?: number;
  block?: boolean;
}

export default function DataCard({
  label,
  value,
  onPress,
  onPressIn,
  accentColor = "#007aff",
  textColor,
  fontSize,
  height,
  block = false,
}: DataCardProps) {
  const player = useAudioPlayer(source);

  const handlePressIn = () => {
    if (!player) return;
    try {
      setTimeout(() => {
        player.seekTo(0);
        player.play();
      }, TIMING.soundDelay);
    } catch {}
    onPressIn?.();
  };

  // Accent tint for the glass — very subtle
  const accentTint = hexToRgba(accentColor, 0.50);
  const accentBorder = hexToRgba(accentColor, 0.45);
  const accentGlow = hexToRgba(accentColor, 0.25);

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPress={onPress}
      style={({ pressed }) => ({
        flex: block ? 0 : 1,
        width: block ? "100%" : undefined,
        marginHorizontal: SPACING.sm,
        marginVertical: SPACING.sm,
        minHeight: height ?? 100,
        borderRadius: RADIUS.widget,
        opacity: pressed ? 0.85 : 1,
        transform: [{ scale: pressed ? 0.972 : 1 }],
        // Outer glow using shadow
        shadowColor: accentColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 8,
        overflow: "hidden",
      })}
    >
      {/* === Blur layer — the glass itself === */}
      <BlurView
        intensity={52}
        tint="dark"
        style={StyleSheet.absoluteFillObject}
      />

      {/* === Accent color tint over the blur === */}
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

      {/* === Inner top-left highlight stroke === */}
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
          flex: 1,
        }}
      >
        {label && (
          <Text
            style={{
              fontSize: FONT_SIZE.caption,
              color: ALPHA.darkDimText,
              fontWeight: "700",
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: value ? SPACING.md : 0,
              textAlign: "center",
            }}
          >
            {label}
          </Text>
        )}
        {value && (
          <Text
            style={{
              fontSize: fontSize ?? FONT_SIZE.subheading,
              color: textColor ?? ALPHA.nearWhiteText,
              fontWeight: "700",
              textAlign: "center",
              lineHeight: (fontSize ?? FONT_SIZE.subheading) * 1.25,
              // Subtle text shadow for legibility over busy backgrounds
              textShadowColor: ALPHA.overlayBg,
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 6,
            }}
          >
            {value}
          </Text>
        )}
      </View>
    </Pressable>
  );
}
