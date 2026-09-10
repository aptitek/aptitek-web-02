import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import {
  HeroTicker,
  type HeroTickerProps,
  type SolarizedAccent,
} from "~/components/molecules/HeroTicker";

const meta = {
  title: "Molecules/HeroTicker",
  component: HeroTicker,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    prefix: {
      control: "text",
      description: "Slogan prefix rendered in Recursive Casual Italic",
    },
    suffix: {
      control: "text",
      description: "Slogan suffix rendered in Recursive Casual Italic",
    },
    animationMode: {
      control: "select",
      options: ["cursive-draw", "cursive-type", "fade"],
      description:
        "Animation mode: cursive-draw (calligraphy sweep with pen nib), cursive-type (humanized typing with ink bloom), or fade",
    },
    accentColor: {
      control: "select",
      options: [
        "cyan",
        "magenta",
        "blue",
        "yellow",
        "orange",
        "violet",
        "green",
      ],
      description: "Solarized accent color for Milkshake font",
    },
    flourish: {
      control: "select",
      options: ["swoosh", "wave", "glow-line", "none"],
      description: "Calligraphic underline flourish style",
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      description: "Material 3 Display size tier",
    },
    drawSpeed: {
      control: { type: "range", min: 500, max: 3000, step: 100 },
      description: "Draw duration in ms for cursive-draw mode",
    },
    typeSpeed: {
      control: { type: "range", min: 30, max: 200, step: 10 },
      description: "Type speed in ms per char for cursive-type mode",
    },
    pauseDuration: {
      control: { type: "range", min: 1000, max: 6000, step: 200 },
      description: "Hold duration in ms before erasing",
    },
    pauseOnHover: {
      control: "boolean",
      description: "Pause ticker when hovering over the slogan",
    },
    showControls: {
      control: "boolean",
      description: "Show play/pause, prev/next, and phrase jump dots",
    },
    showNib: {
      control: "boolean",
      description: "Show calligraphy fountain pen nib while drawing",
    },
    align: {
      control: "select",
      options: ["center", "left", "right"],
      description: "Horizontal text alignment",
    },
  },
} satisfies Meta<typeof HeroTicker>;

export default meta;
type Story = StoryObj<typeof meta>;

const StoryFrame = ({
  children,
  width = 720,
}: {
  children: React.ReactNode;
  width?: number;
}) => (
  <Box
    sx={{
      width: "100%",
      maxWidth: width,
      p: 4,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {children}
  </Box>
);

export const Default: Story = {
  args: {
    prefix: "We craft ",
    phrases: [
      "revolutionary ideas",
      "limitless experiences",
      "sustainable futures",
      "artistic intelligence",
      "elegant software",
    ],
    suffix: " that inspire.",
    animationMode: "cursive-draw",
    accentColor: "magenta",
    flourish: "swoosh",
    size: "large",
    drawSpeed: 1200,
    pauseDuration: 2400,
    pauseOnHover: true,
    showControls: false,
    showNib: true,
    align: "center",
  },
  render: (args: HeroTickerProps) => (
    <StoryFrame>
      <HeroTicker {...args} />
    </StoryFrame>
  ),
};

export const CursiveDrawingShowcase: Story = {
  args: {
    prefix: "Shaping ",
    phrases: [
      "extraordinary designs",
      "calligraphic mastery",
      "digital poetry",
      "harmonic systems",
    ],
    suffix: " with precision.",
    animationMode: "cursive-draw",
    accentColor: "yellow",
    flourish: "swoosh",
    size: "large",
    drawSpeed: 1600,
    pauseDuration: 2800,
    pauseOnHover: true,
    showControls: true,
    showNib: true,
    align: "center",
  },
  render: (args: HeroTickerProps) => (
    <StoryFrame>
      <HeroTicker {...args} />
    </StoryFrame>
  ),
};

export const TypewriterCadence: Story = {
  args: {
    prefix: "Engineering ",
    phrases: [
      "ultra-fast interfaces",
      "accessible applications",
      "reliable microservices",
      "seamless interactions",
    ],
    suffix: " at global scale.",
    animationMode: "cursive-type",
    accentColor: "blue",
    flourish: "wave",
    size: "large",
    typeSpeed: 70,
    pauseDuration: 2200,
    pauseOnHover: true,
    showControls: true,
    showNib: true,
    align: "center",
  },
  render: (args: HeroTickerProps) => (
    <StoryFrame>
      <HeroTicker {...args} />
    </StoryFrame>
  ),
};

export const KineticFade: Story = {
  args: {
    prefix: "Empowering ",
    phrases: [
      "creative thinkers",
      "curious learners",
      "forward visionaries",
      "bold innovators",
    ],
    suffix: " across the globe.",
    animationMode: "fade",
    accentColor: "magenta",
    flourish: "glow-line",
    size: "large",
    pauseDuration: 2400,
    pauseOnHover: true,
    showControls: true,
    align: "center",
  },
  render: (args: HeroTickerProps) => (
    <StoryFrame>
      <HeroTicker {...args} />
    </StoryFrame>
  ),
};

export const WithInteractiveControls: Story = {
  args: {
    prefix: "Discover ",
    phrases: [
      "serene aesthetics",
      "solarized harmony",
      "expressive physics",
      "tactile typography",
    ],
    suffix: " in every pixel.",
    animationMode: "cursive-draw",
    accentColor: "cyan",
    flourish: "swoosh",
    size: "large",
    drawSpeed: 1300,
    pauseDuration: 2600,
    showControls: true,
    showNib: true,
    align: "center",
  },
  render: (args: HeroTickerProps) => (
    <StoryFrame>
      <HeroTicker {...args} />
    </StoryFrame>
  ),
};

const ACCENT_COLORS: SolarizedAccent[] = [
  "cyan",
  "blue",
  "magenta",
  "yellow",
  "orange",
  "violet",
  "green",
];

export const SolarizedColorPalette: Story = {
  render: () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        p: 2,
        maxWidth: 780,
      }}
    >
      {ACCENT_COLORS.map((accent) => (
        <Box
          key={accent}
          sx={{
            p: 2,
            borderRadius: 3,
            backgroundColor: "rgba(0, 43, 54, 0.3)",
            border: "1px solid rgba(42, 161, 152, 0.15)",
          }}
        >
          <Chip
            size="small"
            label={`Solarized ${accent.toUpperCase()}`}
            sx={{ mb: 1, textTransform: "capitalize" }}
          />
          <HeroTicker
            prefix="Pure "
            phrases={[`${accent} brilliance`, "chromatic balance"]}
            suffix=" unleashed."
            accentColor={accent}
            size="medium"
            animationMode="cursive-draw"
            flourish="swoosh"
            drawSpeed={1100}
            pauseDuration={1800}
            showNib={false}
          />
        </Box>
      ))}
    </Box>
  ),
};

export const HeroBannerShowcase: Story = {
  render: () => (
    <Card
      sx={{
        maxWidth: 820,
        borderRadius: 5,
        p: 4,
        textAlign: "center",
        backgroundColor: "rgba(7, 54, 66, 0.7)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(42, 161, 152, 0.25)",
        boxShadow: 8,
      }}
    >
      <CardContent>
        <Stack spacing={3} sx={{ alignItems: "center" }}>
          <Chip
            icon={<AutoAwesomeRoundedIcon />}
            label="AptiTek-02 Design System"
            color="primary"
            variant="outlined"
            sx={{ borderRadius: 4, px: 1 }}
          />

          <HeroTicker
            prefix="Designing "
            phrases={[
              "the next generation",
              "modern web systems",
              "delightful software",
              "human experiences",
            ]}
            suffix=" without compromise."
            accentColor="cyan"
            size="large"
            animationMode="cursive-draw"
            flourish="swoosh"
            showControls={true}
            showNib={true}
          />

          <Typography
            variant="body1"
            sx={{
              maxWidth: 580,
              color: "var(--color-solarized-base0)",
              fontSize: "1.1rem",
              lineHeight: 1.6,
            }}
          >
            Powered by Astro, Recursive variable fonts, and the iconic Milkshake
            cursive script. Harmonized with the 16-color Solarized palette.
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  ),
};

export const ResponsiveSizes: Story = {
  render: () => (
    <Stack spacing={5} sx={{ maxWidth: 760, p: 2 }}>
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          Large (displayLarge)
        </Typography>
        <HeroTicker
          prefix="Inspiring "
          phrases={["global minds"]}
          suffix=" daily."
          size="large"
          animationMode="cursive-draw"
          accentColor="cyan"
        />
      </Box>

      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          Medium (displayMedium)
        </Typography>
        <HeroTicker
          prefix="Inspiring "
          phrases={["global minds"]}
          suffix=" daily."
          size="medium"
          animationMode="cursive-draw"
          accentColor="yellow"
        />
      </Box>

      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          Small (displaySmall)
        </Typography>
        <HeroTicker
          prefix="Inspiring "
          phrases={["global minds"]}
          suffix=" daily."
          size="small"
          animationMode="cursive-draw"
          accentColor="magenta"
        />
      </Box>
    </Stack>
  ),
};
