import React from "react";
import { Box, Typography, LinearProgress } from "@mui/material";

interface ProgressBarItemProps {
  title: string;
  percentage: number;
  category: string;
  color: string;
}

const ProgressBarItem: React.FC<ProgressBarItemProps> = ({
  title,
  percentage,
  category,
  color,
}) => {
  return (
    <Box sx={{ width: "100%", mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {title}
        </Typography>
        <Typography variant="body2">{category}</Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: "#e0e0e0",
          "& .MuiLinearProgress-bar": {
            backgroundColor: color,
            borderRadius: 4,
          },
        }}
      />
    </Box>
  );
};

export default ProgressBarItem;
