"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Heart } from "lucide-react";

type CameraViewProps = {
  registerCapture: (fn: () => string | null) => void;
  countdown: number | null;
  currentShot: number;
  totalShots: number;
  active: boolean;
};

export function CameraView({
  registerCapture,
  countdown,
  currentShot,
  totalShots,
  active,
}: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const capture = useCallback((): string | null => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    return canvas.toDataURL("image/jpeg", 0.92);
  }, []);

  useEffect(() => {
    registerCapture(capture);
  }, [registerCapture, capture]);

  useEffect(() => {
    if (!active) return;

    let cancelled = false;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch {
        setError(
          "Camera access denied. Please allow camera permissions and try again.",
        );
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [active]);

  return (
    <div className="relative overflow-hidden rounded-3xl border-4 border-pink-soft bg-white p-2 shadow-xl shadow-pink-soft/30">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-foreground/5">
        {error ? (
          <div className="flex h-full w-full items-center justify-center p-6 text-center text-sm font-semibold text-foreground/70">
            {error}
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full scale-x-[-1] object-cover"
            aria-label="Camera preview"
          />
        )}
        <canvas ref={canvasRef} className="hidden" aria-hidden />

        {/* Cute corner hearts */}
        <Heart
          className="absolute left-3 top-3 h-6 w-6 fill-white/80 text-white/80 drop-shadow"
          aria-hidden
        />
        <Heart
          className="absolute right-3 top-3 h-6 w-6 fill-white/80 text-white/80 drop-shadow"
          aria-hidden
        />

        {/* Shot progress */}
        <div className="absolute left-0 right-0 top-3 flex justify-center gap-2 px-4">
          {Array.from({ length: totalShots }).map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 max-w-12 rounded-full transition-all duration-300 ${
                i < currentShot - 1
                  ? "bg-mint"
                  : i === currentShot - 1
                    ? "bg-pink-deep animate-pulse-soft"
                    : "bg-white/50"
              }`}
            />
          ))}
        </div>

        {/* Countdown overlay */}
        {countdown !== null && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-foreground/20 backdrop-blur-[2px]"
            role="status"
            aria-live="polite"
            aria-label={`${countdown}`}
          >
            <span
              key={countdown}
              className="animate-countdown-pop text-8xl font-extrabold text-white drop-shadow-lg"
              style={{ fontFamily: "var(--font-pacifico)" }}
            >
              {countdown}
            </span>
          </div>
        )}

        {/* Flash effect on capture moment */}
        {countdown === null && currentShot > 0 && (
          <div className="pointer-events-none absolute inset-0 animate-[flash_0.3s_ease-out] bg-white opacity-0" />
        )}
      </div>

      <p className="mt-3 text-center text-sm font-semibold text-foreground/70">
        Photo {Math.min(currentShot, totalShots)} of {totalShots}
      </p>
    </div>
  );
}
