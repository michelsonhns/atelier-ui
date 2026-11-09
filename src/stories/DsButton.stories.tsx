import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";
import { Stack } from "@mui/material";
import { DsButton } from "../design-system";
const meta = {
  title: "Composants/DsButton",
  component: DsButton,
  args: { children: "Continuer", onClick: fn() },
  argTypes: {
    variant: { control: "select", options: ["contained", "outlined", "text"] },
    size: { control: "select", options: ["small", "medium", "large"] },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Action principale. Entrée et Espace activent le bouton. Un bouton désactivé est exclu de la tabulation ; un bouton icône doit avoir un nom accessible.",
      },
    },
  },
} satisfies Meta<typeof DsButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Principal: Story = {};
export const Secondaire: Story = { args: { variant: "outlined" } };
export const Discret: Story = { args: { variant: "text" } };
export const Petit: Story = { args: { size: "small" } };
export const Grand: Story = { args: { size: "large" } };
export const Desactive: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("button")).toBeDisabled();
  },
};
export const Chargement: Story = { args: { loading: true } };
export const Clavier: Story = {
  render: (args) => (
    <Stack direction="row" spacing={2}>
      <DsButton {...args} />
      <DsButton disabled>Indisponible</DsButton>
      <DsButton variant="outlined">Suivant</DsButton>
    </Stack>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement),
      button = canvas.getByRole("button", { name: "Continuer" });
    button.focus();
    await expect(button).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    await expect(args.onClick).toHaveBeenCalledTimes(2);
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: "Suivant" })).toHaveFocus();
  },
};
