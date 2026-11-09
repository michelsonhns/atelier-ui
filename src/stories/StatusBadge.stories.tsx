import type { Meta, StoryObj } from "@storybook/react";
import { StatusBadge } from "../design-system";
const meta = {
  title: "Composants/StatusBadge",
  component: StatusBadge,
  args: { status: "active" },
  argTypes: {
    status: { control: "select", options: ["active", "pending", "inactive"] },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Information statique non interactive. Le libellé complète la couleur. Les changements asynchrones doivent être annoncés par une région aria-live de l’application si nécessaire.",
      },
    },
  },
} satisfies Meta<typeof StatusBadge>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Actif: Story = {};
export const EnAttente: Story = { args: { status: "pending" } };
export const Inactif: Story = { args: { status: "inactive" } };
