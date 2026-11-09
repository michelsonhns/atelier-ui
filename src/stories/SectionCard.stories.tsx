import type { Meta, StoryObj } from "@storybook/react";
import { DsButton, SectionCard } from "../design-system";
const meta = {
  title: "Composants/SectionCard",
  component: SectionCard,
  args: {
    title: "Votre espace de travail",
    description: "Regroupez les informations d’un même sujet.",
    children: <DsButton>Ouvrir le projet</DsButton>,
  },
  parameters: {
    docs: {
      description: {
        component:
          "Section nommée par son titre h2. Placer les cartes sous un titre h1. Les actions restent des contrôles explicites. Accepte les propriétés Paper et sx sous forme d’objet, de fonction ou de tableau.",
      },
    },
  },
} satisfies Meta<typeof SectionCard>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Standard: Story = {};
export const SansDescription: Story = { args: { description: undefined } };
export const TitreLong: Story = {
  args: {
    title:
      "Un titre long reste lisible sur un écran étroit et conserve sa hiérarchie",
    sx: { maxWidth: 320 },
  },
};
export const Personnalisee: Story = {
  args: {
    sx: [
      { maxWidth: 520 },
      (theme) => ({ borderColor: theme.palette.primary.main }),
    ],
  },
};
