import type { Preview } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getThemeByMode } from "~/tokens/theme";
import "~/i18n";
import "~/tokens/tokens.css";
import "react-material-expressive/styles.css";

import { ThemeModeProvider, useThemeMode } from "~/utils/themeContext";

function StorybookThemeWrapper({ children }: { children: ReactNode }) {
  const { mode } = useThemeMode();
  const theme = getThemeByMode(mode);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeModeProvider>
        <StorybookThemeWrapper>
          <Story />
        </StorybookThemeWrapper>
      </ThemeModeProvider>
    ),
  ],

  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: "color-contrast",
            enabled: true,
          },
          {
            id: "button-name",
            enabled: true,
          },
          {
            id: "link-name",
            enabled: true,
          },
          {
            id: "label",
            enabled: true,
          },
          {
            id: "aria-roles",
            enabled: true,
          },
          {
            id: "aria-valid-attr",
            enabled: true,
          },
          {
            id: "aria-valid-attr-value",
            enabled: true,
          },
          {
            id: "aria-required-attr",
            enabled: true,
          },
          {
            id: "aria-required-children",
            enabled: true,
          },
          {
            id: "aria-required-parent",
            enabled: true,
          },
        ],
      },
      options: {
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
        },
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
