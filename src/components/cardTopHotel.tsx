import React from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { Card, Stack, Typography, Box, Chip } from "@mui/material";
import { capitalizeName } from "../utils/generals";

type Props = {
  rank: number;
  logo?: string | null;
  name: string;
  location: string;
  rating?: number;
  score?: number;
  scoreColor?: string;
};

const defaultLogo = "https://via.placeholder.com/150?text=No+Image";

const CardTopHotel: React.FC<Props> = ({
  rank,
  logo,
  name,
  location,
  rating = 0,
  score = 0,
  scoreColor = "#4caf50",
}) => {
  const imageSrc =
    typeof logo === "string" && logo.trim() !== "" ? logo : defaultLogo;

  return (
    <Card>
      <Stack
        sx={{
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{ px: { xs: 0, md: 5 }, py: { xs: 1, md: 0 } }}
          color="primary"
        >
          # {rank}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            maxWidth: { xs: "30%", md: "10%" },
            minHeight: 0,
            my: { xs: 0, md: 2 },
            borderRadius: 1,
            overflow: "hidden",
            aspectRatio: { xs: "1 / 1", md: "4 / 3" },
          }}
        >
          <img
            src={imageSrc}
            alt={name}
            width="100%"
            height="100%"
            style={{
              objectFit: "cover",
              background: "transparent",
            }}
          />
        </Box>
        <Stack
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            px: 2,
            width: "90%",
          }}
        >
          <Typography variant="h6">{capitalizeName(name)}</Typography>
          <Typography variant="body2" color="text.secondary">
            {capitalizeName(location)}
          </Typography>
        </Stack>
        <Box
          sx={{
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
            px: 1,
            gap: { xs: 1, md: 1 },
            minWidth: { xs: "15%", md: "10%" },
            mb: { xs: 2, md: 0 },
          }}
        >
          <StarIcon width={26} color="#ffc107" />
          <Typography
            variant="body1"
            sx={{ color: scoreColor, fontWeight: "bold" }}
          >
            {rating.toFixed(1)}
          </Typography>
          <Chip
            label={`${score.toFixed(1)}%`}
            size="small"
            sx={{
              bgcolor: scoreColor,
              color: "#fff",
              fontWeight: 600,
            }}
          />
        </Box>
      </Stack>
    </Card>
  );
};

export default CardTopHotel;
