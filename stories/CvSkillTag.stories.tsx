import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { CvSkillTag } from "~/components/atoms/CvSkillTag/CvSkillTag";

const meta: Meta<typeof CvSkillTag> = {
  title: "Atoms/CvSkillTag",
  component: CvSkillTag,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    color: {
      control: "select",
      options: [
        "yellow",
        "orange",
        "red",
        "magenta",
        "violet",
        "blue",
        "cyan",
        "green",
      ],
    },
    label: { control: "text" },
    isActive: { control: "boolean" },
    count: { control: "number" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "typescript",
    label: "TypeScript",
    color: "blue",
    isActive: false,
    count: 14,
  },
};

export const Active: Story = {
  args: {
    id: "react",
    label: "React 19",
    color: "cyan",
    isActive: true,
    count: 22,
  },
};

const COLOR_PALETTES: Array<
  "yellow" | "orange" | "red" | "magenta" | "violet" | "blue" | "cyan" | "green"
> = ["yellow", "orange", "red", "magenta", "violet", "blue", "cyan", "green"];

export const ColorPalette: Story = {
  render: () => (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, maxWidth: 480 }}>
      {COLOR_PALETTES.map((color) => (
        <CvSkillTag
          key={color}
          id={color}
          label={color.toUpperCase()}
          color={color}
          count={5}
        />
      ))}
    </Box>
  ),
};

function InteractiveFilterDemo() {
  const [selected, setSelected] = useState<string[]>(["typescript"]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const skills: Array<{
    id: string;
    label: string;
    color: (typeof COLOR_PALETTES)[number];
    count: number;
  }> = [
    { id: "typescript", label: "TypeScript", color: "blue", count: 18 },
    { id: "react", label: "React", color: "cyan", count: 15 },
    { id: "astro", label: "Astro", color: "orange", count: 8 },
    { id: "node", label: "Node.js", color: "green", count: 12 },
    { id: "graphql", label: "GraphQL", color: "magenta", count: 6 },
    { id: "vitest", label: "Vitest", color: "yellow", count: 10 },
  ];

  return (
    <Stack spacing={2} sx={{ maxWidth: 480 }}>
      <Typography variant="body2" color="text.secondary">
        Click tags to toggle filter:
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
        {skills.map((skill) => (
          <CvSkillTag
            key={skill.id}
            id={skill.id}
            label={skill.label}
            color={skill.color}
            count={skill.count}
            isActive={selected.includes(skill.id)}
            onClick={toggle}
          />
        ))}
      </Box>
    </Stack>
  );
}

export const InteractiveGroup: Story = {
  render: () => <InteractiveFilterDemo />,
};
