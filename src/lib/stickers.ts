export type StickerId =
  | 'heart'
  | 'sparkle'
  | 'kiss'
  | 'bow'
  | 'crown'
  | 'flower'
  | 'star'
  | 'bear'
  | 'matcha'
  | 'coffee'
  | 'rose'
  | 'cherry'
  | 'butterfly'
  | 'moon'
  | 'cake'
  | 'candy';

export type StickerPlacement = {
  id: string;
  stickerId: StickerId;
  x: number;
  y: number;
  scale: number;
};

export const STICKERS: { id: StickerId; emoji: string; label: string }[] = [
  { id: 'heart', emoji: '❤️', label: 'Heart' },
  { id: 'sparkle', emoji: '✨', label: 'Sparkle' },
  { id: 'kiss', emoji: '💋', label: 'Kiss' },
  { id: 'bow', emoji: '🎀', label: 'Bow' },
  { id: 'crown', emoji: '👑', label: 'Crown' },
  { id: 'flower', emoji: '🌸', label: 'Flower' },
  { id: 'star', emoji: '⭐', label: 'Star' },
  { id: 'bear', emoji: '🧸', label: 'Bear' },
  { id: 'matcha', emoji: '🍵', label: 'Matcha' },
  { id: 'coffee', emoji: '☕', label: 'Coffee' },
  { id: 'rose', emoji: '🌹', label: 'Rose' },
  { id: 'cherry', emoji: '🍒', label: 'Cherry' },
  { id: 'butterfly', emoji: '🦋', label: 'Butterfly' },
  { id: 'moon', emoji: '🌙', label: 'Moon' },
  { id: 'cake', emoji: '🍰', label: 'Cake' },
  { id: 'candy', emoji: '🍬', label: 'Candy' },
];

export function getStickerEmoji(id: StickerId): string {
  return STICKERS.find((s) => s.id === id)?.emoji ?? '❤️';
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
