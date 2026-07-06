export type StickerId =
  | "heart"
  | "sparkle"
  | "kiss"
  | "bow"
  | "crown"
  | "flower"
  | "star"
  | "bear";

export type StickerPlacement = {
  id: string;
  stickerId: StickerId;
  x: number;
  y: number;
  scale: number;
};

export const STICKERS: { id: StickerId; emoji: string; label: string }[] = [
  { id: "heart", emoji: "❤️", label: "Heart" },
  { id: "sparkle", emoji: "✨", label: "Sparkle" },
  { id: "kiss", emoji: "💋", label: "Kiss" },
  { id: "bow", emoji: "🎀", label: "Bow" },
  { id: "crown", emoji: "👑", label: "Crown" },
  { id: "flower", emoji: "🌸", label: "Flower" },
  { id: "star", emoji: "⭐", label: "Star" },
  { id: "bear", emoji: "🧸", label: "Bear" },
];

export function getStickerEmoji(id: StickerId): string {
  return STICKERS.find((s) => s.id === id)?.emoji ?? "❤️";
}

export function createPlacement(
  stickerId: StickerId,
  x: number,
  y: number,
): StickerPlacement {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    stickerId,
    x,
    y,
    scale: 1,
  };
}
