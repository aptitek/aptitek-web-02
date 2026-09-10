import type { FC } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import SkipNextRoundedIcon from "@mui/icons-material/SkipNextRounded";
import SkipPreviousRoundedIcon from "@mui/icons-material/SkipPreviousRounded";
import type { SolarizedAccent } from "./HeroTicker.types";
import { ControlsBar, DotIndicator } from "./HeroTicker.styles";

export interface HeroTickerControlsProps {
  phrases: string[];
  currentIndex: number;
  isPaused: boolean;
  accentColor: SolarizedAccent;
  accentVar: string;
  onPrev: () => void;
  onNext: () => void;
  onTogglePause: () => void;
  onSelectIndex: (index: number) => void;
}

export const HeroTickerControls: FC<HeroTickerControlsProps> = ({
  phrases,
  currentIndex,
  isPaused,
  accentColor,
  accentVar,
  onPrev,
  onNext,
  onTogglePause,
  onSelectIndex,
}) => {
  const { t } = useTranslation("common");

  const prevLabel = t("heroTicker.controls.previous", "Previous slogan phrase");
  const nextLabel = t("heroTicker.controls.next", "Next slogan phrase");
  const pauseLabel = isPaused
    ? t("heroTicker.controls.resume", "Resume ticker animation")
    : t("heroTicker.controls.pause", "Pause ticker animation");
  const barLabel = t(
    "heroTicker.controls.barAria",
    "Slogan animation controls",
  );

  return (
    <ControlsBar
      data-testid="hero-ticker-controls"
      role="group"
      aria-label={barLabel}
    >
      <IconButton
        size="small"
        onClick={onPrev}
        aria-label={prevLabel}
        sx={{
          color: "text.secondary",
          "&:hover": { color: accentVar },
          "&:focus-visible": {
            outline: `2px solid ${accentVar}`,
            outlineOffset: 2,
          },
        }}
      >
        <SkipPreviousRoundedIcon fontSize="small" />
      </IconButton>

      <IconButton
        size="small"
        onClick={onTogglePause}
        aria-label={pauseLabel}
        sx={{
          color: accentVar,
          "&:hover": { color: "text.primary" },
          "&:focus-visible": {
            outline: `2px solid ${accentVar}`,
            outlineOffset: 2,
          },
        }}
      >
        {isPaused ? (
          <PlayArrowRoundedIcon fontSize="small" />
        ) : (
          <PauseRoundedIcon fontSize="small" />
        )}
      </IconButton>

      <IconButton
        size="small"
        onClick={onNext}
        aria-label={nextLabel}
        sx={{
          color: "text.secondary",
          "&:hover": { color: accentVar },
          "&:focus-visible": {
            outline: `2px solid ${accentVar}`,
            outlineOffset: 2,
          },
        }}
      >
        <SkipNextRoundedIcon fontSize="small" />
      </IconButton>

      <Box
        role="tablist"
        aria-label={barLabel}
        sx={{ display: "flex", alignItems: "center", gap: 1, ml: 1 }}
      >
        {phrases.map((phrase, idx) => {
          const isCurrent = idx === currentIndex;
          const jumpLabel = t("heroTicker.controls.jumpTo", {
            phrase,
            defaultValue: `Jump to phrase: ${phrase}`,
          });

          return (
            <DotIndicator
              key={phrase}
              role="tab"
              tabIndex={0}
              $active={isCurrent}
              $accent={accentColor}
              onClick={() => onSelectIndex(idx)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectIndex(idx);
                }
              }}
              aria-selected={isCurrent}
              aria-label={jumpLabel}
            />
          );
        })}
      </Box>
    </ControlsBar>
  );
};
