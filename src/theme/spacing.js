// ═══════════════════════════════════════════════════════
//  GLOBAL SPACING — Consistent spacing & sizing
// ═══════════════════════════════════════════════════════
//
//  Usage:
//    import { spacing, radius, shadows } from "../src/theme/spacing";

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,

  // Aliases for missing tokens
  s: 8,
  m: 12,
  l: 16,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 50,

  // Aliases for missing tokens
  s: 8,
  m: 12,
  l: 16,
  full: 9999,
  round: 9999,
  xxl: 32,
};

export const shadows = {
  sm: {
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  md: {
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  lg: {
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },

  // Aliases for missing tokens
  small: {
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  medium: {
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
};
