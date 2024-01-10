import { createTheme } from "@mui/material";

const Theme = createTheme({
  typography: {
    fontSize: 12,
    fontFamily: [
      "Inter Variable",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          fontSize: "14px",
        },
      },
    },
  },
  palette: {
    mode: "light",
    primary: {
      main: "#0094fd",
      600: "#0068B2",
    },
    secondary: {
      main: "#203865",
    },
    error: {
      main: "#ff5555",
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 480,
      md: 768,
      lg: 1024,
      xl: 1200,
    },
  },
});

export default Theme;
