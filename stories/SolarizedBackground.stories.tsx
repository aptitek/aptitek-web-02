import type { Meta, StoryObj } from "@storybook/react-vite";
import type { FC } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import RocketLaunchRoundedIcon from "@mui/icons-material/RocketLaunchRounded";
import NaturePeopleRoundedIcon from "@mui/icons-material/NaturePeopleRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import { styled } from "@mui/material/styles";
import {
  SolarizedBackground,
  type SolarizedBackgroundProps,
} from "~/components/SolarizedBackground";

const meta = {
  title: "Backgrounds/SolarizedBackground",
  component: SolarizedBackground,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    mode: {
      control: "select",
      options: ["auto", "light", "sunset", "dark"],
      description: "Visual theme mode",
    },
    season: {
      control: "select",
      options: ["spring", "summer", "fall", "winter"],
      description: "Seasonal variant",
    },
    seasonProgress: {
      control: { type: "range", min: 0.0, max: 4.0, step: 0.05 },
      description:
        "Continuous season slider (0.0=Spring petals, 1.0=Summer, 2.0=Fall orange, 3.0=Winter snow)",
    },
    interactive: {
      control: "boolean",
      description: "Cursor-guided breeze and parallax",
    },
    showTree: {
      control: "boolean",
      description: "Display enlarged peaceful vector tree",
    },
    showHills: {
      control: "boolean",
      description: "Display rolling hills",
    },
    showCelestial: {
      control: "boolean",
      description: "Display Sun or Crescent Moon",
    },
    showClouds: {
      control: "boolean",
      description: "Display soft drifting clouds",
    },
    showGodrays: {
      control: "boolean",
      description: "Display radiant sunbeams in day mode",
    },
    showAurora: {
      control: "boolean",
      description: "Display luminous northern lights in dark mode",
    },
    showGrass: {
      control: "boolean",
      description: "Display base2/base02 foreground grass transition",
    },
    leafCount: {
      control: { type: "range", min: 10, max: 100, step: 2 },
      description: "Number of falling leaves",
    },
    windIntensity: {
      control: { type: "range", min: 0.2, max: 3.0, step: 0.1 },
      description: "Ambient wind velocity multiplier",
    },
  },
} satisfies Meta<typeof SolarizedBackground>;

export default meta;
type Story = StoryObj<typeof meta>;

const StoryContainer = styled(Box)({
  width: "100vw",
  height: "100vh",
  position: "relative",
  overflow: "hidden",
});

const HeroCard = styled(Card)(({ theme }) => ({
  maxWidth: 520,
  borderRadius: 24,
  backdropFilter: "blur(18px)",
  backgroundColor: "rgba(255, 255, 255, 0.75)",
  border: "1px solid rgba(255, 255, 255, 0.5)",
  boxShadow: theme.shadows[4],
  ...theme.applyStyles("dark", {
    backgroundColor: "rgba(7, 54, 66, 0.8)",
    border: "1px solid rgba(42, 161, 152, 0.35)",
  }),
}));

export const Default: Story = {
  args: {
    mode: "auto",
    interactive: true,
    showTree: true,
    showHills: true,
    showCelestial: true,
    showClouds: true,
    showGodrays: true,
    showAurora: true,
    showGrass: true,
    leafCount: 44,
    windIntensity: 1.0,
  },
  render: (args: SolarizedBackgroundProps) => (
    <StoryContainer>
      <SolarizedBackground {...args} />
    </StoryContainer>
  ),
};

export const SunsetWithGodrays: Story = {
  args: {
    mode: "sunset",
    interactive: true,
    showTree: true,
    showHills: true,
    showCelestial: true,
    showClouds: true,
    showGodrays: true,
    showAurora: false,
    showGrass: true,
    leafCount: 48,
    windIntensity: 1.1,
  },
  render: (args: SolarizedBackgroundProps) => (
    <StoryContainer>
      <SolarizedBackground {...args} />
    </StoryContainer>
  ),
};

export const CrescentNightWithAurora: Story = {
  args: {
    mode: "dark",
    interactive: true,
    showTree: true,
    showHills: true,
    showCelestial: true,
    showClouds: true,
    showGodrays: false,
    showAurora: true,
    showGrass: true,
    leafCount: 42,
    windIntensity: 0.9,
  },
  render: (args: SolarizedBackgroundProps) => (
    <StoryContainer>
      <SolarizedBackground {...args} />
    </StoryContainer>
  ),
};

const HeroOverlayContent: FC = () => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      p: 3,
    }}
  >
    <HeroCard>
      <CardContent sx={{ p: 4 }}>
        <Stack spacing={2.5}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <NaturePeopleRoundedIcon color="primary" sx={{ fontSize: 40 }} />
            <Typography variant="h4" component="h1">
              Solarized Sanctuary
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Experience the calm breeze and falling leaves rendered with modern
            vector precision. Move your cursor across the sky to guide the wind
            and watch the leaves drift gently across the rolling landscape.
          </Typography>
          <Stack direction="row" spacing={1.5} sx={{ pt: 1 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ExploreRoundedIcon />}
            >
              Explore Sanctuary
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<RocketLaunchRoundedIcon />}
            >
              Documentation
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </HeroCard>
  </Box>
);

export const WithHeroContent: Story = {
  args: {
    mode: "auto",
    interactive: true,
    showTree: true,
    showHills: true,
    showCelestial: true,
    showClouds: true,
    showGodrays: true,
    showAurora: true,
    showGrass: true,
    leafCount: 46,
    windIntensity: 1.0,
  },
  render: (args: SolarizedBackgroundProps) => (
    <StoryContainer>
      <SolarizedBackground {...args}>
        <HeroOverlayContent />
      </SolarizedBackground>
    </StoryContainer>
  ),
};

export const HighWindGust: Story = {
  args: {
    mode: "auto",
    interactive: true,
    showTree: true,
    showHills: true,
    showCelestial: true,
    showClouds: true,
    showGodrays: true,
    showAurora: true,
    showGrass: true,
    leafCount: 72,
    windIntensity: 2.2,
  },
  render: (args: SolarizedBackgroundProps) => (
    <StoryContainer>
      <SolarizedBackground {...args} />
    </StoryContainer>
  ),
};

export const MinimalHorizon: Story = {
  args: {
    mode: "auto",
    interactive: true,
    showTree: false,
    showHills: true,
    showCelestial: true,
    showClouds: true,
    showGodrays: true,
    showAurora: true,
    showGrass: true,
    leafCount: 28,
    windIntensity: 0.8,
  },
  render: (args: SolarizedBackgroundProps) => (
    <StoryContainer>
      <SolarizedBackground {...args} />
    </StoryContainer>
  ),
};

export const SpringCherryBlossoms: Story = {
  args: {
    mode: "light",
    season: "spring",
    seasonProgress: 0.0,
    interactive: true,
    showTree: true,
    showHills: true,
    showCelestial: true,
    showClouds: true,
    showGodrays: true,
    showAurora: false,
    showGrass: true,
    leafCount: 46,
    windIntensity: 0.9,
  },
  render: (args: SolarizedBackgroundProps) => (
    <StoryContainer>
      <SolarizedBackground {...args} />
    </StoryContainer>
  ),
};

export const AutumnFallSlider: Story = {
  args: {
    mode: "sunset",
    season: "fall",
    seasonProgress: 2.0,
    interactive: true,
    showTree: true,
    showHills: true,
    showCelestial: true,
    showClouds: true,
    showGodrays: true,
    showAurora: false,
    showGrass: true,
    leafCount: 52,
    windIntensity: 1.1,
  },
  render: (args: SolarizedBackgroundProps) => (
    <StoryContainer>
      <SolarizedBackground {...args} />
    </StoryContainer>
  ),
};

export const WinterSnowfall: Story = {
  args: {
    mode: "light",
    season: "winter",
    seasonProgress: 3.0,
    interactive: true,
    showTree: true,
    showHills: true,
    showCelestial: true,
    showClouds: true,
    showGodrays: true,
    showAurora: false,
    showGrass: true,
    leafCount: 48,
    windIntensity: 1.0,
  },
  render: (args: SolarizedBackgroundProps) => (
    <StoryContainer>
      <SolarizedBackground {...args} />
    </StoryContainer>
  ),
};

export const SeasonsCycleSlider: Story = {
  args: {
    mode: "light",
    season: "summer",
    seasonProgress: 1.0,
    interactive: true,
    showTree: true,
    showHills: true,
    showCelestial: true,
    showClouds: true,
    showGodrays: true,
    showAurora: false,
    showGrass: true,
    leafCount: 44,
    windIntensity: 1.0,
  },
  render: (args: SolarizedBackgroundProps) => (
    <StoryContainer>
      <SolarizedBackground {...args} />
    </StoryContainer>
  ),
};
