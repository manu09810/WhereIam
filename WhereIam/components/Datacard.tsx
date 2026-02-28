import React from "react";
import { Pressable, Text, View } from "react-native";
import { useAudioPlayer } from "expo-audio";
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Rect } from "react-native-svg";

const source = require("../assets/sounds/pop-up-something-160353.mp3");

const getReadableTextColor = (hex: string) => {
  if (!hex || hex.length < 7) return "#ffffff";
  const r = parseInt(hex.substr(1, 2), 16) / 255;
  const g = parseInt(hex.substr(3, 2), 16) / 255;
  const b = parseInt(hex.substr(5, 2), 16) / 255;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.55 ? "#111111" : "#ffffff";
};

const contrastRatio = (fg: string, bg: string) => {
  const toL = (hex: string) => {
    const r = parseInt(hex.substr(1, 2), 16) / 255;
    const g = parseInt(hex.substr(3, 2), 16) / 255;
    const b = parseInt(hex.substr(5, 2), 16) / 255;
    const c = [r, g, b].map((v) =>
      v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    );
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const L1 = toL(fg) + 0.05;
  const L2 = toL(bg) + 0.05;
  return L1 > L2 ? L1 / L2 : L2 / L1;
};

const pickAccessibleTextColor = (bg: string, preferred?: string) => {
  const fallback = getReadableTextColor(bg);
  if (preferred && contrastRatio(preferred, bg) >= 3) return preferred;
  return fallback;
};

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
  const readable = getReadableTextColor(accentColor);
  const valueColor = pickAccessibleTextColor(accentColor, textColor || readable);
  const player = useAudioPlayer(source);

  const isLight = readable === "#111111";
  const highlightColor = isLight
    ? "rgba(255,255,255,0.48)"
    : "rgba(255,255,255,0.11)";
  const highlightOpacity = isLight ? 0.48 : 0.11;
  const labelColor = isLight
    ? "rgba(17,17,17,0.48)"
    : "rgba(255,255,255,0.58)";
  const borderColor = isLight
    ? "rgba(0,0,0,0.07)"
    : "rgba(255,255,255,0.2)";

  const handlePressIn = () => {
    if (!player) return;
    try {
      setTimeout(() => {
        player.seekTo(0);
        player.play();
      }, 300);
    } catch {}
    onPressIn?.();
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPress={onPress}
      style={({ pressed }) => ({
        flex: block ? 0 : 1,
        width: block ? "100%" : undefined,
        backgroundColor: accentColor,
        borderRadius: 18,
        padding: 14,
        marginHorizontal: 6,
        marginVertical: 6,
        borderWidth: 1,
        borderColor,
        alignItems: "center",
        justifyContent: "center",
        minHeight: height ?? 100,
        shadowColor: accentColor,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
        opacity: pressed ? 0.8 : 1,
        transform: [{ scale: pressed ? 0.975 : 1 }],
        overflow: "hidden",
      })}
    >
      {/* Subtle top highlight for depth — gradient fade */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "40%",
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          overflow: "hidden",
        }}
      >
        <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <Defs>
            <SvgLinearGradient
              id="cardHighlight"
              x1="0" y1="0"
              x2="0" y2="100"
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0" stopColor="#ffffff" stopOpacity={highlightOpacity} />
              <Stop offset="100" stopColor="#ffffff" stopOpacity="0" />
            </SvgLinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100" height="100" fill="url(#cardHighlight)" />
        </Svg>
      </View>
      {label && (
        <Text
          style={{
            fontSize: 10,
            color: labelColor,
            fontWeight: "700",
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: value ? 8 : 0,
            textAlign: "center",
          }}
        >
          {label}
        </Text>
      )}
      {value && (
        <Text
          style={{
            fontSize: fontSize ?? 18,
            color: valueColor,
            fontWeight: "700",
            textAlign: "center",
            lineHeight: (fontSize ?? 18) * 1.25,
          }}
        >
          {value}
        </Text>
      )}
    </Pressable>
  );
}
