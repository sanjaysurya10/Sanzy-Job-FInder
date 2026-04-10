import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark' as const,
    primary: {
      main: '#A78BFA',
      light: '#C4B5FD',
      dark: '#7C3AED',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#C084FC',
      light: '#E9D5FF',
      dark: '#A855F7',
      contrastText: '#ffffff',
    },
    background: {
      default: 'transparent',
      paper: 'rgba(255,255,255,0.06)',
    },
    text: {
      primary: 'rgba(255,255,255,0.95)',
      secondary: 'rgba(255,255,255,0.55)',
    },
    success: { main: '#34D399', light: 'rgba(52,211,153,0.15)' },
    warning: { main: '#FBBF24', light: 'rgba(251,191,36,0.15)' },
    error:   { main: '#F87171', light: 'rgba(248,113,113,0.15)' },
    info:    { main: '#60A5FA', light: 'rgba(96,165,250,0.15)' },
    divider: 'rgba(255,255,255,0.08)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.01em' },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    button: { fontWeight: 600, textTransform: 'none' as const },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: 16,
          transition: 'background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            background: 'rgba(255,255,255,0.10)',
            borderColor: 'rgba(167,139,250,0.4)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          },
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 600,
          padding: '8px 20px',
          textTransform: 'none',
        },
        contained: {
          background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #6D28D9 0%, #4C1D95 100%)',
          },
        },
        outlined: {
          borderColor: 'rgba(167,139,250,0.4)',
          color: '#C4B5FD',
          backdropFilter: 'blur(8px)',
          '&:hover': {
            borderColor: '#A78BFA',
            backgroundColor: 'rgba(167,139,250,0.1)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
          backdropFilter: 'blur(8px)',
        },
        outlined: {
          borderColor: 'rgba(255,255,255,0.2)',
          color: 'rgba(255,255,255,0.85)',
          backgroundColor: 'rgba(255,255,255,0.06)',
        },
        colorPrimary: {
          backgroundColor: 'rgba(124,58,237,0.3)',
          color: '#C4B5FD',
          border: '1px solid rgba(167,139,250,0.3)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { border: 'none', boxShadow: '4px 0 32px rgba(0,0,0,0.4)' },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' as const },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(8px)',
            color: 'rgba(255,255,255,0.9)',
            '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
            '&:hover fieldset': { borderColor: 'rgba(167,139,250,0.5)' },
            '&.Mui-focused fieldset': { borderColor: '#A78BFA' },
          },
          '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
          '& .MuiInputLabel-root.Mui-focused': { color: '#C4B5FD' },
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          textTransform: 'none',
          color: 'rgba(255,255,255,0.55)',
          '&.Mui-selected': { color: '#C4B5FD' },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: { backgroundColor: '#A78BFA' },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255,255,255,0.08)',
          color: 'rgba(255,255,255,0.85)',
        },
        head: {
          fontWeight: 700,
          color: 'rgba(255,255,255,0.95)',
          backgroundColor: 'rgba(255,255,255,0.04)',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.1)' },
        bar: { borderRadius: 4, background: 'linear-gradient(90deg,#7C3AED,#A855F7)' },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.1)',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: 'rgba(255,255,255,0.08)' },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: { color: 'rgba(255,255,255,0.5)' },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': { backgroundColor: 'rgba(167,139,250,0.12)' },
          '&.Mui-selected': {
            backgroundColor: 'rgba(124,58,237,0.2)',
            '&:hover': { backgroundColor: 'rgba(124,58,237,0.3)' },
          },
        },
      },
    },
  },
});

export default theme;
