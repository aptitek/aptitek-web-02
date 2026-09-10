import Box from "@mui/material/Box";
import { ThemeRegistry } from "./ThemeRegistry";
import { WelcomeCard } from "./WelcomeCard";
import { HeroTicker } from "./molecules/HeroTicker";
import { ThemeSwitch } from "./molecules/FancySwitch/variants/theme.switch";

export function HomePage() {
  return (
    <ThemeRegistry>
      <Box
        component="div"
        sx={{
          position: "fixed",
          top: "1.25rem",
          right: "1.25rem",
          zIndex: 50,
        }}
      >
        <ThemeSwitch />
      </Box>
      <Box
        component="main"
        sx={{
          padding: { xs: "3rem 1rem", md: "4rem 1rem" },
          textAlign: "center",
          maxWidth: 960,
          margin: "0 auto",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        <Box sx={{ mb: 5, width: "100%" }}>
          <HeroTicker
            animationMode="cursive-draw"
            accentColor="magenta"
            flourish="swoosh"
            size="large"
            showControls={true}
            showNib={true}
          />
        </Box>
        <WelcomeCard />
      </Box>
    </ThemeRegistry>
  );
}
