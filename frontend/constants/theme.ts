import { Platform } from 'react-native';

/**
 * Blue POS Theme
 * Primary: Blue #3B82F6
 * Background: White #FFFFFF
 */

export const Theme = {
  // ── Primary Brand ──
  primary: '#3B82F6',
  primaryDark: '#1D4ED8',
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
  bgDark: '#0F172A',
  cardDark: '#1E293B',
  borderDark: '#334155',
  bgDarkMuted: '#334155',

  // ── Text ──
  textPrimary: '#0c0c0cff',
  textSecondary: '#757575ff',
  textMuted: '#ffffffff',
  textInverse: '#ffffffff',
  textBrand: '#3B82F6',

  // ── Borders ──
  border: '#9d9696ff',
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
