import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  ArrowForward,
  AutoAwesome,
  Close,
  Code,
  ContentCopy,
  DarkModeOutlined,
  GridViewOutlined,
  LayersOutlined,
  LightModeOutlined,
  PaletteOutlined,
  Search,
  Tune,
  WidgetsOutlined,
} from "@mui/icons-material";
import {
  AtelierProvider,
  DsButton,
  SectionCard,
  StatusBadge,
  tokens,
} from "./design-system";
import "./style.css";
const sections = [
  "Vue d’ensemble",
  "Couleurs",
  "Typographie",
  "Composants",
  "Espacements",
];
const icons = [
  <GridViewOutlined />,
  <PaletteOutlined />,
  <span aria-hidden style={{ fontSize: 20 }}>
    Aa
  </span>,
  <WidgetsOutlined />,
  <Tune />,
];
const installCode = `import { AtelierProvider, DsButton } from '@atelier-ui/react';\n\nexport function App() {\n  return (\n    <AtelierProvider mode="light">\n      <DsButton>Créer mon projet</DsButton>\n    </AtelierProvider>\n  );\n}`;
const colorNames: Record<string, string> = {
  primary: "Primaire",
  secondary: "Secondaire",
  success: "Succès",
  warning: "Attention",
  error: "Erreur",
};
function ProfileForm({ notify }: { notify: (message: string) => void }) {
  const [name, setName] = useState(""),
    [email, setEmail] = useState(""),
    [submitted, setSubmitted] = useState(false);
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return (
    <Stack
      component="form"
      aria-label="Profil"
      noValidate
      spacing={2.5}
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
        if (!name.trim())
          e.currentTarget
            .querySelector<HTMLInputElement>('input[name="name"]')
            ?.focus();
        else if (!validEmail)
          e.currentTarget
            .querySelector<HTMLInputElement>('input[name="email"]')
            ?.focus();
        else notify("Profil enregistré");
      }}
    >
      <TextField
        name="name"
        autoComplete="name"
        label="Nom complet"
        placeholder="Camille Martin"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={submitted && !name.trim()}
        helperText={
          submitted && !name.trim() ? "Veuillez saisir votre nom." : undefined
        }
        fullWidth
      />
      <TextField
        name="email"
        autoComplete="email"
        label="Adresse e-mail"
        type="email"
        placeholder="camille@exemple.fr"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={submitted && !validEmail}
        helperText={
          submitted && !validEmail
            ? "Saisissez une adresse e-mail valide."
            : "Nous ne partagerons jamais votre adresse."
        }
        fullWidth
      />
      <TextField select label="Rôle" defaultValue="designer">
        <MenuItem value="designer">Designer</MenuItem>
        <MenuItem value="developer">Développeur</MenuItem>
      </TextField>
      <DsButton type="submit" sx={{ alignSelf: "start" }}>
        Enregistrer
      </DsButton>
    </Stack>
  );
}
function App() {
  const [dark, setDark] = useState(() => {
    try {
      return ["dark", "true"].includes(
        localStorage.getItem("atelier-mode") ?? "",
      );
    } catch {
      return false;
    }
  });
  const [page, setPage] = useState(0),
    [tab, setTab] = useState(0),
    [search, setSearch] = useState(""),
    [code, setCode] = useState(false),
    [toast, setToast] = useState(""),
    [checked, setChecked] = useState(true),
    [notifications, setNotifications] = useState(true);
  const navigate = (index: number) => {
    setPage(index);
    setSearch("");
    setTab(0);
  };
  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setToast("Copié dans le presse-papiers");
    } catch {
      setToast("Copie indisponible dans ce navigateur");
    }
  };
  const toggle = () =>
    setDark((value) => {
      try {
        localStorage.setItem("atelier-mode", !value ? "dark" : "light");
      } catch {
        /* Le thème reste disponible sans stockage. */
      }
      return !value;
    });
  const cards = [
    {
      name: "Palette de couleurs",
      pages: [0, 1],
      description: "Une palette expressive, pensée pour la cohérence.",
      content: (
        <Box className="swatches">
          {Object.entries(tokens.colors).map(([key, color]) => (
            <Tooltip title="Copier la valeur" key={key}>
              <Box
                component="button"
                aria-label={`Copier ${colorNames[key]} : ${color}`}
                onClick={() => copy(color)}
                sx={{
                  border: 0,
                  p: 0,
                  bgcolor: "transparent",
                  color: "text.primary",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <Box
                  sx={{ height: 72, bgcolor: color, borderRadius: 2, mb: 1.2 }}
                />
                <Typography fontSize={12} fontWeight={600}>
                  {colorNames[key]}
                </Typography>
                <Typography
                  fontSize={10}
                  color="text.secondary"
                  sx={{ fontFamily: "monospace" }}
                >
                  {color}
                </Typography>
              </Box>
            </Tooltip>
          ))}
        </Box>
      ),
    },
    {
      name: "Typographie",
      pages: [0, 2],
      description: "Une hiérarchie simple et naturellement lisible.",
      content: (
        <Stack spacing={2}>
          <Box>
            <Typography variant="h4" component="p">
              Le sens du détail.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Heading / 34 px / Semibold
            </Typography>
          </Box>
          <Divider />
          <Box>
            <Typography variant="h6" component="p">
              De belles idées, bien construites.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Title / 20 px / Semibold
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2">
              Chaque composant est une brique de votre prochain projet.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Body / 14 px / Regular
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      name: "Boutons",
      pages: [0, 3],
      description: "Une action, une intention, le bon niveau d’emphase.",
      content: (
        <Stack spacing={3}>
          <Stack direction="row" flexWrap="wrap" gap={1.5}>
            <DsButton
              endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
              onClick={() => setToast("Action principale exécutée")}
            >
              Principal
            </DsButton>
            <Button
              variant="outlined"
              onClick={() => setToast("Action secondaire exécutée")}
            >
              Secondaire
            </Button>
            <Button onClick={() => setToast("Action discrète exécutée")}>
              Discret
            </Button>
          </Stack>
          <Stack direction="row" gap={1.5} alignItems="center">
            <DsButton
              size="small"
              onClick={() => setToast("Petit bouton activé")}
            >
              Petit
            </DsButton>
            <DsButton disabled>Désactivé</DsButton>
            <Tooltip title="Copier un exemple">
              <IconButton
                aria-label="Copier un exemple de bouton"
                onClick={() => copy("<DsButton>Continuer</DsButton>")}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <ContentCopy fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      ),
    },
    {
      name: "Champs de formulaire",
      pages: [0, 3],
      description: "Des interactions claires, à chaque étape.",
      content: <ProfileForm notify={setToast} />,
    },
    {
      name: "Sélection & états",
      pages: [0, 3],
      description: "Des retours visuels immédiats et explicites.",
      content: (
        <Stack spacing={2}>
          <Stack direction="row" gap={1} flexWrap="wrap">
            <StatusBadge status="active" />
            <StatusBadge status="pending" />
            <StatusBadge status="inactive" />
          </Stack>
          <FormControlLabel
            control={
              <Switch
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
              />
            }
            label={
              <Typography variant="body2">Activer les notifications</Typography>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
              />
            }
            label={
              <Typography variant="body2">Recevoir les nouveautés</Typography>
            }
          />
          <Alert severity="success">Tout est prêt pour créer.</Alert>
        </Stack>
      ),
    },
    {
      name: "Espacements",
      pages: [0, 4],
      description: "Le rythme d’une interface équilibrée.",
      content: (
        <Stack spacing={1.4}>
          {tokens.spacing.slice(1, 8).map((n) => (
            <Stack key={n} direction="row" gap={2} alignItems="center">
              <Typography
                sx={{
                  width: 40,
                  fontSize: 11,
                  fontFamily: "monospace",
                  color: "text.secondary",
                }}
              >
                {n} px
              </Typography>
              <Box
                aria-hidden
                sx={{
                  width: n * 3,
                  height: 12,
                  bgcolor: "primary.main",
                  opacity: 0.25 + n / 90,
                  borderRadius: 0.6,
                }}
              />
            </Stack>
          ))}
        </Stack>
      ),
    },
    {
      name: "Progression",
      pages: [3],
      description: "Informer sans interrompre.",
      content: (
        <>
          <Typography variant="body2" mb={2}>
            Préparation de votre espace · 68 %
          </Typography>
          <LinearProgress
            aria-label="Préparation de votre espace"
            variant="determinate"
            value={68}
            sx={{ height: 7, borderRadius: 4 }}
          />
        </>
      ),
    },
  ];
  const filtered = cards.filter(
    (card) =>
      card.pages.includes(page) &&
      card.name
        .toLocaleLowerCase("fr")
        .includes(search.toLocaleLowerCase("fr")),
  );
  return (
    <AtelierProvider mode={dark ? "dark" : "light"}>
      <a className="skip-link" href="#main-content">
        Aller au contenu
      </a>
      <Box className="shell">
        <Box
          component="aside"
          className="sidebar"
          sx={{
            bgcolor: "background.paper",
            borderRight: "1px solid",
            borderColor: "divider",
          }}
        >
          <Stack
            direction="row"
            spacing={1.3}
            alignItems="center"
            sx={{ px: 3, py: 3.4 }}
          >
            <Box className="logo">
              <LayersOutlined />
            </Box>
            <Typography fontSize={21} fontWeight={750} letterSpacing={-0.7}>
              atelier<span style={{ color: "#9079e9" }}> ui</span>
            </Typography>
          </Stack>
          <Box sx={{ px: 2.5, pt: 2 }}>
            <Typography className="overline" color="text.secondary">
              WORKSPACE
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 1.4,
                mt: 1.5,
                display: "flex",
                alignItems: "center",
                gap: 1.2,
              }}
            >
              <Avatar
                variant="rounded"
                sx={{
                  width: 30,
                  height: 30,
                  bgcolor: "action.hover",
                  color: "primary.main",
                  fontSize: 15,
                }}
              >
                A
              </Avatar>
              <Box>
                <Typography fontSize={12} fontWeight={650}>
                  Atelier Design System
                </Typography>
                <Typography fontSize={10} color="text.secondary">
                  React · TypeScript · MUI
                </Typography>
              </Box>
            </Paper>
            <Typography
              className="overline"
              color="text.secondary"
              sx={{ mt: 4, mb: 1.5 }}
            >
              EXPLORER
            </Typography>
            <Stack component="nav" aria-label="Sections" gap={0.6}>
              {sections.map((label, i) => (
                <Button
                  key={label}
                  aria-label={label}
                  aria-current={page === i ? "page" : undefined}
                  startIcon={icons[i]}
                  onClick={() => navigate(i)}
                  sx={{
                    justifyContent: "start",
                    px: 1.5,
                    py: 1.2,
                    color: page === i ? "primary.main" : "text.secondary",
                    bgcolor: page === i ? "action.selected" : "transparent",
                    fontSize: 13,
                  }}
                >
                  {label}
                </Button>
              ))}
            </Stack>
          </Box>
          <Box sx={{ mt: "auto", p: 2.5 }}>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: "action.hover" }}>
              <AutoAwesome sx={{ fontSize: 20, color: "primary.main" }} />
              <Typography fontSize={12} fontWeight={650} mt={1}>
                Pensé pour construire.
              </Typography>
              <Typography fontSize={11} color="text.secondary" mt={0.7}>
                Des fondations solides pour vos prochaines interfaces.
              </Typography>
              <Button
                component="a"
                href={`${import.meta.env.BASE_URL}storybook/`}
                size="small"
                endIcon={<ArrowForward fontSize="small" />}
                sx={{ px: 0, mt: 1 }}
              >
                Ouvrir Storybook
              </Button>
            </Paper>
            <Stack direction="row" spacing={1} mt={2.5} alignItems="center">
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  bgcolor: "success.main",
                  borderRadius: "50%",
                }}
              />
              <Typography fontSize={10} color="text.secondary">
                Version 1.0.0 · Stable
              </Typography>
            </Stack>
          </Box>
        </Box>
        <Box
          component="main"
          id="main-content"
          tabIndex={-1}
          sx={{ minWidth: 0 }}
        >
          <Stack
            component="header"
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              px: { xs: 2, md: 5 },
              height: 77,
              borderBottom: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <Typography fontSize={12} color="text.secondary">
              Design system{" "}
              <span style={{ margin: "0 12px", opacity: 0.4 }}>/</span>
              <Box component="span" color="text.primary">
                {sections[page]}
              </Box>
            </Typography>
            <Stack direction="row" alignItems="center" gap={1.5}>
              <Chip
                label="v1.0.0"
                size="small"
                variant="outlined"
                sx={{ fontSize: 10 }}
              />
              <Tooltip title={dark ? "Mode clair" : "Mode sombre"}>
                <IconButton
                  aria-label={
                    dark ? "Activer le mode clair" : "Activer le mode sombre"
                  }
                  onClick={toggle}
                >
                  {dark ? (
                    <LightModeOutlined fontSize="small" />
                  ) : (
                    <DarkModeOutlined fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
              <Avatar
                sx={{
                  width: 30,
                  height: 30,
                  bgcolor: "#EAE4F8",
                  color: "#665292",
                  fontSize: 11,
                }}
              >
                CM
              </Avatar>
            </Stack>
          </Stack>
          <Box
            component="nav"
            aria-label="Sections mobiles"
            className="mobile-nav"
          >
            {sections.map((label, i) => (
              <Button
                key={label}
                aria-current={page === i ? "page" : undefined}
                onClick={() => navigate(i)}
                color={page === i ? "primary" : "inherit"}
                size="small"
              >
                {label}
              </Button>
            ))}
          </Box>
          <Box sx={{ maxWidth: 1320, mx: "auto", p: { xs: 2.5, md: 5 } }}>
            <Stack direction="row" alignItems="center" gap={1} mb={2}>
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  bgcolor: "primary.main",
                  borderRadius: "50%",
                }}
              />
              <Typography className="overline" color="primary">
                ATELIER DESIGN SYSTEM
              </Typography>
            </Stack>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              gap={2}
              alignItems={{ sm: "center" }}
            >
              <Box>
                <Typography
                  component="h1"
                  variant="h3"
                  sx={{ fontSize: { xs: 32, md: 40 } }}
                >
                  {page === 0
                    ? "De bonnes bases. De belles interfaces."
                    : sections[page]}
                </Typography>
                <Typography color="text.secondary" variant="body2" mt={1.5}>
                  Un langage commun pour concevoir et développer avec confiance.
                </Typography>
              </Box>
              <Button
                variant="outlined"
                startIcon={<Code fontSize="small" />}
                onClick={() => setCode(true)}
                sx={{ whiteSpace: "nowrap", alignSelf: "start" }}
              >
                Guide d’installation
              </Button>
            </Stack>
            {page === 0 && (
              <Paper
                className="hero"
                sx={{
                  mt: 4,
                  p: { xs: 3, md: 4 },
                  border: "1px solid",
                  borderColor: dark ? "#534272" : "#E2D9F6",
                  background: dark
                    ? "linear-gradient(110deg,#302640,#242332)"
                    : "linear-gradient(110deg,#F0EAFB,#F5F2FC 60%,#ECE9F8)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Box sx={{ position: "relative", zIndex: 1, maxWidth: 520 }}>
                  <Chip
                    label="VOTRE BOÎTE À OUTILS CRÉATIVE"
                    size="small"
                    sx={{
                      fontSize: 9,
                      letterSpacing: 1,
                      color: dark ? "primary.main" : "#5C3BB3",
                      bgcolor: dark ? "#403153" : "#E5DCF7",
                    }}
                  />
                  <Typography
                    variant="h4"
                    component="h2"
                    sx={{ mt: 2, fontSize: 28 }}
                  >
                    Moins de répétition.
                    <br />
                    Plus de création.
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1.5, maxWidth: 380 }}
                  >
                    Des composants cohérents, des tokens partagés et la
                    flexibilité de MUI. Tout pour donner vie à vos idées.
                  </Typography>
                  <DsButton
                    endIcon={<ArrowForward />}
                    sx={{ mt: 2.5 }}
                    onClick={() => navigate(3)}
                  >
                    Explorer les composants
                  </DsButton>
                </Box>
                <Box className="hero-art" aria-hidden>
                  <Box className="art-square" />
                  <Box className="art-circle" />
                  <Box className="art-dot" />
                  <Box className="art-bar" />
                </Box>
              </Paper>
            )}
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{
                mt: 3,
                borderBottom: "1px solid",
                borderColor: "divider",
                mb: 3,
              }}
            >
              <Tabs
                aria-label="Documentation du design system"
                value={tab}
                onChange={(_, value) => setTab(value)}
              >
                <Tab
                  id="overview-tab"
                  aria-controls="overview-panel"
                  label="Aperçu"
                />
                <Tab
                  id="principles-tab"
                  aria-controls="principles-panel"
                  label="Principes & usage"
                />
              </Tabs>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                Conçu avec soin, construit avec MUI.
              </Typography>
            </Stack>
            <Box
              role="tabpanel"
              id="overview-panel"
              aria-labelledby="overview-tab"
              hidden={tab !== 0}
              tabIndex={0}
            >
              {tab === 0 && (
                <>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ sm: "center" }}
                    gap={2}
                    mb={2.5}
                  >
                    <Typography component="h2" variant="h6" fontSize={18}>
                      {page === 0 ? "Les essentiels" : sections[page]}{" "}
                      <Box
                        component="span"
                        color="text.secondary"
                        sx={{ fontSize: 12, fontWeight: 400, ml: 1 }}
                      >
                        Votre bibliothèque, en un coup d’œil.
                      </Box>
                    </Typography>
                    <TextField
                      placeholder="Rechercher…"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      inputProps={{ "aria-label": "Rechercher un composant" }}
                      sx={{ width: { xs: "100%", sm: 210 } }}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <Search sx={{ fontSize: 18 }} />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Stack>
                  <Box className="card-grid">
                    {filtered.map((card) => (
                      <SectionCard
                        key={card.name}
                        title={card.name}
                        description={card.description}
                      >
                        {card.content}
                      </SectionCard>
                    ))}
                  </Box>
                  {filtered.length === 0 && (
                    <Alert severity="info">
                      Aucun composant trouvé. Essayez « boutons » ou « couleurs
                      ».
                    </Alert>
                  )}
                </>
              )}
            </Box>
            <Box
              role="tabpanel"
              id="principles-panel"
              aria-labelledby="principles-tab"
              hidden={tab !== 1}
              tabIndex={0}
            >
              {tab === 1 && (
                <SectionCard
                  title="Une base commune, des usages précis"
                  description="Les règles essentielles pour garder des interfaces cohérentes."
                >
                  <Stack spacing={2}>
                    <Typography variant="body2">
                      01 — Utilisez le thème et les tokens exportés plutôt que
                      des couleurs locales.
                    </Typography>
                    <Typography variant="body2">
                      02 — Réservez le bouton principal à l’action prioritaire
                      d’une section.
                    </Typography>
                    <Typography variant="body2">
                      03 — Associez chaque champ à un libellé et rendez les
                      erreurs explicites.
                    </Typography>
                    <Typography variant="body2">
                      04 — Respectez la grille de 4 px, testez la navigation
                      clavier et les deux thèmes.
                    </Typography>
                    <Alert severity="info">
                      Les composants héritent des comportements de MUI. Vérifiez
                      l’accessibilité de chaque écran dans son contexte.
                    </Alert>
                    <Button
                      component="a"
                      href={`${import.meta.env.BASE_URL}storybook/`}
                    >
                      Consulter les composants dans Storybook
                    </Button>
                  </Stack>
                </SectionCard>
              )}
            </Box>
            <Stack
              component="footer"
              direction="row"
              justifyContent="space-between"
              gap={2}
              sx={{
                mt: 5,
                pt: 2.5,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Atelier UI · Le détail fait la différence.
              </Typography>
              <Button
                component="a"
                href="https://github.com/michelsonhns/atelier-ui"
                size="small"
                sx={{ p: 0, fontSize: 11 }}
              >
                Code source sur GitHub
              </Button>
            </Stack>
          </Box>
        </Box>
      </Box>
      <Dialog
        open={code}
        onClose={() => setCode(false)}
        fullWidth
        maxWidth="sm"
        aria-labelledby="install-title"
      >
        <DialogTitle id="install-title">
          Commencer avec Atelier UI
          <IconButton
            aria-label="Fermer"
            onClick={() => setCode(false)}
            sx={{ position: "absolute", right: 12, top: 12 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Créez l’archive avec npm run pack:local, installez-la dans votre
            projet, puis importez les composants.
          </Typography>
          <Box
            component="pre"
            sx={{
              bgcolor: "action.hover",
              p: 2,
              borderRadius: 2,
              overflow: "auto",
              fontSize: 12,
            }}
          >
            {installCode}
          </Box>
        </DialogContent>
        <DialogActions sx={{ flexWrap: "wrap", gap: 1 }}>
          <Button onClick={() => copy(installCode)} startIcon={<ContentCopy />}>
            Copier l’exemple
          </Button>
          <DsButton
            onClick={() => {
              setCode(false);
              navigate(3);
            }}
          >
            Voir les composants
          </DsButton>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={!!toast}
        autoHideDuration={4000}
        onClose={() => setToast("")}
        message={toast}
        action={
          <IconButton
            color="inherit"
            aria-label="Fermer le message"
            onClick={() => setToast("")}
          >
            <Close fontSize="small" />
          </IconButton>
        }
      />
    </AtelierProvider>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
