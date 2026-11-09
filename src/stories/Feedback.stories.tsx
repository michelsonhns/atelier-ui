import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Alert,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
  Stack,
  Tab,
  Tabs,
} from "@mui/material";
import { expect, userEvent, within } from "@storybook/test";
import { DsButton } from "../design-system";
const meta = {
  title: "Compositions/Retours et navigation",
  parameters: {
    docs: {
      description: {
        component:
          "Alertes, progression nommée, dialogue avec confinement et restitution du focus, onglets accessibles avec les flèches puis Entrée.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Alertes: Story = {
  render: () => (
    <Stack spacing={2}>
      {(["success", "info", "warning", "error"] as const).map((severity) => (
        <Alert key={severity} severity={severity}>
          {
            {
              success: "Modifications enregistrées.",
              info: "Votre espace sera disponible prochainement.",
              warning: "Votre session expire bientôt.",
              error: "Enregistrement impossible. Réessayez.",
            }[severity]
          }
        </Alert>
      ))}
    </Stack>
  ),
};
export const Progression: Story = {
  render: () => (
    <LinearProgress
      aria-label="Préparation de votre espace"
      variant="determinate"
      value={68}
    />
  ),
};
export const ProgressionIndeterminee: Story = {
  render: () => <LinearProgress aria-label="Chargement du contenu" />,
};
function Modal() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <DsButton onClick={() => setOpen(true)}>Ouvrir le dialogue</DsButton>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle id="dialog-title">Confirmer votre choix</DialogTitle>
        <DialogContent>
          <DialogContentText id="dialog-description">
            Le focus reste dans le dialogue. Échap le ferme et rend le focus au
            bouton d’ouverture.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <DsButton autoFocus variant="outlined" onClick={() => setOpen(false)}>
            Annuler
          </DsButton>
          <DsButton onClick={() => setOpen(false)}>Confirmer</DsButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
export const Dialogue: Story = {
  render: () => <Modal />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement),
      body = within(canvasElement.ownerDocument.body),
      trigger = canvas.getByRole("button", { name: "Ouvrir le dialogue" });
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    const dialog = await body.findByRole("dialog"),
      cancel = within(dialog).getByRole("button", { name: "Annuler" });
    await expect(cancel).toHaveFocus();
    await userEvent.tab();
    await expect(
      within(dialog).getByRole("button", { name: "Confirmer" }),
    ).toHaveFocus();
    await userEvent.tab();
    await expect(cancel).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await expect(trigger).toHaveFocus();
  },
};
function Navigation() {
  const [tab, setTab] = useState(0);
  return (
    <>
      <Tabs
        aria-label="Documentation"
        value={tab}
        onChange={(_, value) => setTab(value)}
      >
        {["Aperçu", "Usage"].map((label, i) => (
          <Tab
            key={label}
            id={`example-tab-${i}`}
            aria-controls={`example-panel-${i}`}
            label={label}
          />
        ))}
      </Tabs>
      {["Présentation du composant.", "Règles d’utilisation."].map(
        (text, i) => (
          <Box
            key={text}
            role="tabpanel"
            id={`example-panel-${i}`}
            aria-labelledby={`example-tab-${i}`}
            hidden={tab !== i}
            tabIndex={0}
            sx={{ p: 2 }}
          >
            {text}
          </Box>
        ),
      )}
    </>
  );
}
export const Onglets: Story = {
  render: () => <Navigation />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole("tab", { name: "Aperçu" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("tab", { name: "Usage" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(canvas.getByRole("tabpanel")).toHaveTextContent(
      "Règles d’utilisation.",
    );
  },
};
