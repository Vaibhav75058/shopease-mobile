// ═══════════════════════════════════════════════════════
//  GLOBAL TYPOGRAPHY — Consistent fonts across the app
// ═══════════════════════════════════════════════════════
//
//  Usage in any screen:
//    import { fonts, typography } from "../src/theme/fonts";
//
//    <Text style={typography.h1}>Heading</Text>
//    <Text style={typography.body}>Body text</Text>
//    <Text style={{ fontFamily: fonts.semiBold }}>Custom</Text>
export const fonts = {
  regular: "Poppins_400Regular",
  medium: "Poppins_500Medium",
  semiBold: "Poppins_600SemiBold",
  bold: "Poppins_600SemiBold", // Downscaled from 700 to 600
  extraBold: "Poppins_700Bold", // Downscaled from 800 to 700
  light: "Poppins_300Light",
};

export const typography = {
  // Headings
  h1: {
    fontFamily: fonts.bold,
    fontSize: 20, // Downscaled from 24
    color: "#1a1a2e",
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: fonts.semiBold,
    fontSize: 18, // Downscaled from 20
    color: "#1a1a2e",
    letterSpacing: -0.3,
  },
  h3: {
    fontFamily: fonts.semiBold,
    fontSize: 16, // Downscaled from 18
    color: "#1a1a2e",
  },
  h4: {
    fontFamily: fonts.medium,
    fontSize: 14, // Downscaled from 16
    color: "#1a1a2e",
  },
  h5: {
    fontFamily: fonts.semiBold,
    fontSize: 13, // Downscaled from 15
    color: "#1a1a2e",
  },
  h6: {
    fontFamily: fonts.semiBold,
    fontSize: 12, // Downscaled from 13
    color: "#1a1a2e",
  },

  // Body text
  body: {
    fontFamily: fonts.regular,
    fontSize: 13, // Downscaled from 14
    color: "#3c3c43",
    lineHeight: 18,
  },
  bodyMedium: {
    fontFamily: fonts.medium,
    fontSize: 13, // Downscaled from 14
    color: "#3c3c43",
    lineHeight: 18,
  },
  bodySmall: {
    fontFamily: fonts.regular,
    fontSize: 11, // Downscaled from 12
    color: "#8e8e93",
    lineHeight: 15,
  },

  // Subtitles
  subtitle: {
    fontFamily: fonts.medium,
    fontSize: 14, // Downscaled from 16
    color: "#1a1a2e",
  },
  subtitle1: {
    fontFamily: fonts.medium,
    fontSize: 14, // Downscaled from 16
    color: "#1a1a2e",
  },

  // Labels
  label: {
    fontFamily: fonts.medium,
    fontSize: 13, // Downscaled from 14
    color: "#3c3c43",
  },
  labelSmall: {
    fontFamily: fonts.medium,
    fontSize: 10, // Downscaled from 11
    color: "#8e8e93",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  // Buttons
  button: {
    fontFamily: fonts.semiBold,
    fontSize: 14, // Downscaled from 15
    color: "#fff",
  },
  buttonSmall: {
    fontFamily: fonts.medium,
    fontSize: 12, // Downscaled from 13
    color: "#fff",
  },

  // Prices
  price: {
    fontFamily: fonts.bold,
    fontSize: 20, // Downscaled from 22
    color: "#1a1a2e",
  },
  priceSmall: {
    fontFamily: fonts.semiBold,
    fontSize: 15, // Downscaled from 16
    color: "#1a1a2e",
  },

  // Captions
  caption: {
    fontFamily: fonts.regular,
    fontSize: 10, // Downscaled from 11
    color: "#aaa",
  },

  // Badge text
  badge: {
    fontFamily: fonts.bold,
    fontSize: 10, // Downscaled from 11
  },
};
