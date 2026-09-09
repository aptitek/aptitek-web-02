import type { ReactNode } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { appTheme } from "~/tokens/theme";

interface ThemeRegistryProps {
  children: ReactNode;
}

export function ThemeRegistry({ children }: ThemeRegistryProps) {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
