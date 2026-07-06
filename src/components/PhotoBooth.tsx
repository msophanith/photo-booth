'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { Download, Heart, RefreshCw } from 'lucide-react';
import { CameraView } from './CameraView';
import { PhotoStrip } from './PhotoStrip';
import { FloatingDecorations } from './FloatingDecorations';
import { SetupPanel } from './SetupPanel';
import { StickerPicker } from './StickerPicker';
import { exportPhotoStrip } from '@/lib/exportStrip';
import type { PhotoCount } from '@/lib/gridLayout';
import {
  createPlacement,
  type StickerId,
  type StickerPlacement,
} from '@/lib/stickers';
import { THEMES, type ThemeId, type FilterId } from '@/lib/customization';

type BoothPhase = 'welcome' | 'capturing' | 'preview';

const COUNTDOWN_SECONDS = 3;
const GAP_BETWEEN_SHOTS_MS = 1200;

function emptyStickers(count: number): StickerPlacement[][] {
  return Array.from({ length: count }, () => []);
}

export function PhotoBooth() {
  const [phase, setPhase] = useState<BoothPhase>('welcome');
  const [photoCount, setPhotoCount] = useState<PhotoCount>(4);
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [stickersByPhoto, setStickersByPhoto] = useState<StickerPlacement[][]>(
    emptyStickers(4),
  );
  const [selectedSticker, setSelectedSticker] = useState<StickerId | null>(
    null,
  );
  const [currentShot, setCurrentShot] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const captureRef = useRef<(() => string | null) | null>(null);

  // New customization state
  const [theme, setTheme] = useState<ThemeId>('pink');
  const [filter, setFilter] = useState<FilterId>('none');
  const [showDate, setShowDate] = useState(false);

  const themeConfig = THEMES[theme];

  const hasStickers = useMemo(
    () => stickersByPhoto.some((s) => s.length > 0),
    [stickersByPhoto],
  );

  const handlePhotoCountChange = useCallback((count: PhotoCount) => {
    setPhotoCount(count);
    setStickersByPhoto(emptyStickers(count));
  }, []);

  const reset = useCallback(() => {
    setPhase('welcome');
    setPhotos([]);
    setStickersByPhoto(emptyStickers(photoCount));
    setSelectedSticker(null);
    setCurrentShot(0);
    setCountdown(null);
  }, [photoCount]);

  const runCountdown = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      let remaining = COUNTDOWN_SECONDS;
      setCountdown(remaining);

      const tick = () => {
        remaining -= 1;
        if (remaining > 0) {
          setCountdown(remaining);
          setTimeout(tick, 1000);
        } else {
          setCountdown(null);
          resolve();
        }
      };

      setTimeout(tick, 1000);
    });
  }, []);

  const captureSequence = useCallback(async () => {
    setPhase('capturing');
    setPhotos([]);
    setStickersByPhoto(emptyStickers(photoCount));
    setSelectedSticker(null);
    const captured: string[] = [];

    for (let i = 0; i < photoCount; i++) {
      setCurrentShot(i + 1);
      await runCountdown();

      const dataUrl = captureRef.current?.();
      if (dataUrl) {
        captured.push(dataUrl);
        setPhotos([...captured]);
      }

      if (i < photoCount - 1) {
        await new Promise((r) => setTimeout(r, GAP_BETWEEN_SHOTS_MS));
      }
    }

    setPhase('preview');
    setCurrentShot(0);
  }, [photoCount, runCountdown]);

  const handlePhotoClick = useCallback(
    (index: number, x: number, y: number) => {
      if (!selectedSticker) return;

      setStickersByPhoto((prev) => {
        const next = prev.map((slot) => [...slot]);
        next[index] = [...next[index], createPlacement(selectedSticker, x, y)];
        return next;
      });
    },
    [selectedSticker],
  );

  const handleAutoPlace = useCallback(
    (stickerId: StickerId) => {
      if (photos.length === 0) return;
      // Pick a random photo
      const photoIndex = Math.floor(Math.random() * photos.length);
      // Random position within 15%-85% to keep it nicely inside
      const x = 15 + Math.random() * 70;
      const y = 15 + Math.random() * 70;

      setStickersByPhoto((prev) => {
        const next = prev.map((slot) => [...slot]);
        next[photoIndex] = [...next[photoIndex], createPlacement(stickerId, x, y)];
        return next;
      });
    },
    [photos],
  );

  const handleClearStickers = useCallback(() => {
    setStickersByPhoto(emptyStickers(photoCount));
    setSelectedSticker(null);
  }, [photoCount]);

  const handleDownload = useCallback(async () => {
    if (photos.length < photoCount) return;

    setIsDownloading(true);
    try {
      const dataUrl = await exportPhotoStrip({
        photos,
        photoCount,
        name1,
        name2,
        stickersByPhoto,
        theme,
        filter,
        showDate,
      });

      const link = document.createElement('a');
      link.download = `sweet-snap-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      setIsDownloading(false);
    }
  }, [
    photos,
    photoCount,
    name1,
    name2,
    stickersByPhoto,
    theme,
    filter,
    showDate,
  ]);

  return (
    <div className='relative min-h-dvh overflow-hidden'>
      <FloatingDecorations />

      <div className='relative z-10 mx-auto flex min-h-dvh max-w-5xl flex-col items-center px-4 py-8 sm:px-6'>
        <header className='mb-8 text-center'>
          <div className='mb-2 flex items-center justify-center gap-2'>
            <Heart
              className={`h-5 w-5 fill-current animate-pulse-soft ${themeConfig.textClass}`}
              aria-hidden
            />
            <span
              className={`text-sm font-semibold uppercase tracking-widest ${themeConfig.textClass}`}
            >
              Couple Photo Booth
            </span>
            <Heart
              className={`h-5 w-5 fill-current animate-pulse-soft ${themeConfig.textClass}`}
              aria-hidden
            />
          </div>
          <h1
            className={`text-4xl sm:text-5xl md:text-6xl ${themeConfig.textClass}`}
            style={{ fontFamily: 'var(--font-pacifico)' }}
          >
            Sweet Snap
          </h1>
          <p className='mt-3 max-w-md text-base text-foreground/70 sm:text-lg'>
            Snap 4 or 6 cute photos, add stickers, and personalize with your
            names on a lovely 4×6 keepsake strip.
          </p>
        </header>

        <main className='flex w-full flex-1 flex-col items-center gap-8'>
          {phase === 'welcome' && (
            <SetupPanel
              photoCount={photoCount}
              onPhotoCountChange={handlePhotoCountChange}
              name1={name1}
              name2={name2}
              onName1Change={setName1}
              onName2Change={setName2}
              theme={theme}
              onThemeChange={setTheme}
              filter={filter}
              onFilterChange={setFilter}
              showDate={showDate}
              onShowDateChange={setShowDate}
              onStart={captureSequence}
            />
          )}

          {(phase === 'capturing' || phase === 'preview') && (
            <div className='flex w-full flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-center'>
              {phase === 'capturing' && (
                <div className='w-full max-w-lg shrink-0'>
                  <CameraView
                    registerCapture={(fn) => {
                      captureRef.current = fn;
                    }}
                    countdown={countdown}
                    currentShot={currentShot}
                    totalShots={photoCount}
                    active
                  />
                </div>
              )}

              <div className='flex flex-col items-center gap-6'>
                {phase === 'preview' && (
                  <StickerPicker
                    selectedSticker={selectedSticker}
                    onSelectSticker={setSelectedSticker}
                    onAutoPlace={handleAutoPlace}
                    onClearAll={handleClearStickers}
                    hasStickers={hasStickers}
                  />
                )}

                <PhotoStrip
                  photos={photos}
                  photoCount={photoCount}
                  name1={name1}
                  name2={name2}
                  stickersByPhoto={stickersByPhoto}
                  complete={phase === 'preview'}
                  interactive={phase === 'preview'}
                  selectedSticker={!!selectedSticker}
                  onPhotoClick={handlePhotoClick}
                  theme={theme}
                  filter={filter}
                  showDate={showDate}
                />

                {phase === 'preview' && photos.length === photoCount && (
                  <div className='flex flex-wrap items-center justify-center gap-4'>
                    <button
                      type='button'
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className={`flex min-h-12 cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r ${themeConfig.btnFrom} ${themeConfig.btnTo} px-6 py-3 font-bold text-white shadow-md transition-all hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-deep disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                      <Download className='h-5 w-5' />
                      {isDownloading ? 'Saving…' : 'Download Strip'}
                    </button>
                    <button
                      type='button'
                      onClick={reset}
                      className={`flex min-h-12 cursor-pointer items-center gap-2 rounded-full border-2 border-pink-soft bg-white px-6 py-3 font-bold transition-all hover:bg-pink-soft/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-deep ${themeConfig.textClass}`}
                    >
                      <RefreshCw className='h-5 w-5' />
                      Take Again
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>

        <footer className='mt-8 text-center text-sm text-foreground/50'>
          Made with love for couples everywhere
        </footer>
      </div>
    </div>
  );
}
