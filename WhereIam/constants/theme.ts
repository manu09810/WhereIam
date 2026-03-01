export const SPACING = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 10,
  container: 12,
  xl: 14,
  xxl: 16,
  inner: 18,
  xxxl: 20,
  sheet: 24,
  hero: 28,
  section: 32,
  iosBottom: 40,
  sectionGap: 48,
  emptyState: 64,
} as const;

export const RADIUS = {
  handle: 2,
  input: 14,
  card: 16,
  widget: 18,
  large: 20,
  hero: 22,
  page: 24,
  sheet: 28,
  closeBtn: 50,
} as const;

export const FONT_SIZE = {
  caption: 10,
  label: 11,
  micro: 12,
  errorText: 13,
  error: 14,
  body: 15,
  input: 16,
  subheading: 18,
  large: 20,
  title: 22,
  display: 30,
  result: 28,
  headline: 34,
  clock: 52,
  temperature: 72,
} as const;

export const MODAL = {
  minHeight: 320,
  weatherMinHeight: 400,
  convertPadding: 15,
} as const;

export const SIZE = {
  handleWidth: 40,
  handleHeight: 4,
  icon: 22,
  switchIcon: 18,
  bullet: 28,
  paginationBtn: 44,
  tabBar: 70,
  newsCard: 130,
  mapWidget: 170,
  heroCard: 240,
} as const;

export const ALPHA = {
  loadingOpacity: 0.6,
  highlight: 0.48,
  subtitle: 0.85,
  imageBg: 0.88,
  overlayBg: "rgba(0,0,0,0.5)",
  glassBg: "rgba(0,0,0,0.36)",
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
  nearWhiteText: "rgba(255,255,255,0.95)",
  tabBarInactive: "rgba(0,0,0,0.53)",
} as const;

export const LINE_HEIGHT = {
  tight: 18,
  body: 20,
  relaxed: 24,
  loose: 28,
  subheading: 30,
  title: 32,
  temperature: 80,
} as const;

export const SHADOW = {
  hero: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 10,
  },
  widget: {
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 8,
  },
  subtle: {
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 3,
  },
} as const;

export const TIMING = {
  soundDelay: 300,
  hapticDelay: 500,
  switchDelay: 200,
} as const;
