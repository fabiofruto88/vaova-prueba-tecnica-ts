import React from "react";
import { Box, Typography, Paper, SvgIcon } from "@mui/material";
import { alpha } from "@mui/material/styles";

type StatCardProps = {
  title: string;
  value: number;
  icon: React.ElementType; // a React component (SVG) to render
  colorIcon?: string; // hex color for icon and background
  widthIcon?: number; // icon size in px
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: IconComponent,
  colorIcon = "#1976d2",
  widthIcon = 32,
}) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 2.5,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        width: "100%",

        position: "relative",
        overflow: "hidden",
        "&:hover": {
          transform: "translateY(-2px)",
          transition: "all 0.3s ease",
          boxShadow: 6,
        },
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          fontSize: "0.875rem",
          fontWeight: 500,
          mb: 0.5,
        }}
      >
        {title}
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "text.primary",
            fontSize: "2rem",
          }}
        >
          {value}
        </Typography>

        <Box
          sx={{
            backgroundColor: alpha(colorIcon, 0.08),
            borderRadius: 2,
            p: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SvgIcon
            component={IconComponent}
            sx={{ fontSize: widthIcon, color: colorIcon }}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default StatCard;
