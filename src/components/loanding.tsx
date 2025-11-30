import React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

type LoadingProps = {
  open?: boolean;
  size?: number;
  color?: string;
  message?: string;
};

const Loading: React.FC<LoadingProps> = ({
  open = true,
  size = 60,
  color,
  message,
}) => {
  const theme = useTheme();
  const primaryColor =
    color ||
    (theme as any).palette?.medical?.primary ||
    theme.palette.primary.main;

  return (
    <Backdrop
      open={!!open}
      sx={{
        color: primaryColor,
        zIndex: (t) => t.zIndex.modal + 1,
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
        <CircularProgress size={size} sx={{ color: primaryColor }} />
        {message && (
          <Typography variant="body2" sx={{ color: primaryColor }}>
            {message}
          </Typography>
        )}
      </Box>
    </Backdrop>
  );
};

export default Loading;
