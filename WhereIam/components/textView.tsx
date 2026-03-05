import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  FONT_SIZE,
  LINE_HEIGHT,
  RADIUS,
  SHADOW,
  SIZE,
  SPACING,
} from "@/constants/theme";

function TextView({
  texts,
  bulletColor = "#007aff",
  textColor = "#222",
  fontSize = FONT_SIZE.input,
  containerBg = "rgba(255,255,255,0.92)",

}: {
  texts?: string[];
  bulletColor?: string;
  textColor?: string;
  fontSize?: number;
  containerBg?: string;
}) {
  const items = (texts &&
    texts.length &&
    texts.filter(Boolean).map((t) => t.trim())) || [
    "Example Text 1",
    "Example Text 2",
    "Example Text 3",
    "Example Text 4",
    "Example Text 5",
  ];

  return (
    <View style={[styles.container, { backgroundColor: containerBg }]}>
      {items.map((t, i) => (
        <View key={i} style={styles.row}>
          <View style={[styles.bullet, { backgroundColor: bulletColor }]}>
            <Text style={styles.bulletText}>{i + 1}</Text>
          </View>
          <Text style={[styles.text, { color: textColor, fontSize }]}>{t}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.container,
    borderRadius: RADIUS.card,
    ...SHADOW.subtle,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: SPACING.container,
  },
  bullet: {
    width: SIZE.bullet,
    height: SIZE.bullet,
    borderRadius: SIZE.bullet / 2,
    backgroundColor: "#007aff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.container,
  },
  bulletText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: FONT_SIZE.errorText,
  },
  text: {
    flex: 1,
    color: "#222",
    fontSize: FONT_SIZE.input,
    lineHeight: LINE_HEIGHT.body,
    
  },
});

export default TextView;
