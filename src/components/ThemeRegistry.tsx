import type { ReactNode } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getThemeByMode } from "~/tokens/theme";
import { ThemeModeProvider, useThemeMode } from "~/utils/themeContext";

interface ThemeRegistryProps {
  children: ReactNode;
}

function DynamicThemeProvider({ children }: { children: ReactNode }) {
  const { mode } = useThemeMode();
  const theme = getThemeByMode(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export function ThemeRegistry({ children }: ThemeRegistryProps) {
  return (
    <ThemeModeProvider>
      <DynamicThemeProvider>{children}</DynamicThemeProvider>
    </ThemeModeProvider>
  );
}
