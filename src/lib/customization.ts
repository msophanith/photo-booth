export type ThemeId = "pink" | "blue" | "green" | "lavender";

export type ThemeConfig = {
  name: string;
  /** Swatch colour shown in the theme picker */
  swatch: string;
  /** Tailwind border class for the strip wrapper */
  borderClass: string;
  /** Tailwind text class for titles */
  textClass: string;
  /** Tailwind gradient for empty photo cells */
  bgGradientClass: string;
  /** Tailwind ring class for interactive photos */
  ringClass: string;
  /** Canvas stroke colour for border & dashes */
  canvasBorder: string;
  /** Canvas fill colour for header text */
  canvasText: string;
  /** Canvas fill colour for footer text */
  canvasFooter: string;
  /** Gradient button classes (from/to) */
  btnFrom: string;
  btnTo: string;
};

export const THEMES: Record<ThemeId, ThemeConfig> = {
  pink: {
    name: "Classic Pink",
    swatch: "#ff8fab",
    borderClass: "border-pink-deep",
    textClass: "text-pink-deep",
    bgGradientClass: "from-lavender/40 to-pink-soft/30",
    ringClass: "ring-pink-deep/40",
    canvasBorder: "#ffb7c5",
    canvasText: "#ff8fab",
    canvasFooter: "#5c3d4e66",
    btnFrom: "from-pink-deep",
    btnTo: "to-lavender-deep",
  },
  blue: {
    name: "Baby Blue",
    swatch: "#60a5fa",
    borderClass: "border-blue-400",
    textClass: "text-blue-500",
    bgGradientClass: "from-blue-100/50 to-sky-100/40",
    ringClass: "ring-blue-400/40",
    canvasBorder: "#93c5fd",
    canvasText: "#60a5fa",
    canvasFooter: "#3b506a66",
    btnFrom: "from-blue-500",
    btnTo: "to-sky-400",
  },
  green: {
    name: "Mint Green",
    swatch: "#34d399",
    borderClass: "border-emerald-400",
    textClass: "text-emerald-500",
    bgGradientClass: "from-emerald-100/50 to-teal-50/40",
    ringClass: "ring-emerald-400/40",
    canvasBorder: "#6ee7b7",
    canvasText: "#34d399",
    canvasFooter: "#3d5c4e66",
    btnFrom: "from-emerald-500",
    btnTo: "to-teal-400",
  },
  lavender: {
    name: "Lavender",
    swatch: "#a78bfa",
    borderClass: "border-violet-400",
    textClass: "text-violet-500",
    bgGradientClass: "from-violet-100/50 to-purple-50/40",
    ringClass: "ring-violet-400/40",
    canvasBorder: "#c4b5fd",
    canvasText: "#a78bfa",
    canvasFooter: "#4e3d5c66",
    btnFrom: "from-violet-500",
    btnTo: "to-purple-400",
  },
};

export const THEME_IDS: ThemeId[] = ["pink", "blue", "green", "lavender"];

// ── Filters ──

export type FilterId = "none" | "bw" | "sepia";

export type FilterConfig = {
  name: string;
  /** CSS filter string for live preview */
  css: string;
  /** Canvas filter string for export */
  canvas: string;
};

export const FILTERS: Record<FilterId, FilterConfig> = {
  none: { name: "Normal", css: "none", canvas: "none" },
  bw: { name: "B & W", css: "grayscale(100%)", canvas: "grayscale(100%)" },
  sepia: { name: "Sepia", css: "sepia(80%) saturate(60%)", canvas: "sepia(80%) saturate(60%)" },
};

export const FILTER_IDS: FilterId[] = ["none", "bw", "sepia"];
