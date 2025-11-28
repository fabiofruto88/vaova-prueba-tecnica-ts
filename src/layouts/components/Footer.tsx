import {
  Box,
  Container,
  Typography,
  Grid,
  Link as MuiLink,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Hotel as HotelIcon,
} from "@mui/icons-material";

const footerLinks = {
  producto: [
    { label: "Características", href: "#" },
    { label: "Precios", href: "#" },
    { label: "Integraciones", href: "#" },
  ],
  empresa: [
    { label: "Nosotros", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Carreras", href: "#" },
  ],
  soporte: [
    { label: "Centro de Ayuda", href: "#" },
    { label: "Contacto", href: "#" },
    { label: "Estado", href: "#" },
  ],
  legal: [
    { label: "Privacidad", href: "#" },
    { label: "Términos", href: "#" },
    { label: "Cookies", href: "#" },
  ],
};

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "background.paper",
        borderTop: 1,
        borderColor: "divider",
        mt: "auto",
      }}
    >
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <HotelIcon sx={{ color: "primary.main", fontSize: 28 }} />
              <Typography variant="h6" fontWeight={800}>
                VAOVA
              </Typography>
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3, maxWidth: 300 }}
            >
              La plataforma líder para la gestión de hoteles aliados. Simplifica
              tu operación hotelera.
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton size="small" sx={{ color: "text.secondary" }}>
                <Facebook fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: "text.secondary" }}>
                <Twitter fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: "text.secondary" }}>
                <Instagram fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: "text.secondary" }}>
                <LinkedIn fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          {Object.entries(footerLinks).map(([category, links]) => (
            <Grid size={{ xs: 6, sm: 3, md: 2 }} key={category}>
              <Typography
                variant="subtitle2"
                fontWeight={600}
                sx={{ mb: 2, textTransform: "capitalize" }}
              >
                {category}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {links.map((link) => (
                  <MuiLink
                    key={link.label}
                    href={link.href}
                    underline="none"
                    sx={{
                      color: "text.secondary",
                      fontSize: "0.875rem",
                      "&:hover": { color: "primary.main" },
                    }}
                  >
                    {link.label}
                  </MuiLink>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © 2025 Fabio Fruto dev. Todos los derechos reservados.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hecho con amor para la industria hotelera
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
