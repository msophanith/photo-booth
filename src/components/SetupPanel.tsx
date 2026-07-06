"use client";

import { Camera, Heart, Sparkles, User } from "lucide-react";
import type { PhotoCount } from "@/lib/gridLayout";

type SetupPanelProps = {
  photoCount: PhotoCount;
  onPhotoCountChange: (count: PhotoCount) => void;
  name1: string;
  name2: string;
  onName1Change: (value: string) => void;
  onName2Change: (value: string) => void;
  onStart: () => void;
};

export function SetupPanel({
  photoCount,
  onPhotoCountChange,
  name1,
  name2,
  onName1Change,
  onName2Change,
  onStart,
}: SetupPanelProps) {
  const gridLabel = photoCount === 4 ? "2×2 grid" : "2×3 grid";

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-6">
      <div className="relative w-full overflow-hidden rounded-3xl border-4 border-pink-soft bg-white p-2 shadow-xl shadow-pink-soft/30">
        <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-gradient-to-br from-lavender via-pink-soft/40 to-peach/60 p-6">
          <div className="text-center">
            <Camera
              className="mx-auto mb-3 h-14 w-14 text-pink-deep"
              strokeWidth={1.5}
            />
            <p className="text-lg font-semibold text-foreground/80">
              Ready for your close-up?
            </p>
            <p className="mt-1 text-sm text-foreground/60">
              {photoCount} photos · {gridLabel} · 4×6 strip
            </p>
          </div>
        </div>
      </div>

      <div className="w-full space-y-5 rounded-2xl border-2 border-pink-soft/60 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
        <fieldset>
          <legend className="mb-3 text-sm font-bold text-foreground/80">
            How many photos?
          </legend>
          <div className="flex gap-3">
            {([4, 6] as PhotoCount[]).map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => onPhotoCountChange(count)}
                className={`flex min-h-11 flex-1 cursor-pointer items-center justify-center rounded-xl border-2 text-base font-bold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-deep ${
                  photoCount === count
                    ? "border-pink-deep bg-pink-deep text-white shadow-md"
                    : "border-pink-soft/80 bg-white text-foreground/70 hover:border-pink-soft hover:bg-pink-soft/10"
                }`}
              >
                {count} photos
              </button>
            ))}
          </div>
        </fieldset>

        <div className="space-y-3">
          <p className="text-sm font-bold text-foreground/80">
            <Heart className="mr-1 inline h-4 w-4 fill-pink-deep text-pink-deep" />
            Your names
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 flex items-center gap-1 text-xs font-semibold text-foreground/60">
                <User className="h-3 w-3" />
                Partner 1
              </span>
              <input
                type="text"
                value={name1}
                onChange={(e) => onName1Change(e.target.value)}
                placeholder="Alex"
                maxLength={20}
                className="w-full rounded-xl border-2 border-pink-soft/50 bg-white px-4 py-2.5 text-base outline-none transition-colors focus:border-pink-deep"
              />
            </label>
            <label className="block">
              <span className="mb-1 flex items-center gap-1 text-xs font-semibold text-foreground/60">
                <User className="h-3 w-3" />
                Partner 2
              </span>
              <input
                type="text"
                value={name2}
                onChange={(e) => onName2Change(e.target.value)}
                placeholder="Jordan"
                maxLength={20}
                className="w-full rounded-xl border-2 border-pink-soft/50 bg-white px-4 py-2.5 text-base outline-none transition-colors focus:border-pink-deep"
              />
            </label>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="group flex min-h-12 cursor-pointer items-center gap-3 rounded-full bg-gradient-to-r from-pink-deep to-lavender-deep px-8 py-4 text-lg font-bold text-white shadow-lg shadow-pink-deep/30 transition-all duration-200 hover:scale-105 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-deep active:scale-95"
      >
        <Sparkles className="h-5 w-5 transition-transform group-hover:rotate-12" />
        Start Photo Booth
      </button>
    </div>
  );
}
