import { forwardRef, useId, useMemo, type ReactNode } from "react";
import {
  Box,
  Button,
  Chip,
  CssBaseline,
  Paper,
  Stack,
  ThemeProvider,
  Typography,
  type ButtonProps,
  type PaletteMode,
  type PaperProps,
  type SxProps,
  type Theme,
} from "@mui/material";
import { createAtelierTheme } from "./theme";
export { tokens, createAtelierTheme } from "./theme";
export type DsButtonProps = ButtonProps;
/** Action principale par défaut ; transmet la ref au bouton HTML. */
export const DsButton = forwardRef<HTMLButtonElement, DsButtonProps>(
  function DsButton(props, ref) {
    return <Button ref={ref} variant="contained" {...props} />;
  },
);
export interface AtelierProviderProps {
  children: ReactNode;
  mode?: PaletteMode;
}
/** Thème et styles de base ; le mode est contrôlé par l’application hôte. */
export function AtelierProvider({
  children,
  mode = "light",
}: AtelierProviderProps) {
  const theme = useMemo(() => createAtelierTheme(mode), [mode]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
export type SectionCardProps = Omit<PaperProps, "title"> & {
  title: string;
  description?: string;
  children: ReactNode;
};
/** Section nommée par un titre h2. Accepte sx sous forme d’objet, fonction ou tableau. */
export function SectionCard({
  title,
  description,
  children,
  sx = [],
  ...props
}: SectionCardProps) {
  const id = useId();
  return (
    <Paper
      component="section"
      aria-labelledby={id}
      variant="outlined"
      {...props}
      sx={
        [
          { overflow: "hidden" },
          ...(Array.isArray(sx) ? sx : [sx]),
        ] as SxProps<Theme>
      }
    >
      <Box sx={{ p: 3, pb: 2 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
        >
          <Typography component="h2" id={id} variant="h6" fontSize={16}>
            {title}
          </Typography>
          <Chip
            label="Stable"
            size="small"
            sx={{
              height: 21,
              fontSize: 10,
              bgcolor: "action.hover",
              color: "text.secondary",
            }}
          />
        </Stack>
        {description && (
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {description}
          </Typography>
        )}
      </Box>
      <Box sx={{ p: 3, pt: 1 }}>{children}</Box>
    </Paper>
  );
}
export interface StatusBadgeProps {
  status: "active" | "pending" | "inactive";
}
/** Statut statique exprimé par le texte et la couleur. */
export function StatusBadge({ status }: StatusBadgeProps) {
  const values = {
    active: ["Actif", "success"],
    pending: ["En attente", "warning"],
    inactive: ["Inactif", "default"],
  } as const;
  return (
    <Chip
      size="small"
      variant="outlined"
      label={values[status][0]}
      color={values[status][1]}
    />
  );
}
