"use client";

import { Camera, Heart } from "lucide-react";
import {
  formatCoupleNames,
  formatFooter,
  getGridLayout,
  type PhotoCount,
} from "@/lib/gridLayout";
import { getStickerEmoji, type StickerPlacement } from "@/lib/stickers";

type PhotoStripProps = {
  photos: string[];
  photoCount: PhotoCount;
  name1: string;
  name2: string;
  stickersByPhoto: StickerPlacement[][];
  complete: boolean;
  interactive?: boolean;
  selectedSticker?: boolean;
  onPhotoClick?: (index: number, x: number, y: number) => void;
};

export function PhotoStrip({
  photos,
  photoCount,
  name1,
  name2,
  stickersByPhoto,
  complete,
  interactive = false,
  selectedSticker = false,
  onPhotoClick,
}: PhotoStripProps) {
  const { cols, rows } = getGridLayout(photoCount);
  const title = formatCoupleNames(name1, name2);

  const handleClick = (
    index: number,
    e: React.MouseEvent<HTMLDivElement>,
  ) => {
    if (!interactive || !onPhotoClick || !photos[index]) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    onPhotoClick(index, x, y);
  };

  return (
    <div
      className="relative w-full max-w-xs sm:max-w-sm"
      aria-label="Photo strip preview"
    >
      <div
        className={`relative overflow-hidden rounded-2xl border-4 bg-white p-3 shadow-xl transition-colors duration-500 ${
          complete
            ? "border-pink-deep shadow-pink-deep/25"
            : "border-pink-soft shadow-pink-soft/20"
        }`}
        style={{ aspectRatio: "2 / 3" }}
      >
        <div className="mb-2 flex items-center justify-center gap-2 border-b border-dashed border-pink-soft/60 pb-2">
          <Heart className="h-3 w-3 fill-pink-deep text-pink-deep" aria-hidden />
          <span
            className="truncate text-base text-pink-deep sm:text-lg"
            style={{ fontFamily: "var(--font-pacifico)" }}
          >
            {title}
          </span>
          <Heart className="h-3 w-3 fill-pink-deep text-pink-deep" aria-hidden />
        </div>

        <div
          className="grid h-[calc(100%-2.75rem)] gap-1.5"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
          }}
        >
          {Array.from({ length: photoCount }).map((_, i) => {
            const photo = photos[i];
            const stickers = stickersByPhoto[i] ?? [];

            return (
              <div
                key={i}
                role={interactive && photo ? "button" : undefined}
                tabIndex={interactive && photo ? 0 : undefined}
                onClick={(e) => handleClick(i, e)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onPhotoClick?.(i, 50, 50);
                  }
                }}
                className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-lavender/40 to-pink-soft/30 ${
                  interactive && photo && selectedSticker
                    ? "cursor-crosshair ring-2 ring-pink-deep/40 ring-offset-1"
                    : interactive && photo
                      ? "cursor-pointer hover:ring-2 hover:ring-pink-soft/60"
                      : ""
                }`}
              >
                {photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photo}
                    alt={`Couple photo ${i + 1}`}
                    className="pointer-events-none h-full w-full object-cover"
                    draggable={false}
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-foreground/30">
                    <Camera className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.5} />
                    <span className="text-xs font-semibold">{i + 1}</span>
                  </div>
                )}

                {stickers.map((sticker) => (
                  <span
                    key={sticker.id}
                    className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 select-none drop-shadow-md"
                    style={{
                      left: `${sticker.x}%`,
                      top: `${sticker.y}%`,
                      fontSize: `${1.4 * sticker.scale}rem`,
                    }}
                    aria-hidden
                  >
                    {getStickerEmoji(sticker.stickerId)}
                  </span>
                ))}

                <span className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white/80 text-[10px] font-bold text-pink-deep">
                  {i + 1}
                </span>
              </div>
            );
          })}
        </div>

        {complete && (
          <p className="mt-2 truncate text-center text-[10px] font-semibold tracking-wider text-foreground/40 uppercase">
            {formatFooter(name1, name2)}
          </p>
        )}
      </div>

      <div
        className="absolute -top-2 left-1/2 h-6 w-16 -translate-x-1/2 rounded-sm bg-peach/70 shadow-sm"
        aria-hidden
      />
    </div>
  );
}
