import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import { useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
const source = require("../assets/sounds/confirm-tap-394001.mp3");

export function HapticTab(props: BottomTabBarButtonProps) {
  const player = useAudioPlayer(source);
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === "ios") {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
        player.seekTo(0);
        player.play();
      }}
    />
  );
}
