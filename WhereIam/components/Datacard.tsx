import React, { useEffect, useRef } from "react";
import { Pressable, Text } from "react-native";
import { useAudioPlayer } from "expo-audio";

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
  block?: boolean; // nuevo
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
  block = false, // nuevo
}: DataCardProps) {
  const readable = getReadableTextColor(accentColor);
  const valueColor = pickAccessibleTextColor(
    accentColor,
    textColor || readable
  );

  const player = useAudioPlayer(source);

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
      style={{
        flex: block ? 0 : 1, // cambiado
        width: block ? "100%" : undefined, // cambiado
        backgroundColor: accentColor,
        borderRadius: 16,
        padding: 10,
        marginHorizontal: 6,
        marginVertical: 12,
        borderWidth: 1,
        borderColor: accentColor,
        alignItems: "center",
        justifyContent: "center",
        minHeight: height ?? 100,
      }}
    >
      {label && (
        <Text
          style={{
            fontSize: fontSize ?? 18,
            color: readable,
            fontWeight: "600",
            marginBottom: 10,
            textTransform: "uppercase",
            letterSpacing: 1,
            textAlign: "center",
          }}
        >
          {label}
        </Text>
      )}
      {value && (
        <Text
          style={{
            fontSize: (fontSize ?? 22) - 6,
            color: valueColor,
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          {value}
        </Text>
      )}
    </Pressable>
  );
}
