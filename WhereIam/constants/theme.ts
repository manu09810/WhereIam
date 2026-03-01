/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";


export const SPACING = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 14,
  xxl: 16,
  xxxl: 20,
  sheet: 24,
  iosBottom: 40,
  sectionGap: 48,
} as const;

export const RADIUS = {
  handle: 2,
  input: 14,
  card: 16,
  closeBtn: 50,
  sheet: 28,
} as const;

export const FONT_SIZE = {
  label: 11,
  errorText: 13,
  error: 14,
  body: 15,
  input: 16,
  title: 22,
  result: 28,
} as const;

export const SIZE = {
  handleWidth: 40,
  handleHeight: 4,
  icon: 22,
  switchIcon: 18,
  minSheetHeight: 320,
  convertPadding: 15,
} as const;

export const ALPHA = {
  loadingOpacity: 0.6,
  overlayBg: "rgba(0,0,0,0.5)",
  lightBorder: "rgba(0,0,0,0.08)",
  darkBorder: "rgba(255,255,255,0.15)",
  lightHandle: "rgba(0,0,0,0.15)",
  darkHandle: "rgba(255,255,255,0.3)",
  lightCard: "rgba(0,0,0,0.06)",
  darkCard: "rgba(255,255,255,0.12)",
  lightCardBorder: "rgba(0,0,0,0.07)",
  darkCardBorder: "rgba(255,255,255,0.16)",
  lightDimText: "rgba(17,17,17,0.5)",
  darkDimText: "rgba(255,255,255,0.55)",
  lightInput: "rgba(0,0,0,0.05)",
  darkInput: "rgba(255,255,255,0.1)",
  lightInputBorder: "rgba(0,0,0,0.12)",
  darkInputBorder: "rgba(255,255,255,0.22)",
} as const;
