import { router } from "expo-router";
import React from "react";
import { Pressable, Text, StyleSheet, View } from "react-native";
import { useAudioPlayer } from "expo-audio";
import { ALPHA, FONT_SIZE, RADIUS, SPACING } from "@/constants/theme";

const source = require("../assets/sounds/confirm-tap-394001.mp3");

export const BackButton = ({ colorButton }: { colorButton: string }) => {
  const player = useAudioPlayer(source);

  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={() => {
          player.seekTo(0);
          player.play();
          router.back();
        }}
        style={({ pressed }) => [styles.pill, { opacity: pressed ? 0.7 : 1 }]}
      >
        <Text style={[styles.label, { color: colorButton }]}>← Back</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.md,
    alignItems: "flex-start",
  },
  pill: {
    backgroundColor: ALPHA.glassBg,
    borderWidth: 1,
    borderColor: ALPHA.darkCard,
    borderRadius: RADIUS.closeBtn,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xl,
  },
  label: {
    fontSize: FONT_SIZE.error,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});
