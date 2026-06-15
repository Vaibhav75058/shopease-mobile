// ═══════════════════════════════════════════════════════
//  GLOBAL COLORS — Single source of truth for all colors
// ═══════════════════════════════════════════════════════
//
//  Usage:
//    import { colors } from "../src/theme/colors";
//    backgroundColor: colors.background
//    color: colors.primary

export const colors = {
  // Brand (Original Action Pink/Coral)
  primary: "#e94560",
  primaryLight: "#ffeef1",
  primaryDark: "#b82d43",

  // Secondary (Blue)
  secondary: "#2874f0",
  secondaryLight: "#eef4ff",
  secondaryDark: "#1a5dc8",

  // Accent / Danger
  accent: "#e94560",
  accentLight: "#ffeef1",

  // Success / Warning
  success: "#34c759",
  successLight: "#e9fff1",
  warning: "#ff9500",
  warningLight: "#fff8e1",

  // Backgrounds
  background: "#f5f7fb",
  surface: "#ffffff",
  cardBg: "#ffffff",
  inputBg: "#f5f5f5",

  // Text
  textPrimary: "#1a1a2e",
  textSecondary: "#3c3c43",
  textMuted: "#8e8e93",
  textLight: "#aaaaaa",
  textWhite: "#ffffff",

  // Borders
  border: "#e8ecf0",
  borderLight: "#f0f0f0",
  divider: "#f0f0f0",

  // Status
  statusProcessing: "#ff9500",
  statusShipped: "#2874f0",
  statusDelivered: "#34c759",
  statusCancelled: "#e94560",

  // Overlay
  overlay: "rgba(0,0,0,0.5)",
  overlayLight: "rgba(0,0,0,0.06)",

  // Star rating
  starFilled: "#ffc107",
  starEmpty: "#e0e0e0",

  // Buy Now (orange)
  buyNow: "#fb641b",

  // Aliases / Fallbacks for missing tokens used in refactored screens
  text: "#1a1a2e",
  card: "#ffffff",
  danger: "#e94560",
  error: "#e94560",
  info: "#2874f0",
};
