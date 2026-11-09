import type { Meta, StoryObj } from "@storybook/react";
import { Box, Stack, Typography } from "@mui/material";
import { AtelierProvider, DsButton, tokens } from "../design-system";
const meta = {
  title: "Fondations/Tokens et thèmes",
  parameters: {
    docs: {
      description: {
        component:
          "AtelierProvider fournit le thème et CssBaseline. Son mode est contrôlé par l’application ; il ne lit aucun stockage navigateur et fonctionne en rendu serveur. Espacement MUI : unité de 8 px. tokens.spacing répertorie les valeurs recommandées en pixels. Les couleurs sémantiques du thème s’adaptent au mode sombre.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Couleurs: Story = {
  render: () => (
    <Stack spacing={2}>
      {Object.entries(tokens.colors).map(([key, color]) => (
        <Stack key={key} direction="row" spacing={2} alignItems="center">
          <Box
            aria-hidden
            sx={{ width: 64, height: 40, bgcolor: color, borderRadius: 1 }}
          />
          <Typography>
            {key} : {color}
          </Typography>
        </Stack>
      ))}
    </Stack>
  ),
};
export const Typographie: Story = {
  render: () => (
    <Stack spacing={2}>
      <Typography variant="h3" component="h1">
        Titre de page
      </Typography>
      <Typography variant="h4" component="h2">
        Titre de section
      </Typography>
      <Typography variant="h6" component="h3">
        Sous-section
      </Typography>
      <Typography>Texte courant et contenu de l’interface.</Typography>
      <Typography variant="body2" color="text.secondary">
        Texte secondaire lisible.
      </Typography>
    </Stack>
  ),
};
export const Espacements: Story = {
  render: () => (
    <Stack spacing={2}>
      {tokens.spacing.map((n) => (
        <Stack key={n} direction="row" gap={2} alignItems="center">
          <Typography sx={{ width: 48 }}>{n} px</Typography>
          <Box
            aria-hidden
            sx={{ width: n * 3, height: 16, bgcolor: "primary.main" }}
          />
        </Stack>
      ))}
    </Stack>
  ),
};
export const ThemeClair: Story = {
  render: () => (
    <AtelierProvider mode="light">
      <Box sx={{ bgcolor: "background.default", color: "text.primary", p: 3 }}>
        <Typography mb={2}>Thème clair</Typography>
        <DsButton>Continuer</DsButton>
      </Box>
    </AtelierProvider>
  ),
};
export const ThemeSombre: Story = {
  render: () => (
    <AtelierProvider mode="dark">
      <Box sx={{ bgcolor: "background.default", color: "text.primary", p: 3 }}>
        <Typography mb={2}>Thème sombre</Typography>
        <DsButton>Continuer</DsButton>
      </Box>
    </AtelierProvider>
  ),
};
