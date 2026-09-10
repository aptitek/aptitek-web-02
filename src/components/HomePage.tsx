import Box from "@mui/material/Box";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import { ThemeRegistry } from "./ThemeRegistry";
import { HeroTicker } from "./molecules/HeroTicker";
import { ThemeSwitch } from "./molecules/FancySwitch/variants/theme.switch";
import { FloatingActionButton } from "./atoms/FloatingActionButton";

export function HomePage() {
  return (
    <ThemeRegistry>
      <Box
        component="div"
        sx={{
          position: "fixed",
          top: "1.25rem",
          right: "1.25rem",
          zIndex: (theme) => theme.zIndex.speedDial,
        }}
      >
        <ThemeSwitch />
      </Box>

      <Box
        component="div"
        sx={{
          position: "fixed",
          bottom: { xs: "1.5rem", sm: "2rem" },
          right: { xs: "1.5rem", sm: "2rem" },
          zIndex: (theme) => theme.zIndex.speedDial,
        }}
      >
        <FloatingActionButton
          tooltip="Curriculum Vitae (PDF)"
          href="/cv.pdf"
          target="_blank"
          testId="fab-pdf"
          icon={<PictureAsPdfRoundedIcon sx={{ fontSize: 28 }} />}
        />
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
      </Box>
    </ThemeRegistry>
  );
}
