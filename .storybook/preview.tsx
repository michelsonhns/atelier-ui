import type { Preview } from "@storybook/react";
import { AtelierProvider } from "../src/design-system";
const preview: Preview = {
  globalTypes: {
    mode: {
      description: "Thème",
      toolbar: {
        icon: "paintbrush",
        items: [
          { value: "light", title: "Clair" },
          { value: "dark", title: "Sombre" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { mode: "light" },
  decorators: [
    (Story, context) => (
      <AtelierProvider
        mode={context.globals.mode === "dark" ? "dark" : "light"}
      >
        <div style={{ padding: 24 }}>
          <Story />
        </div>
      </AtelierProvider>
    ),
  ],
  parameters: {
    layout: "padded",
    controls: { expanded: true },
    a11y: { config: { rules: [{ id: "region", enabled: false }] } },
  },
  tags: ["autodocs"],
};
export default preview;
