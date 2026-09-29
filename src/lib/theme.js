export const themePresets = {
  psg_real: {
    name: "PSG Official Real",
    category: "PSG Tech - Real Time",
    colors: {
      primary: "#1a3263",
      secondary: "#547792",
      accent: "#fab95b",
      bg: "#e8e2db",
      surface: "#ffffff",
      text: "#1a3263",
      muted: "#547792",
    },
    typography: "modern",
    headerStyle: "classic",
    cardStyle: "elevated",
    buttonStyle: "rounded",
    description: "Real PSG Tech - #e8e2db beige, #fab95b gold, #547792 slate, #1a3263 navy - 100% real images from psgtech.edu"
  },
  engineering_blue: {
    name: "Navy Gold Beige",
    category: "Engineering - Your Palette",
    colors: {
      primary: "#1a3263",
      secondary: "#547792",
      accent: "#fab95b",
      bg: "#e8e2db",
      surface: "#ffffff",
      text: "#1a3263",
      muted: "#547792",
    },
    typography: "modern",
    headerStyle: "classic",
    cardStyle: "elevated",
    buttonStyle: "rounded",
    description: "Deep navy #1a3263 + slate #547792 + gold #fab95b + beige #e8e2db - Premium"
  },
  arts_maroon: {
    name: "Heritage Beige Gold",
    category: "Arts & Science - Your Palette",
    colors: {
      primary: "#1a3263",
      secondary: "#547792",
      accent: "#fab95b",
      bg: "#e8e2db",
      surface: "#fdf6ee",
      text: "#1a3263",
      muted: "#547792",
    },
    typography: "elegant",
    headerStyle: "heritage",
    cardStyle: "soft",
    buttonStyle: "pill",
    description: "Same palette - beige #e8e2db background with heritage layout - unique but same colors"
  },
  corporate_slate: {
    name: "Corporate Navy Gold",
    category: "Management - Your Palette",
    colors: {
      primary: "#1a3263",
      secondary: "#547792",
      accent: "#fab95b",
      bg: "#e8e2db",
      surface: "#ffffff",
      text: "#1a3263",
      muted: "#547792",
    },
    typography: "corporate",
    headerStyle: "minimal",
    cardStyle: "sharp",
    buttonStyle: "sharp",
    description: "Corporate minimal using #1a3263 navy #547792 slate #fab95b gold #e8e2db beige"
  },
  medical_teal: {
    name: "Clinical Navy Beige",
    category: "Medical - Your Palette",
    colors: {
      primary: "#1a3263",
      secondary: "#547792",
      accent: "#fab95b",
      bg: "#e8e2db",
      surface: "#ffffff",
      text: "#1a3263",
      muted: "#547792",
    },
    typography: "clean",
    headerStyle: "clinical",
    cardStyle: "clean",
    buttonStyle: "rounded",
    description: "Healthcare clean using your 4 colors - navy slate gold beige"
  },
  royal_purple: {
    name: "Royal Navy Gold",
    category: "University - Your Palette",
    colors: {
      primary: "#1a3263",
      secondary: "#547792",
      accent: "#fab95b",
      bg: "#e8e2db",
      surface: "#ffffff",
      text: "#1a3263",
      muted: "#547792",
    },
    typography: "prestige",
    headerStyle: "grand",
    cardStyle: "elevated",
    buttonStyle: "rounded",
    description: "Prestigious using #1a3263 #547792 #fab95b #e8e2db - unique layout"
  },
  forest_green: {
    name: "Organic Beige Navy",
    category: "Agriculture - Your Palette",
    colors: {
      primary: "#1a3263",
      secondary: "#547792",
      accent: "#fab95b",
      bg: "#e8e2db",
      surface: "#ffffff",
      text: "#1a3263",
      muted: "#547792",
    },
    typography: "organic",
    headerStyle: "organic",
    cardStyle: "soft",
    buttonStyle: "pill",
    description: "Organic layout but same palette #e8e2db #fab95b #547792 #1a3263 - unique"
  }
}

export function applyCollegeTheme(college) {
  const preset = themePresets[college.branding?.preset] || themePresets.psg_real
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
