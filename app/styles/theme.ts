export const theme = {
  colors: {
    // Main background colors
    background: {
      primary: '#0A0A0A',    // Almost black
      secondary: '#18181B',  // Very dark gray
      accent: '#27272A',     // Slightly lighter dark gray for hover
    },
    // Text colors
    text: {
      primary: '#E4E4E7',    // Light gray for main text
      secondary: '#A1A1AA',  // Medium gray for secondary text
      accent: '#FFFFFF',     // Pure white for emphasis
    },
    // Brand colors
    brand: {
      primary: '#8B5CF6',    // Softer purple
      secondary: '#A78BFA',  // Lighter purple for hover
      success: '#22C55E',    // Vibrant green
      warning: '#F59E0B',    // Warm amber
      error: '#EF4444',      // Bright red
    },
    // UI element colors
    ui: {
      border: '#27272A',     // Dark border
      shadow: 'rgba(0, 0, 0, 0.5)', // Darker shadow
      hover: '#27272A',      // Hover state
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    full: '9999px',
  },
  typography: {
    fontFamily: {
      sans: 'Inter, system-ui, -apple-system, sans-serif',
    },
    fontSize: {
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
} 