import type { Meta, StoryObj } from "@storybook/react-vite";
import { CvDocument } from "~/components/organisms/Cv/CvDocument";
import cvData from "~/content/cv/cv-data.json";

const meta: Meta<typeof CvDocument> = {
  title: "Organisms/CvDocument",
  component: CvDocument,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    cvData,
  },
};

export default meta;
type Story = StoryObj<typeof CvDocument>;

export const FluidLight: Story = {
  args: {
    initialTheme: "light",
  },
};

export const FluidDark: Story = {
  args: {
    initialTheme: "dark",
  },
};
