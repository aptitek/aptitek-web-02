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

// Seasonal Environment Color Tokens
export const SEASON_COLORS = {
  spring: {
    blossom: "#fbb1bd", // Soft sakura petal pink
    blossomDeep: "#f48498", // Rich cherry blossom pink
    blossomCore: "#e05780", // Cherry blossom flower center
    blossomPetal: "#ffccd5", // Light translucent petal
    canopyA: "#fbb1bd",
    canopyB: "#f48498",
    canopyWarm: "#ffccd5",
    hillBack: "#eee8d5",
    hillMid: "#b58900",
    hillFront: "#9ec43b",
    hills: "#859900",
    grass: "#9ec43b",
  },
  summer: {
    canopyA: "#859900", // Vibrant solarized meadow green
    canopyB: "#4d7318", // Deep botanical forest green
    deepCanopyA: "#1f4e2b", // Rich deep forest shadow green
    deepCanopyB: "#2e6030", // Deep shade moss green
    canopyWarm: "#a6bd1a", // Sunny meadow light green
    canopyLight: "#c2d936", // Sunlit lime-green highlight
    hillBack: "#eee8d5",
    hillMid: "#b58900",
    hillFront: "#859900",
    hills: "#859900",
    grass: "#a6bd1a",
  },
  fall: {
    foliageGold: "#e5a823", // Warm golden amber
    foliageOrange: "#d35400", // Fiery autumn orange
    foliageRed: "#b83b1f", // Russet maple red
    foliageSienna: "#873600", // Burnt sienna
    canopyA: "#d35400",
    canopyB: "#b83b1f",
    canopyWarm: "#e5a823",
    hillBack: "#fae8be",
    hillMid: "#d35400",
    hillFront: "#b58900",
    hills: "#b58900",
    grass: "#d8c93b",
  },
  winter: {
    snowWhite: "#f8fcfd", // Alpine snow white
    snowSoft: "#e0f2f1", // Soft snowy shadow
    frostSlate: "#93a1a1", // Frosted slate
    iceCyan: "#2aa198", // Ice highlight
    canopyA: "#93a1a1",
    canopyB: "#586e75",
    canopyWarm: "#e0f2f1",
    hillBack: "#f8fcfd",
    hillMid: "#e0f2f1",
    hillFront: "#eee8d5",
    hills: "#eee8d5",
    grass: "#93a1a1",
  },
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
  seasons: SEASON_COLORS,
} as const;

export type NamedColors = typeof NAMED_COLORS;
export type RoleColors = typeof ROLE_COLORS;
export type CelestialColors = typeof CELESTIAL_COLORS;
export type FlagColors = typeof FLAG_COLORS;
export type ProgressThemeColors = typeof PROGRESS_THEME_COLORS;
export type BotanicalColors = typeof BOTANICAL_COLORS;
export type PastelSkyColors = typeof PASTEL_SKY_COLORS;
export type SeasonColors = typeof SEASON_COLORS;
