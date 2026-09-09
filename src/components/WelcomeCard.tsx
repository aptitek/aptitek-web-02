import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Box,
} from "@mui/material";
import RocketLaunchRoundedIcon from "@mui/icons-material/RocketLaunchRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";

export function WelcomeCard() {
  return (
    <Card
      elevation={2}
      sx={{
        maxWidth: 540,
        mx: "auto",
        mt: 4,
        p: 2,
        borderRadius: 4,
        textAlign: "left",
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <RocketLaunchRoundedIcon color="primary" sx={{ fontSize: 32 }} />
            <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
              AptiTek-02 Initialized
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Empty Astro static website with Material UI 3 Expressive and
            Solarized theme. The entire pipeline, Husky hooks, Wireit task
            graph, ESLint, Prettier, and testing suite are active.
          </Typography>
          <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<CheckCircleOutlineRoundedIcon />}
            >
              Pipeline Ready
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
