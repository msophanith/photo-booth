'use client';

import { Eraser, Sticker } from 'lucide-react';
import { STICKERS, type StickerId } from '@/lib/stickers';

type StickerPickerProps = {
  selectedSticker: StickerId | null;
  onSelectSticker: (id: StickerId | null) => void;
  onAutoPlace: (id: StickerId) => void;
  onClearAll: () => void;
  hasStickers: boolean;
};

export function StickerPicker({
  selectedSticker,
  onSelectSticker,
  onAutoPlace,
  onClearAll,
  hasStickers,
}: StickerPickerProps) {
  const handleClick = (id: StickerId) => {
    // Auto-place immediately on the strip
    onAutoPlace(id);
    // Also keep it selected so the user can tap photos to place more
    onSelectSticker(id);
  };

  return (
    <div className='w-full max-w-xs rounded-2xl border-2 border-pink-soft/60 bg-white/90 p-4 shadow-sm backdrop-blur-sm sm:max-w-sm'>
      <div className='mb-3 flex items-center justify-between'>
        <p className='flex items-center gap-2 text-sm font-bold text-foreground/80'>
          <Sticker className='h-4 w-4 text-pink-deep' />
          Add stickers
        </p>
        {hasStickers && (
          <button
            type='button'
            onClick={onClearAll}
            className='flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-foreground/50 transition-colors hover:bg-pink-soft/20 hover:text-pink-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-pink-deep'
          >
            <Eraser className='h-3 w-3' />
            Clear all
          </button>
        )}
      </div>

      <p className='mb-3 text-xs text-foreground/50'>
        Tap a sticker to place it · tap a photo for precise placement
      </p>

      <div className='grid grid-cols-4 gap-2'>
        {STICKERS.map((sticker) => (
          <button
            key={sticker.id}
            type='button'
            onClick={() => handleClick(sticker.id)}
            aria-label={sticker.label}
            aria-pressed={selectedSticker === sticker.id}
            className={`flex min-h-11 cursor-pointer flex-col items-center justify-center rounded-xl border-2 text-2xl transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-deep ${
              selectedSticker === sticker.id
                ? 'border-pink-deep bg-pink-soft/30 scale-105 shadow-md'
                : 'border-pink-soft/40 bg-white hover:border-pink-soft hover:bg-pink-soft/10'
            }`}
          >
            {sticker.emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
