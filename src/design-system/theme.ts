import { createTheme, type PaletteMode } from "@mui/material";
export const tokens = {
  colors: {
    primary: "#7057D9",
    secondary: "#337E75",
    success: "#247A55",
    warning: "#A26212",
    error: "#C24152",
  },
  radius: { small: 6, medium: 12, large: 20 },
  spacing: [0, 4, 8, 12, 16, 24, 32, 48, 64],
} as const;
export const createAtelierTheme = (mode: PaletteMode = "light") =>
  createTheme({
    palette: {
      mode,
      primary: { main: mode === "light" ? tokens.colors.primary : "#B4A2FF" },
      secondary: {
        main: mode === "light" ? tokens.colors.secondary : "#8DCBC1",
      },
      success: { main: mode === "light" ? tokens.colors.success : "#82D5AE" },
      warning: { main: mode === "light" ? tokens.colors.warning : "#F3CA80" },
      error: { main: mode === "light" ? tokens.colors.error : "#FFA8B3" },
      background: {
        default: mode === "light" ? "#FAF9FC" : "#16151D",
        paper: mode === "light" ? "#FFFFFF" : "#211F2B",
      },
      text: {
        primary: mode === "light" ? "#242333" : "#F3F0FC",
        secondary: mode === "light" ? "#6B687A" : "#B7B1C7",
      },
      divider: mode === "light" ? "#ECEAF2" : "#383342",
    },
    typography: {
      fontFamily: 'Inter, "Segoe UI", sans-serif',
      h3: { fontWeight: 650, letterSpacing: "-1.5px" },
      h4: { fontWeight: 650, letterSpacing: "-1px" },
      h6: { fontWeight: 650 },
      button: { textTransform: "none", fontWeight: 600 },
      body2: { lineHeight: 1.7 },
    },
    shape: { borderRadius: tokens.radius.medium },
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { borderRadius: 8, padding: "10px 18px" },
          sizeSmall: { padding: "6px 12px" },
        },
      },
      MuiChip: {
        styleOverrides: { root: { fontWeight: 600, borderRadius: 6 } },
      },
      MuiTextField: { defaultProps: { size: "small" } },
      MuiTab: {
        styleOverrides: {
          root: { textTransform: "none", minHeight: 48, fontWeight: 600 },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: { margin: 0 },
          "*": { boxSizing: "border-box" },
          "a:focus-visible, button:focus-visible, [tabindex]:focus-visible, .Mui-focusVisible":
            {
              outline: "3px solid",
              outlineColor: mode === "light" ? "#7057D9" : "#B4A2FF",
              outlineOffset: "3px",
            },
          "@media (prefers-reduced-motion: reduce)": {
            "*, *::before, *::after": {
              animationDuration: "0.01ms !important",
              animationIterationCount: "1 !important",
              transitionDuration: "0.01ms !important",
              scrollBehavior: "auto !important",
            },
          },
        },
      },
    },
  });
