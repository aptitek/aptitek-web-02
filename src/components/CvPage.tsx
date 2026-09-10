import Box from "@mui/material/Box";
import { ThemeRegistry } from "./ThemeRegistry";
import { ThemeSwitch } from "./molecules/FancySwitch/variants/theme.switch";
import { CvDocument, type CvDocumentProps } from "./organisms/Cv/CvDocument";

export function CvPage(props: CvDocumentProps) {
  return (
    <ThemeRegistry>
      <Box
        component="div"
        sx={{
          position: "fixed",
          top: "1.25rem",
          right: "1.25rem",
          zIndex: 50,
          "@media print": {
            display: "none",
          },
        }}
      >
        <ThemeSwitch />
      </Box>
      <CvDocument {...props} />
    </ThemeRegistry>
  );
}

export default CvPage;
