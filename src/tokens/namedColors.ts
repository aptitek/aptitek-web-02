// Role-specific named colors
export const ROLE_COLORS = {
  student: "#859900", // Green
  instructor: "#268bd2", // Blue
  admin: "#d33682", // Magenta
  guest: "#586e75", // Base01 Slate
} as const;

// Celestial / Astronomy named colors (Sun, Moon, Horizon)
export const CELESTIAL_COLORS = {
  sun: {
    main: "#b58900", // Amber / Gold
    glow: "#d4a400",
    light: "#fdf6e3",
    goldenHourCore: "#fff3cc", // Warm brilliant golden-hour center
    goldenHourMid: "#f5af19", // Radiant golden hour solar gold
    goldenHourRim: "#d48800", // Defined golden hour disc edge
    goldenHourAura: "#e67e22", // Sunset amber corona
  },
  moon: {
    main: "#268bd2", // Blue
    glow: "#6c71c4", // Violet
    crater: "#586e75",
  },
  horizon: {
    day: "#fdf6e3",
    night: "#002b36",
  },
} as const;

// Official Identity Card & National / International flag colors
export const EU_FLAG_COLORS = {
  blue: "#003399", // EU Reflex Blue field
  gold: "#ffcc00", // EU Yellow 12-stars circle & country code
} as const;

export const FRENCH_FLAG_COLORS = {
  blue: "#002654", // Official French Navy/Marianne Blue
  white: "#ffffff",
  red: "#ed2939", // Official French Red
} as const;

export const UK_FLAG_COLORS = {
  blue: "#012169", // Union Jack Blue
  red: "#c8102e", // Union Jack Red
  white: "#ffffff",
} as const;

export const FLAG_COLORS = {
  eu: EU_FLAG_COLORS,
  fr: FRENCH_FLAG_COLORS,
  uk: UK_FLAG_COLORS,
} as const;

// Botanical / Organic nature color tokens
export const BOTANICAL_COLORS = {
  leafVeinDark: "#1f4e2b", // Rich darker forest green for leaf skeleton and veins
  grassBladeLight: "#a6bd1a", // Sunny meadow light green (lighter than background #859900)
  grassBladeHighlight: "#c2d936", // Vibrant sunlit lime-green highlight
  grassBladeWarm: "#d8c93b", // Light golden chartreuse grass blade
} as const;

// Soft Pastel Sunset Sky Palette
export const PASTEL_SKY_COLORS = {
  zenith: "#fdf8f0", // Pale morning/evening airy cream
  pastelPink: "#f5cad3", // Soft gentle pastel blush pink
  pastelOrange: "#fcd9be", // Delicate pastel peach / warm apricot
  pastelYellow: "#fae8be", // Soft warm buttercup gold
  horizon: "#eee6d3", // Soft luminous base2 horizon transition
} as const;

// Progress percentage-based theme color spectrum
export const PROGRESS_THEME_COLORS = {
  purple: "#6c71c4",
  blue: "#268bd2",
  cyan: "#2aa198",
  green: "#859900",
  yellow: "#b58900",
  orange: "#cb4b16",
  red: "#dc322f",
  magenta: "#d33682",
  darkContrast: "#002b36",
  lightContrast: "#ffffff",
} as const;

// Aggregated Named Color Tokens
export const NAMED_COLORS = {
  roles: ROLE_COLORS,
  celestial: CELESTIAL_COLORS,
  flags: FLAG_COLORS,
  progress: PROGRESS_THEME_COLORS,
} as const;

export type NamedColors = typeof NAMED_COLORS;
export type RoleColors = typeof ROLE_COLORS;
export type CelestialColors = typeof CELESTIAL_COLORS;
export type FlagColors = typeof FLAG_COLORS;
export type ProgressThemeColors = typeof PROGRESS_THEME_COLORS;
export type BotanicalColors = typeof BOTANICAL_COLORS;
export type PastelSkyColors = typeof PASTEL_SKY_COLORS;
