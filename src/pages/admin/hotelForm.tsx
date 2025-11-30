import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Hotel } from "../../types/auth.types";
import {
  createHotel,
  updateHotel,
  getHotelById,
} from "../../lib/simulatedEndpoints";

const HotelForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Hotel>>({
    name: "",
    description: "",
    country: "",
    state: "",
    city: "",
    stars: 3,
  });

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const h = await getHotelById(id as string);
        setForm(h);
      } catch (err) {
        setError("No se pudo cargar el hotel");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "stars" ? (Number(value) as 3 | 4 | 5) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (id) {
        await updateHotel(id, form as Partial<Hotel>);
      } else {
        await createHotel(
          form as Omit<Hotel, "id" | "createdAt" | "updatedAt" | "score">
        );
      }
      navigate("/admin/hotels");
    } catch (err) {
      setError("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>{id ? "Editar Hotel" : "Crear Hotel"}</h2>
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 8 }}>
          <label>Nombre</label>
          <br />
          <input
            name="name"
            value={form.name || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Ciudad</label>
          <br />
          <input name="city" value={form.city || ""} onChange={handleChange} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>País</label>
          <br />
          <input
            name="country"
            value={form.country || ""}
            onChange={handleChange}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Estrellas</label>
          <br />
          <select
            name="stars"
            value={String(form.stars || 3)}
            onChange={handleChange}
          >
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Descripción</label>
          <br />
          <textarea
            name="description"
            value={form.description || ""}
            onChange={handleChange}
          />
        </div>

        <div>
          <button type="submit" disabled={saving}>
            {saving ? "Guardando..." : "Guardar"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/hotels")}
            style={{ marginLeft: 8 }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelForm;
