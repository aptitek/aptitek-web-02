import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import { CvActionButton } from "~/components/atoms/CvActionButton/CvActionButton";

const meta: Meta<typeof CvActionButton> = {
  title: "Atoms/CvActionButton",
  component: CvActionButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost", "accent"],
    },
    children: { control: "text" },
    href: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Download PDF",
    variant: "primary",
    icon: <DownloadRoundedIcon sx={{ fontSize: 18 }} />,
  },
};

export const Secondary: Story = {
  args: {
    children: "Print Resume",
    variant: "secondary",
    icon: <PrintRoundedIcon sx={{ fontSize: 18 }} />,
  },
};

export const Ghost: Story = {
  args: {
    children: "Share",
    variant: "ghost",
    icon: <ShareRoundedIcon sx={{ fontSize: 18 }} />,
  },
};

export const Accent: Story = {
  args: {
    children: "View Online",
    variant: "accent",
    icon: <OpenInNewRoundedIcon sx={{ fontSize: 18 }} />,
  },
};

export const AllVariants: Story = {
  render: () => (
    <Box
      sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}
    >
      <CvActionButton
        variant="primary"
        icon={<DownloadRoundedIcon sx={{ fontSize: 18 }} />}
      >
        Primary
      </CvActionButton>
      <CvActionButton
        variant="secondary"
        icon={<PrintRoundedIcon sx={{ fontSize: 18 }} />}
      >
        Secondary
      </CvActionButton>
      <CvActionButton
        variant="ghost"
        icon={<ShareRoundedIcon sx={{ fontSize: 18 }} />}
      >
        Ghost
      </CvActionButton>
      <CvActionButton
        variant="accent"
        icon={<OpenInNewRoundedIcon sx={{ fontSize: 18 }} />}
      >
        Accent
      </CvActionButton>
    </Box>
  ),
};
