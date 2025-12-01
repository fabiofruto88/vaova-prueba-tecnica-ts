import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { getHotelWithRooms } from "../../lib/simulatedEndpoints";
import Loading from "../../components/loanding";

const HotelPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [hotel, setHotel] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    if (!id) return;
    (async () => {
      try {
        const data = await getHotelWithRooms(id);
        console.log(data);
        setHotel(data);
      } catch (err) {
        console.error("Error cargando hotel:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <>
      <Box p={4}>
        <Typography variant="h4">{hotel?.name}</Typography>
        <Typography color="text.secondary">
          {hotel?.city}, {hotel?.country}
        </Typography>
        <Typography mt={2}>{hotel?.description}</Typography>
        {/* agrega más UI como galería, habitaciones, etc. */}
      </Box>
      <Loading open={loading} />
    </>
  );
};

export default HotelPage;
