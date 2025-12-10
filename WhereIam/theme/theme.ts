import { createTheme } from "@shopify/restyle";

const palette = {
  black: "#1a1a1a",
  white: "#ffffff",
  gray50: "#fafafa",
  gray100: "#f0f0f0",
  gray400: "#999",
  gray600: "#666",
  transparent: "transparent",
};

const theme = createTheme({
  colors: {
    mainBackground: palette.gray50,
    cardBackground: palette.white,
    cardBorder: palette.black,
    primaryText: palette.black,
    secondaryText: palette.gray600,
    tertiaryText: palette.gray400,
    transparent: palette.transparent,
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 12,
    l: 16,
    xl: 20,
    xxl: 24,
  },
  borderRadii: {
    s: 8,
    m: 12,
    l: 20,
    round: 50,
  },
  textVariants: {
    defaults: {},
    header: {
      fontSize: 36,
      fontWeight: "700",
      color: "primaryText",
      letterSpacing: -0.5,
    },
    cardLabel: {
      fontSize: 11,
      fontWeight: "600",
      color: "tertiaryText",
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    cardValue: {
      fontSize: 16,
      fontWeight: "700",
      color: "primaryText",
    },
    timeDisplay: {
      fontSize: 48,
      fontWeight: "700",
      color: "primaryText",
      letterSpacing: 2,
    },
    body: {
      fontSize: 16,
      color: "primaryText",
    },
  },
  cardVariants: {
    defaults: {
      backgroundColor: "cardBackground",
      borderRadius: "m",
      borderWidth: 1,
      borderColor: "cardBorder",
    },
    elevated: {
      backgroundColor: "cardBackground",
      borderRadius: "l",
      shadowColor: "cardBorder",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
  },
});

export type Theme = typeof theme;
export default theme;
