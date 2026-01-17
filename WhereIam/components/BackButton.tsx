import { router } from "expo-router";
import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";

export const BackButton = ({ colorButton }: { colorButton: string }) => {
  return (
    <Pressable
      onPress={() => {
        router.back();
      }}
      style={styles.backButton}
    >
      <Text style={[styles.backButton, { color: colorButton }]}>← Back</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  backButton: {
    fontSize: 16,
    fontWeight: "600",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});
