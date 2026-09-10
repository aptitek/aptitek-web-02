import { useState, useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import AnalogClock from "~/components/atoms/AnalogClock";

const meta: Meta<typeof AnalogClock> = {
  title: "Atoms/AnalogClock",
  component: AnalogClock,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: { control: { type: "number", min: 40, max: 300, step: 10 } },
    dialType: {
      control: "radio",
      options: ["circle", "scalloped", "none"],
    },
    hourAngle: { control: { type: "number", min: 0, max: 360, step: 15 } },
    minuteAngle: { control: { type: "number", min: 0, max: 360, step: 6 } },
    showTicks: { control: "boolean" },
    showDialRing: { control: "boolean" },
    showHub: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 120,
    hourAngle: 300,
    minuteAngle: 60,
    dialType: "circle",
    showTicks: true,
    showDialRing: true,
    showHub: true,
  },
};

export const ScallopedDial: Story = {
  args: {
    size: 140,
    hourAngle: 60,
    minuteAngle: 180,
    dialType: "scalloped",
    showTicks: true,
    showDialRing: true,
    showHub: true,
  },
};

function LiveClockDemo() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourAngle = hours * 30 + (minutes / 60) * 30;
  const minuteAngle = minutes * 6 + (seconds / 60) * 6;

  return (
    <Stack spacing={2} sx={{ alignItems: "center" }}>
      <AnalogClock
        size={140}
        dialType="scalloped"
        hourAngle={hourAngle}
        minuteAngle={minuteAngle}
        showTicks={true}
      />
      <Typography variant="body2" color="text.secondary">
        Live: {time.toLocaleTimeString()}
      </Typography>
    </Stack>
  );
}

export const LiveClock: Story = {
  render: () => <LiveClockDemo />,
};

export const DialVariants: Story = {
  render: () => (
    <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>
      <Stack spacing={1} sx={{ alignItems: "center" }}>
        <AnalogClock
          size={100}
          dialType="circle"
          hourAngle={90}
          minuteAngle={0}
        />
        <Typography variant="caption">Circle Dial</Typography>
      </Stack>
      <Stack spacing={1} sx={{ alignItems: "center" }}>
        <AnalogClock
          size={100}
          dialType="scalloped"
          hourAngle={90}
          minuteAngle={0}
        />
        <Typography variant="caption">Scalloped Dial</Typography>
      </Stack>
      <Stack spacing={1} sx={{ alignItems: "center" }}>
        <AnalogClock
          size={100}
          dialType="none"
          hourAngle={90}
          minuteAngle={0}
        />
        <Typography variant="caption">Minimal / None</Typography>
      </Stack>
    </Box>
  ),
};
