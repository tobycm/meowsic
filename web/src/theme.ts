import { colorsTuple, createTheme } from "@mantine/core";

const theme = createTheme({
  primaryColor: "primary",

  fontFamily: "Ubuntu, sans-serif",
  headings: { fontFamily: "Ubuntu, sans-serif" },

  colors: {
    primary: colorsTuple("#ffafcc"),
    secondary: colorsTuple("#cdb4db"),
    error: colorsTuple("#ff006e"),
    warn: colorsTuple("#ffbe0b"),
    info: colorsTuple("#ffc8dd"),
    success: colorsTuple("#3a86ff"),
    purp: colorsTuple("#571089"),
    paper: colorsTuple("#efd9ce"),
    vgrey: colorsTuple("#1e1e1e"),
  },
});

export default theme;
