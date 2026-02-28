import React from "react";
import { View, Text, StyleSheet } from "react-native";

function TextView({
  texts,
  bulletColor = "#007aff",
  textColor = "#222",
  fontSize = 16,
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
    padding: 12,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  bullet: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#007aff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  bulletText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  text: {
    flex: 1,
    color: "#222",
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 6, 
  },
});

export default TextView;
