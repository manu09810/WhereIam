import { router } from "expo-router";
import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { useAudioPlayer } from "expo-audio";
const source = require("../assets/sounds/confirm-tap-394001.mp3");
export const BackButton = ({ colorButton }: { colorButton: string }) => {
  const player = useAudioPlayer(source);

  return (
    <Pressable
      onPress={() => {
        player.play();
        player.seekTo(0);
        setTimeout(() => {
          router.back();
        }, 300);
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
