import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { StyleSheet } from "react-native";
export default function BlurTabBackground() {
  return (
    <BlurView
      tint="systemChromeMaterial"
      intensity={30}
      style={StyleSheet.absoluteFill}
    />
  );
}
export function useBottomTabOverflow() {
  return useBottomTabBarHeight();
}
