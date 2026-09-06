export const colors = {
  background: '#0B0D0C',
  backgroundSoft: '#101310',
  surface: '#151915',
  surfaceRaised: '#1C211C',
  primary: '#C9FF4A',
  primaryMuted: '#314118',
  coral: '#FF735C',
  text: '#F4F5EC',
  textMuted: '#969C8B',
  border: '#2B3028',
  danger: '#FF735C',
  warning: '#F9CC66',
  blue: '#67C6FF',
  purple: '#AE8CFF',
} as const;

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;
export const radius = { sm: 10, md: 18, lg: 28, xl: 36, pill: 999 } as const;

export const shadows = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.24,
    shadowRadius: 32,
    elevation: 8,
  },
} as const;
