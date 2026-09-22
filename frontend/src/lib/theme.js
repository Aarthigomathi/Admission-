export const themePresets = {
  engineering_blue: {
    name: "Academic Blue",
    category: "Engineering",
    colors: {
      primary: "#0f2c5c",
      secondary: "#1e4a8a",
      accent: "#f59e0b",
      bg: "#ffffff",
      surface: "#f6f8fb",
      text: "#0f172a",
      muted: "#64748b",
    },
    typography: "modern",
    headerStyle: "classic",
    cardStyle: "elevated",
    buttonStyle: "rounded",
    description: "For engineering & technology institutions"
  },
  arts_maroon: {
    name: "Heritage Maroon",
    category: "Arts & Science",
    colors: {
      primary: "#6b1d2a",
      secondary: "#8b2d3b",
      accent: "#d4a017",
      bg: "#fffbf7",
      surface: "#fdf2e9",
      text: "#2c1810",
      muted: "#8b7355",
    },
    typography: "elegant",
    headerStyle: "heritage",
    cardStyle: "soft",
    buttonStyle: "pill",
    description: "Elegant cultural heritage for arts colleges"
  },
  corporate_slate: {
    name: "Corporate Slate",
    category: "Management",
    colors: {
      primary: "#111827",
      secondary: "#374151",
      accent: "#10b981",
      bg: "#ffffff",
      surface: "#f9fafb",
      text: "#111827",
      muted: "#6b7280",
    },
    typography: "corporate",
    headerStyle: "minimal",
    cardStyle: "sharp",
    buttonStyle: "sharp",
    description: "Modern corporate for B-schools"
  },
  medical_teal: {
    name: "Healthcare Teal",
    category: "Medical",
    colors: {
      primary: "#0f766e",
      secondary: "#115e59",
      accent: "#06b6d4",
      bg: "#ffffff",
      surface: "#f0fdfa",
      text: "#042f2e",
      muted: "#5f8a8b",
    },
    typography: "clean",
    headerStyle: "clinical",
    cardStyle: "clean",
    buttonStyle: "rounded",
    description: "Clean healthcare aesthetic"
  },
  royal_purple: {
    name: "Royal Purple",
    category: "University",
    colors: {
      primary: "#4c1d95",
      secondary: "#6d28d9",
      accent: "#fbbf24",
      bg: "#ffffff",
      surface: "#f5f3ff",
      text: "#1e1b4b",
      muted: "#6b7280",
    },
    typography: "prestige",
    headerStyle: "grand",
    cardStyle: "elevated",
    buttonStyle: "rounded",
    description: "Prestigious university feel"
  },
  forest_green: {
    name: "Forest Green",
    category: "Agriculture / Rural",
    colors: {
      primary: "#14532d",
      secondary: "#166534",
      accent: "#facc15",
      bg: "#ffffff",
      surface: "#f0fdf4",
      text: "#052e16",
      muted: "#4a7c59",
    },
    typography: "organic",
    headerStyle: "organic",
    cardStyle: "soft",
    buttonStyle: "pill",
    description: "Natural, grounded, sustainable"
  }
}

export function applyCollegeTheme(college) {
  const preset = themePresets[college.branding?.preset] || themePresets.engineering_blue
  const custom = college.branding?.colors || {}
  const colors = { ...preset.colors, ...custom }
  return {
    preset,
    style: {
      '--college-primary': colors.primary,
      '--college-secondary': colors.secondary,
      '--college-accent': colors.accent,
      '--college-bg': colors.bg,
      '--college-surface': colors.surface,
      '--college-text': colors.text,
      '--college-muted': colors.muted,
    },
    colors
  }
}
