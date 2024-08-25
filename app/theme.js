"use client"
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#64000d', // Dark red for House Lannister
    },
    secondary: {
      main: '#8C8C8C', // Slate gray for House Stark
    },
    background: {
      default: 'transparent', // Set to transparent to allow image to show
    },
  },
  typography: {
    fontFamily: 'Trajan Pro, serif',
  
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: 'url("/got-background.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
        },
      },
    },
  },
});

export default theme;