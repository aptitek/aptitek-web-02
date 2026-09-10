import AddRoundedIcon from "@mui/icons-material/AddRounded";
import Tooltip from "@mui/material/Tooltip";
import type { FloatingActionButtonProps } from "./FloatingActionButton.types";
import { StyledFloatingActionButton } from "./FloatingActionButton.styles";

export function FloatingActionButton({
  tooltip,
  onClick,
  className,
  testId = "fab-btn",
  icon,
  href,
  download,
  target,
  rel,
}: FloatingActionButtonProps) {
  const isLink = Boolean(href);
  const safeRel = target === "_blank" ? (rel ?? "noopener noreferrer") : rel;

  return (
    <Tooltip title={tooltip} arrow placement="top">
      <StyledFloatingActionButton
        component={isLink ? "a" : "button"}
        href={href}
        download={download}
        target={target}
        rel={safeRel}
        onClick={onClick}
        aria-label={tooltip}
        data-testid={testId}
        className={`md3-ghost-fab ${className || ""}`.trim()}
      >
        {icon || <AddRoundedIcon sx={{ fontSize: 28 }} />}
      </StyledFloatingActionButton>
    </Tooltip>
  );
}

export default FloatingActionButton;
