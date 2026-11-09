import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Checkbox,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import { expect, userEvent, within } from "@storybook/test";
import { DsButton } from "../design-system";
const meta = {
  title: "Compositions/Formulaires",
  parameters: {
    docs: {
      description: {
        component:
          "Composants MUI stylés par AtelierProvider. Chaque champ possède un libellé ; aria-describedby relie les erreurs au champ. Tab change de contrôle, Espace active les sélections et Entrée soumet le formulaire.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Champs: Story = {
  render: () => (
    <Stack spacing={3} sx={{ maxWidth: 400 }}>
      <TextField label="Nom complet" autoComplete="name" />
      <TextField
        label="Adresse e-mail"
        type="email"
        helperText="Utilisez votre adresse professionnelle."
      />
      <TextField select label="Rôle" defaultValue="designer">
        <MenuItem value="designer">Designer</MenuItem>
        <MenuItem value="developer">Développeur</MenuItem>
      </TextField>
    </Stack>
  ),
};
export const Erreur: Story = {
  render: () => (
    <TextField
      label="Adresse e-mail"
      defaultValue="invalide"
      error
      helperText="Saisissez une adresse e-mail valide."
    />
  ),
};
export const Desactive: Story = {
  render: () => (
    <TextField label="Identifiant" defaultValue="atelier-001" disabled />
  ),
};
export const LectureSeule: Story = {
  render: () => (
    <TextField
      label="Référence"
      defaultValue="PROJ-001"
      slotProps={{ input: { readOnly: true } }}
      helperText="Cette référence est générée automatiquement."
    />
  ),
};
function Choices() {
  const [checked, setChecked] = useState(false),
    [enabled, setEnabled] = useState(false);
  return (
    <Stack>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
        }
        label="Recevoir les nouveautés"
      />
      <FormControlLabel
        control={
          <Switch
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />
        }
        label="Activer les notifications"
      />
      <FormControlLabel
        control={<Checkbox disabled />}
        label="Option indisponible"
      />
    </Stack>
  );
}
export const Selections: Story = {
  render: () => <Choices />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement),
      checkbox = canvas.getByRole("checkbox", {
        name: "Recevoir les nouveautés",
      });
    checkbox.focus();
    await userEvent.keyboard(" ");
    await expect(checkbox).toBeChecked();
    await userEvent.tab();
    const toggle = canvas.getByRole("switch", {
      name: "Activer les notifications",
    });
    await expect(toggle).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(toggle).toBeChecked();
  },
};
function Profile() {
  const [name, setName] = useState(""),
    [error, setError] = useState(false),
    [saved, setSaved] = useState(false);
  return (
    <Stack
      component="form"
      aria-label="Exemple de profil"
      noValidate
      spacing={2}
      sx={{ maxWidth: 400 }}
      onSubmit={(e) => {
        e.preventDefault();
        setError(!name.trim());
        setSaved(!!name.trim());
        if (!name.trim()) e.currentTarget.querySelector("input")?.focus();
      }}
    >
      <TextField
        label="Nom complet"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={error}
        helperText={error ? "Veuillez saisir votre nom." : undefined}
      />
      <DsButton type="submit">Enregistrer</DsButton>
      <span role="status">{saved ? "Profil enregistré" : ""}</span>
    </Stack>
  );
}
export const ValidationClavier: Story = {
  render: () => <Profile />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement),
      input = canvas.getByRole("textbox", { name: "Nom complet" });
    input.focus();
    await userEvent.tab();
    await expect(canvas.getByRole("button")).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(input).toHaveFocus();
    await expect(input).toHaveAttribute("aria-invalid", "true");
    await userEvent.type(input, "Camille Martin");
    await userEvent.keyboard("{Enter}");
    await expect(canvas.getByRole("status")).toHaveTextContent(
      "Profil enregistré",
    );
  },
};
