/* import React, { useEffect } from "react"; */
/* import { useNavigate } from "react-router-dom";
import type { Hotel } from "../../types/auth.types" */ /* import { getHotels } from "../../lib/simulatedEndpoints"; */

const Hotels: React.FC = () => {
  /*  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); */

  /*   const fetchHotels = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHotels();
      setHotels(data);
    } catch (err) {
      setError("Error al cargar hoteles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []); */

  /*   const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "¿Eliminar hotel? Esta acción no se puede deshacer."
    );
    if (!confirmed) return;
    try {
      await deleteHotel(id);
      setHotels((prev) => prev.filter((h) => h.id !== id));
    } catch (err) {
      alert("Error al eliminar hotel");
    }
  }; */

  return <></>;
};

export default Hotels;
