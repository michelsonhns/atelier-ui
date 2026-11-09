import { defineConfig } from "tsup";
export default defineConfig({
  entry: ["src/design-system/index.tsx"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  outDir: "lib",
  target: "es2020",
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "@mui/material",
    "@emotion/react",
    "@emotion/styled",
  ],
});
