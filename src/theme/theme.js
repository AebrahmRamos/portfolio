import { createTheme } from '@mui/material/styles';

/**
 * Creates a Material-UI theme based on the specified mode (light/dark)
 * Implements the design system with color palette, typography, spacing, and component overrides
 * @param {string} mode - 'light' or 'dark'
 * @returns {Theme} Material-UI theme object
 */
export const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === 'dark' ? '#66C0C8' : '#377dff', // Teal/cyan for dark mode
      light: mode === 'dark' ? '#81d1d8' : '#5a95ff',
      dark: mode === 'dark' ? '#4da8b0' : '#2563d9',
    },
    secondary: {
      main: mode === 'dark' ? '#E5CA63' : '#f9b934', // Warm yellow for dark mode
      light: mode === 'dark' ? '#ebd780' : '#fac756',
      dark: mode === 'dark' ? '#d1b54e' : '#d79a1f',
    },
    success: {
      main: mode === 'dark' ? '#66bb6a' : '#2e7d32',
      light: '#81c784',
      dark: '#1b5e20',
    },
    info: {
      main: mode === 'dark' ? '#7BB8E2' : '#0288d1',
      light: mode === 'dark' ? '#95c8ea' : '#29b6f6',
      dark: mode === 'dark' ? '#5fa3ce' : '#01579b',
    },
    error: {
      main: mode === 'dark' ? '#D88A8E' : '#d32f2f',
      light: mode === 'dark' ? '#e0a2a5' : '#ef5350',
      dark: mode === 'dark' ? '#c47276' : '#c62828',
    },
    warning: {
      main: mode === 'dark' ? '#E8A666' : '#ed6c02',
      light: mode === 'dark' ? '#edb884' : '#ff9800',
      dark: mode === 'dark' ? '#d18e4e' : '#e65100',
    },
    background: {
      default: mode === 'dark' ? '#0F1419' : '#ffffff',
      paper: mode === 'dark' ? '#1A1F26' : '#ffffff',
      alt: mode === 'dark' ? '#1A1F26' : '#f7faff',
    },
    text: {
      primary: mode === 'dark' ? '#E8EBF0' : '#1e2022',
      secondary: mode === 'dark' ? '#9BA3AF' : '#677788',
    },
    divider: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3.75rem', // 60px
      lineHeight: 1.2,
      '@media (max-width:900px)': {
        fontSize: '3rem', // 48px
      },
      '@media (max-width:600px)': {
        fontSize: '2.5rem', // 40px
      },
    },
    h2: {
      fontWeight: 700,
      fontSize: '3rem', // 48px
      lineHeight: 1.3,
      '@media (max-width:900px)': {
        fontSize: '2.5rem', // 40px
      },
      '@media (max-width:600px)': {
        fontSize: '2.25rem', // 36px
      },
    },
    h3: {
      fontWeight: 700,
      fontSize: '2.25rem', // 36px
      lineHeight: 1.3,
      '@media (max-width:900px)': {
        fontSize: '2rem', // 32px
      },
      '@media (max-width:600px)': {
        fontSize: '1.875rem', // 30px
      },
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.875rem', // 30px
      lineHeight: 1.4,
      '@media (max-width:900px)': {
        fontSize: '1.75rem', // 28px
      },
      '@media (max-width:600px)': {
        fontSize: '1.5rem', // 24px
      },
    },
    h5: {
      fontWeight: 700,
      fontSize: '1.5rem', // 24px
      lineHeight: 1.4,
      '@media (max-width:600px)': {
        fontSize: '1.25rem', // 20px
      },
    },
    h6: {
      fontWeight: 700,
      fontSize: '1.25rem', // 20px
      lineHeight: 1.4,
      '@media (max-width:600px)': {
        fontSize: '1.125rem', // 18px
      },
    },
    body1: {
      fontSize: '1rem', // 16px
      lineHeight: 1.6,
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem', // 14px
      lineHeight: 1.6,
      fontWeight: 400,
    },
    subtitle1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8, // Base spacing unit of 8px
  shadows: mode === 'dark' ? [
    'none',
    '0 2px 8px rgba(0, 0, 0, 0.4)', // Card shadow - subtle
    '0 4px 12px rgba(0, 0, 0, 0.3)', // Button shadow - subtle
    '0 4px 16px rgba(0, 0, 0, 0.35)', // Hover shadow - subtle
    '0 1px 3px rgba(0,0,0,0.3)',
    '0 2px 6px rgba(0,0,0,0.3)',
    '0 3px 8px rgba(0,0,0,0.3)',
    '0 4px 12px rgba(0,0,0,0.3)',
    '0 6px 16px rgba(0,0,0,0.3)',
    '0 8px 20px rgba(0,0,0,0.3)',
    ...Array(15).fill('0 8px 24px rgba(0,0,0,0.3)'),
  ] : [
    'none',
    '0 10px 40px 10px rgba(140, 152, 164, 0.175)', // Card shadow
    '0 12px 15px rgba(140, 152, 164, 0.1)', // Button shadow
    '0 10px 40px 10px rgba(140, 152, 164, 0.175)', // Hover shadow
    '0 2px 4px rgba(0,0,0,0.1)',
    '0 4px 6px rgba(0,0,0,0.1)',
    '0 5px 15px rgba(0,0,0,0.1)',
    '0 10px 24px rgba(0,0,0,0.1)',
    '0 15px 35px rgba(0,0,0,0.1)',
    '0 20px 40px rgba(0,0,0,0.1)',
    ...Array(15).fill('0 20px 40px rgba(0,0,0,0.1)'),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
          margin: 0,
          padding: 0,
        },
        html: {
          scrollBehavior: 'smooth',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        body: {
          margin: 0,
          padding: 0,
        },
        '#root': {
          minHeight: '100vh',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '5px',
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '1rem',
          padding: '10px 24px',
          minHeight: '44px', // Touch target minimum
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'scale(1.02)',
          },
        },
        contained: {
          boxShadow: mode === 'dark' 
            ? '0 0 15px rgba(55, 125, 255, 0.3), 0 12px 15px rgba(140, 152, 164, 0.1)' 
            : '0 12px 15px rgba(140, 152, 164, 0.1)',
          '&:hover': {
            boxShadow: mode === 'dark'
              ? '0 0 25px rgba(55, 125, 255, 0.5), 0 10px 40px 10px rgba(140, 152, 164, 0.175)'
              : '0 10px 40px 10px rgba(140, 152, 164, 0.175)',
          },
        },
        outlined: {
          borderWidth: '2px',
          borderColor: mode === 'dark' ? 'rgba(55, 125, 255, 0.5)' : undefined,
          '&:hover': {
            borderWidth: '2px',
            borderColor: mode === 'dark' ? 'rgba(55, 125, 255, 0.8)' : undefined,
            boxShadow: mode === 'dark' ? '0 0 15px rgba(55, 125, 255, 0.3)' : undefined,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: mode === 'dark'
            ? '0 0 20px rgba(55, 125, 255, 0.2), 0 10px 40px 10px rgba(140, 152, 164, 0.175)'
            : '0 10px 40px 10px rgba(140, 152, 164, 0.175)',
          border: mode === 'dark' ? '1px solid rgba(55, 125, 255, 0.2)' : 'none',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: mode === 'dark'
              ? '0 0 30px rgba(55, 125, 255, 0.4), 0 10px 40px 10px rgba(140, 152, 164, 0.175)'
              : '0 10px 40px 10px rgba(140, 152, 164, 0.175)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              '& fieldset': {
                borderColor: '#377dff',
              },
            },
            '&.Mui-focused': {
              '& fieldset': {
                boxShadow: mode === 'dark' ? '0 0 10px rgba(55, 125, 255, 0.4)' : 'none',
              },
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          fontWeight: 500,
          transition: 'all 0.3s ease-in-out',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)'}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderLeft: 'none',
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

export default getTheme;
