// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ffafcc",
    },
    secondary: {
      main: "#cdb4db",
    },
    error: {
      main: "#ff006e",
    },
    warning: {
      main: "#ffbe0b",
    },
    info: {
      main: "#ffc8dd",
    },
    success: {
      main: "#3a86ff",
    },
    background: {
      default: "#571089", // Light blue background

      paper: "#efd9ce",
    },
  },
});

export default theme;
