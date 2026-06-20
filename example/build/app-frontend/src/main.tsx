import React from 'react';
import ReactDOM from 'react-dom/client';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { App } from './App';
import './index.css';

const theme = createTheme({
  palette: {
    primary: { main: '#18181B' },
    secondary: { main: '#FAFAFA' },
    background: { default: '#FAFAFA', paper: '#FFFFFF' },
  },
  typography: {
    fontFamily: '"Figtree", sans-serif',
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#6366F1',
            color: '#FFFFFF',
            '&:hover': { backgroundColor: '#4F46E5' },
          },
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
