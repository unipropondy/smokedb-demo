
import { Platform } from 'react-native';

const ThemeBlue = {
  // ── Primary Brand ──
  primary: '#eb7c14ff',
  primaryDark: '#eb7c14ff',
  primaryLight: '#EFF6FF',
  primaryBorder: 'rgba(59,130,246,0.35)',

  // ── Backgrounds ──
  bgMain: '#F8FAFC',
  bgCard: '#FFFFFF',
  bgInput: '#F1F5F9',
  bgNav: '#FFFFFF',
  bgMuted: '#F1F5F9',
  bgOverlay: 'rgba(248, 250, 252, 0.95)',

  // ── Dark/Professional Palette ──
  bgDark: '#F8FAFC',
  cardDark: '#FFFFFF',
  borderDark: '#E2E8F0',
  bgDarkMuted: '#F1F5F9',

  // ── Text ──
  textPrimary: '#0c0c0cff',
  textSecondary: '#757575ff',
  textMuted: '#94a3b8',
  textInverse: '#FFFFFF',
  textBrand: '#3B82F6',

  // ── Borders ──
  border: '#E2E8F0',
  borderStrong: '#3A444E',
  borderBrand: 'rgba(59,130,246,0.3)',

  // ── Shadows ──
  shadowSm: {
    shadowColor: '#000000ff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: Platform.OS === 'android' ? 0 : 2,
  },
  shadowMd: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: Platform.OS === 'android' ? 0 : 4,
  },
  shadowLg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: Platform.OS === 'android' ? 0 : 8,
  },

  // ── Semantic Status Colors (kept for table grid) ──
  success: '#22C55E',
  successBg: '#F0FDF4',
  successBorder: 'rgba(34,197,94,0.35)',

  warning: '#F59E0B',
  warningBg: '#FFFBEB',
  warningBorder: 'rgba(245,158,11,0.35)',

  danger: '#EF4444',
  dangerBg: '#FEF2F2',
  dangerBorder: 'rgba(239,68,68,0.35)',

  info: '#3B82F6',
  infoBg: '#F0F9FF',
  infoBorder: 'rgba(59,130,246,0.35)',

  // ── Table status backgrounds (light versions) ──
  tableLocked: { bg: 'rgba(239,68,68,0.15)', border: '#EF4444' }, // Red for Reserved
  tableHold: { bg: 'rgba(59,130,246,0.15)', border: '#3B82F6' },
  tableSent: { bg: 'rgba(34,197,94,0.15)', border: '#22C55E' }, // Green for Sent/Dining
  tableSentOld: { bg: 'rgba(59,130,246,0.15)', border: '#3B82F6' },
  tableBillRequest: { bg: 'rgba(245,158,11,0.15)', border: '#F59E0B' }, // Amber for Checkout/Bill
  tableEmpty: { bg: '#FFFFFF', border: '#E8E0D5' },

  // ── Radius ──
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 16,
  radiusXl: 24,
  radiusFull: 999,
};

const ThemeOrange = {
  ...ThemeBlue,
  primary: '#FF5E1A',
  primaryDark: '#E04D10',
  primaryLight: '#FFF4EC',
  primaryBorder: 'rgba(255,94,26,0.35)',

  bgMain: '#FAF7F2',
  bgCard: '#FFFFFF',
  bgInput: '#F5F2EA',
  bgNav: '#FFFFFF',
  bgMuted: '#F5F2EA',
  bgOverlay: 'rgba(250, 247, 242, 0.95)',

  textBrand: '#FF5E1A',
  borderBrand: 'rgba(255,94,26,0.3)',
};

const ThemePremiumGold = {
  ...ThemeBlue,
  // ── Primary Brand ──
  primary: '#D4AF37',       // Premium Gold
  primaryDark: '#B2912D',   // Darker Gold
  primaryLight: '#2C2718',  // Very dark gold tint for backgrounds
  primaryBorder: 'rgba(212,175,55,0.35)',

  // ── Backgrounds ──
  bgMain: '#000000',        // Deep Black
  bgCard: '#111111',        // Very dark grey for cards
  bgInput: '#1A1A1A',       // Inputs
  bgNav: '#0A0A0A',         // Navigation bar background
  bgMuted: '#141414',       // Muted background sections
  bgOverlay: 'rgba(0, 0, 0, 0.95)', // Dark overlay

  // ── Dark/Professional Palette ──
  bgDark: '#050505',
  cardDark: '#111111',
  borderDark: '#262626',
  bgDarkMuted: '#0F0F0F',

  // ── Text ──
  textPrimary: '#F5F5F5',   // Off-white text on dark bg
  textSecondary: '#A3A3A3', // Light grey for secondary text
  textMuted: '#737373',     // Muted grey
  textInverse: '#000000',   // Black text on light/gold bg
  textBrand: '#D4AF37',     // Gold brand text

  // ── Borders ──
  border: '#262626',        // Dark grey border
  borderStrong: '#404040',  // Stronger grey border
  borderBrand: 'rgba(212,175,55,0.4)', // Gold border

  // ── Semantic Status Colors (Override ThemeBlue's pastels) ──
  success: '#10B981',
  successBg: 'rgba(16, 185, 129, 0.1)',
  successBorder: 'rgba(16, 185, 129, 0.3)',

  warning: '#F59E0B',
  warningBg: 'rgba(245, 158, 11, 0.1)',
  warningBorder: 'rgba(245, 158, 11, 0.3)',

  danger: '#EF4444',
  dangerBg: 'rgba(239, 68, 68, 0.1)',
  dangerBorder: 'rgba(239, 68, 68, 0.3)',

  info: '#3B82F6',
  infoBg: 'rgba(59, 130, 246, 0.1)',
  infoBorder: 'rgba(59, 130, 246, 0.3)',

  // ── Table status backgrounds (light versions) ──
  tableLocked: { bg: 'rgba(239,68,68,0.15)', border: '#EF4444' },
  tableHold: { bg: 'rgba(212,175,55,0.15)', border: '#D4AF37' }, // Gold for hold
  tableSent: { bg: 'rgba(34,197,94,0.15)', border: '#22C55E' },
  tableSentOld: { bg: 'rgba(212,175,55,0.15)', border: '#D4AF37' },
  tableBillRequest: { bg: 'rgba(245,158,11,0.15)', border: '#F59E0B' },
  tableEmpty: { bg: '#111111', border: '#262626' }, // Dark card for empty tables
};

const ThemeSilverGray = {
  ...ThemeBlue,
  // ── Primary Brand (Dark Gray) ──
  primary: '#374151',       // Dark Gray
  primaryDark: '#1F2937',   // Deeper Gray
  primaryLight: '#E5E7EB',  // Light Gray tint
  primaryBorder: 'rgba(55,65,81,0.35)',

  // ── Backgrounds (Light Gray) ──
  bgMain: '#F3F4F6',        // Light Gray background
  bgCard: '#FFFFFF',        // White cards for contrast
  bgInput: '#FFFFFF',       // Inputs
  bgNav: '#FFFFFF',         // Navigation bar background
  bgMuted: '#E5E7EB',       // Muted background sections
  bgOverlay: 'rgba(243, 244, 246, 0.95)', // Light overlay

  // ── Palette ──
  bgDark: '#E5E7EB',
  cardDark: '#F9FAFB',
  borderDark: '#D1D5DB',
  bgDarkMuted: '#D1D5DB',

  // ── Text ──
  textPrimary: '#111827',   // Almost black text
  textSecondary: '#4B5563', // Medium gray for secondary text
  textMuted: '#9CA3AF',     // Muted gray
  textInverse: '#FFFFFF',   // White text on dark gray bg
  textBrand: '#374151',     // Dark gray brand text

  // ── Borders ──
  border: '#D1D5DB',        // Light-medium gray border
  borderStrong: '#9CA3AF',  // Stronger gray border
  borderBrand: 'rgba(55,65,81,0.4)', // Dark gray border

  // ── Semantic Status Colors ──
  success: '#10B981',
  successBg: '#ECFDF5',
  successBorder: 'rgba(16, 185, 129, 0.35)',

  warning: '#F59E0B',
  warningBg: '#FFFBEB',
  warningBorder: 'rgba(245, 158, 11, 0.35)',

  danger: '#EF4444',
  dangerBg: '#FEF2F2',
  dangerBorder: 'rgba(239, 68, 68, 0.35)',

  info: '#3B82F6',
  infoBg: '#EFF6FF',
  infoBorder: 'rgba(59, 130, 246, 0.35)',

  // ── Table status backgrounds ──
  tableLocked: { bg: '#FEF2F2', border: '#EF4444' },
  tableHold: { bg: '#F3F4F6', border: '#374151' },
  tableSent: { bg: '#ECFDF5', border: '#10B981' },
  tableSentOld: { bg: '#F3F4F6', border: '#374151' },
  tableBillRequest: { bg: '#FFFBEB', border: '#F59E0B' },
  tableEmpty: { bg: '#FFFFFF', border: '#E5E7EB' },
};

/**
 * Active POS Theme
 * Swap this export to change the theme across the app instantly!
 */
export const Theme = ThemeSilverGray;


// Legacy Colors export to avoid breaking imports
export const Colors = {
  light: {
    text: Theme.textPrimary,
    background: Theme.bgMain,
    tint: Theme.primary,
    icon: Theme.textSecondary,
    tabIconDefault: Theme.textSecondary,
    tabIconSelected: Theme.primary,
  },
  dark: {
    text: Theme.textPrimary,
    background: Theme.bgMain,
    tint: Theme.primary,
    icon: Theme.textSecondary,
    tabIconDefault: Theme.textSecondary,
    tabIconSelected: Theme.primary,
  },
};
